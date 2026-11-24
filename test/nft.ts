import 'mocha'
import * as assert from 'assert'
import ByteBuffer from '../src/bytebuffer'

import {
    Asset,
    checkNftMint,
    cryptoUtils,
    formatNftId,
    isNftId,
    NFT_LATEST_EXPIRATION,
    NFT_MAX_LICENSE_BYTES,
    NFT_NEVER_EXPIRES,
    nftMintFee,
    nftRoyalty,
    nftSaleSplit,
    normalizeOperation,
    normalizeTransaction,
    Operation,
    parseNftId,
    PrivateKey,
    Serializer,
    Transaction,
    Types,
    utf8ByteLength,
    utils
} from '../src'

function serialize(serializer: Serializer, data: any) {
    const buffer = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
    serializer(buffer, data)
    buffer.flip()
    return Buffer.from(buffer.toBuffer()).toString('hex')
}

/*
 * Bytes printed by a probe compiled against the node's own headers (pixagram 1.31 with the
 * hardfork 32 patch): fc::raw::pack of hive::protocol::operation in the legacy pack mode, which is
 * what signatures cover. nft_wire_probe.cpp is in the checks kit next to the patch.
 */
const NODE = {
    mint: '2505616c696365000a6d792d617274776f726b0500e80310504958415f4c4943454e53452f312e30881300000000000003505853000000000000',
    mintUtf8: '2505616c69636500067365726965731027c409244c6963656e636520c2ab20746f75732064726f6974732072c3a973657276c3a97320c2bb809698000000000003505853000000000000',
    list: '2503626f620105616c6963650a6d792d617274776f726b030050c30000000000000350585300000000ffffffff0000',
    listReserve: '25056361726f6c01056361726f6c0464726f7000008813000000000000035058530000000000cb5f6b0000',
    unlist: '2503626f620205616c6963650a6d792d617274776f726b03000000',
    unlistReserve: '25056361726f6c02056361726f6c0464726f7000000000',
    buy: '2504646176650305616c6963650a6d792d617274776f726b030050c300000000000003505853000000000000',
    buyReserve: '25046572696e03056361726f6c0464726f700000881300000000000003505853000000000000',
    transfer: '2505616c6963650405616c6963650a6d792d617274776f726b0200056672616e6b0000',
    burn: '2505616c6963650405616c6963650a6d792d617274776f726b0400046e756c6c0000',
    txMint: 'd204f776e54207486a59012505616c696365000a6d792d617274776f726b0500e80310504958415f4c4943454e53452f312e3088130000000000000350585300000000000000',
    transferOp: '0203666f6f03626172e80300000000000003504958410000000f77656464696e672070726573656e74',
    commentOptions: '1305616c696365017000ca9a3b0000000003505853000000000000010100',
    claimRewardBalance: '2705616c696365010000000000000003504958410000000200000000000000035058530000000003000000000000000656455354530000'
}

const mint = { permlink: 'my-artwork', editions: 5, royalty: 1000, license: 'PIXA_LICENSE/1.0', fee: '5.000 PXS' }

describe('nft', function() {

    describe('wire format, byte for byte with the node', function() {
        it('mint', function() {
            assert.equal(serialize(Types.Operation, ['nft', { account: 'alice', action: [0, mint], extensions: [] }]), NODE.mint)
        })

        it('mint, every input form of the action and without extensions', function() {
            const forms: any[] = [
                [0, mint],
                ['nft_mint', mint],
                { type: 'nft_mint', value: mint },
                [0, { ...mint, fee: Asset.from('5.000 PXS'), extensions: [] }],
                [0, { ...mint, editions: '5', royalty: '1000' }]
            ]
            for (const action of forms) {
                assert.equal(serialize(Types.Operation, ['nft', { account: 'alice', action }]), NODE.mint, JSON.stringify(action))
            }
        })

        it('mint with a UTF-8 license, 10,000 copies and the highest royalty', function() {
            const action = { permlink: 'series', editions: 10000, royalty: 2500,
                license: 'Licence « tous droits réservés »', fee: nftMintFee(10000) }
            assert.equal(serialize(Types.Operation, ['nft', { account: 'alice', action: [0, action] }]), NODE.mintUtf8)
        })

        it('list, never expiring when expiration is left out', function() {
            const list = { author: 'alice', permlink: 'my-artwork', edition: 3, price: '50.000 PXS' }
            assert.equal(serialize(Types.Operation, ['nft', { account: 'bob', action: [1, list] }]), NODE.list)
            assert.equal(serialize(Types.Operation, ['nft', { account: 'bob', action: [1, { ...list, expiration: NFT_NEVER_EXPIRES }] }]), NODE.list)
        })

        it('reserve offer, withdrawal and purchase (edition 0)', function() {
            const offer = { author: 'carol', permlink: 'drop', edition: 0, price: '5.000 PXS', expiration: '2027-02-01T00:00:00' }
            assert.equal(serialize(Types.Operation, ['nft', { account: 'carol', action: ['nft_list', offer] }]), NODE.listReserve)
            assert.equal(serialize(Types.Operation, ['nft', { account: 'carol', action: [2, { author: 'carol', permlink: 'drop', edition: 0 }] }]), NODE.unlistReserve)
            assert.equal(serialize(Types.Operation, ['nft', { account: 'erin', action: [3, { author: 'carol', permlink: 'drop', edition: 0, price: '5.000 PXS' }] }]), NODE.buyReserve)
        })

        it('unlist, buy, gift and burn', function() {
            const copy = { author: 'alice', permlink: 'my-artwork' }
            assert.equal(serialize(Types.Operation, ['nft', { account: 'bob', action: [2, { ...copy, edition: 3 }] }]), NODE.unlist)
            assert.equal(serialize(Types.Operation, ['nft', { account: 'dave', action: [3, { ...copy, edition: 3, price: '50.000 PXS' }] }]), NODE.buy)
            assert.equal(serialize(Types.Operation, ['nft', { account: 'alice', action: [4, { ...copy, edition: 2, to: 'frank' }] }]), NODE.transfer)
            assert.equal(serialize(Types.Operation, ['nft', { account: 'alice', action: [4, { ...copy, edition: 4, to: 'null' }] }]), NODE.burn)
        })

        it('a whole transaction', function() {
            const tx = { ref_block_num: 1234, ref_block_prefix: 1122334455, expiration: '2017-07-15T16:51:19',
                operations: [['nft', { account: 'alice', action: [0, mint] }]], extensions: [] }
            assert.equal(serialize(Types.Transaction, tx), NODE.txMint)
        })

        it('refuses what it cannot write faithfully', function() {
            const op = (action: any) => ['nft', { account: 'alice', action }]
            assert.throws(() => serialize(Types.Operation, op([1, { author: 'alice', permlink: 'p', price: '1.000 PXS' }])), /nft: action: nft_list\.edition/)
            assert.throws(() => serialize(Types.Operation, op([1, { author: 'alice', permlink: 'p', edition: 1, price: '1.000 PXS', expiration: 'soon' }])), /expiration/)
            assert.throws(() => serialize(Types.Operation, op([0, { ...mint, editions: 70000 }])), /editions/)
            assert.throws(() => serialize(Types.Operation, op([0, { ...mint, editions: 1.5 }])), /editions/)
            assert.throws(() => serialize(Types.Operation, op([5, mint])), /Unknown NFT action/)
            assert.throws(() => serialize(Types.Operation, op(['nft_burn', mint])), /Unknown NFT action/)
            assert.throws(() => serialize(Types.Operation, op([4, { author: 'alice', permlink: 'p', edition: 1 }])), /nft_transfer\.to/)
            assert.throws(() => serialize(Types.Operation, ['nft', { action: [0, mint] }]), /account/)
            assert.throws(() => serialize(Types.Operation, ['reset_account', {}]), /No serializer for operation: reset_account/)
        })
    })

    describe('fields the node names after Hive', function() {
        it('the node bytes come out whichever name is used', function() {
            assert.equal(serialize(Types.Operation, ['transfer', { from: 'foo', to: 'bar', amount: '1.000 PIXA', memo: 'wedding present' }]), NODE.transferOp)
            const options = { author: 'alice', permlink: 'p', max_accepted_payout: '1000000.000 PXS', allow_votes: true, allow_curation_rewards: true, extensions: [] }
            assert.equal(serialize(Types.Operation, ['comment_options', { ...options, percent_pxs: 0 }]), NODE.commentOptions)
            assert.equal(serialize(Types.Operation, ['comment_options', { ...options, percent_hbd: 0 }]), NODE.commentOptions)
            const claim = { account: 'alice', reward_vests: '0.000003 VESTS' }
            assert.equal(serialize(Types.Operation, ['claim_reward_balance', { ...claim, reward_pixa: '0.001 PIXA', reward_pxs: '0.002 PXS' }]), NODE.claimRewardBalance)
            assert.equal(serialize(Types.Operation, ['claim_reward_balance', { ...claim, reward_hive: '0.001 PIXA', reward_hbd: '0.002 PXS' }]), NODE.claimRewardBalance)
        })

        it('signing writes both names, so the node reads what was signed', function() {
            const key = PrivateKey.fromSeed('nft-test')
            const ops: Operation[] = [
                ['comment_options', { author: 'alice', permlink: 'p', max_accepted_payout: '1000000.000 PXS', percent_pxs: 0,
                    allow_votes: true, allow_curation_rewards: true, extensions: [] }],
                ['claim_reward_balance', { account: 'alice', reward_hive: '0.001 PIXA', reward_pxs: '0.002 PXS', reward_vests: '0.000003 VESTS' }],
                ['escrow_release', { from: 'a', to: 'b', agent: 'c', who: 'c', receiver: 'b', escrow_id: 9, pxs_amount: '1.000 PXS', hive_amount: '2.000 PIXA' }],
                ['witness_update', { owner: 'w', url: 'https://w', block_signing_key: 'PIX1111111111111111111111111111111114T1Anm',
                    props: { account_creation_fee: '1.000 PIXA', maximum_block_size: 65536, pxs_interest_rate: 0 }, fee: '0.000 PIXA' }]
            ]
            const tx: Transaction = { ref_block_num: 1, ref_block_prefix: 2, expiration: '2026-11-24T12:00:00', operations: ops, extensions: [] }
            const signed = cryptoUtils.signTransaction(tx, key)
            const [options, claim, escrow, witness] = signed.operations.map((op) => op[1])
            assert.equal(options.percent_hbd, 0)
            assert.equal(options.percent_pxs, 0)
            assert.equal(claim.reward_hive, '0.001 PIXA')
            assert.equal(claim.reward_pixa, '0.001 PIXA')
            assert.equal(claim.reward_hbd, '0.002 PXS')
            assert.equal(claim.reward_pxs, '0.002 PXS')
            assert.equal(escrow.hbd_amount, '1.000 PXS')
            assert.equal(escrow.pixa_amount, '2.000 PIXA')
            assert.equal(witness.props.hbd_interest_rate, 0)
            assert.equal(cryptoUtils.transactionDigest(signed).toString('hex'), cryptoUtils.transactionDigest(tx).toString('hex'))
            assert.equal(cryptoUtils.generateTrxId(signed), cryptoUtils.generateTrxId(tx))
            assert.deepEqual(tx.operations[0][1].percent_hbd, undefined, 'the caller\'s transaction is left alone')
        })

        it('refuses two names holding different values', function() {
            assert.throws(() => normalizeOperation(['comment_options', { percent_pxs: 0, percent_hbd: 10000 }]), /percent_hbd and percent_pxs/)
            assert.throws(() => normalizeOperation(['claim_reward_balance', { reward_pixa: '1.000 PIXA', reward_hive: '2.000 PIXA' }]), /reward_hive and reward_pixa/)
            assert.doesNotThrow(() => normalizeOperation(['claim_reward_balance', { reward_pixa: Asset.from('1.000 PIXA'), reward_hive: '1.000 PIXA' }]))
        })
    })

    describe('normalization', function() {
        it('writes the action as [tag, payload] with its extensions', function() {
            const data = normalizeOperation(['nft', { account: 'bob', action: { type: 'nft_list', value: { author: 'alice', permlink: 'a', edition: 3, price: '1.000 PXS' } } }])[1]
            assert.deepEqual(data, { account: 'bob', action: [1, { author: 'alice', permlink: 'a', edition: 3, price: '1.000 PXS', extensions: [] }], extensions: [] })
            const named = normalizeOperation(['nft', { account: 'alice', action: ['nft_mint', mint] }])
            assert.deepEqual(named[1].action, [0, { ...mint, extensions: [] }])
        })

        it('sends an offer that never expires without expiration, which the node could not read', function() {
            const offer = { author: 'alice', permlink: 'a', edition: 3, price: '1.000 PXS' }
            const never = normalizeOperation(['nft', { account: 'bob', action: [1, { ...offer, expiration: NFT_NEVER_EXPIRES }] }])[1]
            assert.deepEqual(never.action, [1, { ...offer, extensions: [] }])
            assert.equal(serialize(Types.Operation, ['nft', never]), serialize(Types.Operation, ['nft', { account: 'bob', action: [1, offer] }]))
            const latest = normalizeOperation(['nft', { account: 'bob', action: [1, { ...offer, expiration: NFT_LATEST_EXPIRATION }] }])[1]
            assert.equal(latest.action[1].expiration, '2038-01-19T03:14:07')
            assert.throws(() => normalizeOperation(['nft', { account: 'bob', action: [1, { ...offer, expiration: '2038-01-19T03:14:08' }] }]), /up to 2038-01-19T03:14:07/)
            assert.throws(() => cryptoUtils.signTransaction({ ref_block_num: 1, ref_block_prefix: 2, expiration: '2026-11-24T12:00:00', extensions: [],
                operations: [['nft', { account: 'bob', action: [1, { ...offer, expiration: '2040-01-01T00:00:00' }] }]] }, PrivateKey.fromSeed('nft-test')), /up to 2038/)
        })

        it('returns what needs no change as it is, and is idempotent', function() {
            const vote: Operation = ['vote', { voter: 'a', author: 'b', permlink: 'c', weight: 100 }]
            assert.strictEqual(normalizeOperation(vote), vote)
            const tx: Transaction = { ref_block_num: 1, ref_block_prefix: 2, expiration: '2026-11-24T12:00:00', operations: [vote], extensions: [] }
            assert.strictEqual(normalizeTransaction(tx), tx)
            const once = normalizeOperation(['nft', { account: 'alice', action: ['nft_mint', mint] }])
            assert.deepEqual(normalizeOperation(once), once)
        })

        it('never changes the digest', function() {
            const forms: any[] = [[0, mint], ['nft_mint', mint], { type: 'nft_mint', value: mint }]
            const digests = forms.map((action) => cryptoUtils.transactionDigest({
                ref_block_num: 1, ref_block_prefix: 2, expiration: '2026-11-24T12:00:00', extensions: [],
                operations: [['nft', { account: 'alice', action }]]
            }).toString('hex'))
            assert.equal(new Set(digests).size, 1)
            const key = PrivateKey.fromSeed('nft-test')
            const signed = cryptoUtils.signTransaction({ ref_block_num: 1, ref_block_prefix: 2, expiration: '2026-11-24T12:00:00', extensions: [],
                operations: [['nft', { account: 'alice', action: { type: 'nft_mint', value: mint } }]] }, key)
            assert.deepEqual(signed.operations[0][1].action, [0, { ...mint, extensions: [] }])
            assert.equal(cryptoUtils.transactionDigest(signed).toString('hex'), digests[0])
        })
    })

    describe('ids and amounts', function() {
        it('reads and writes ids as the node does', function() {
            assert.deepEqual(parseNftId('@alice/my-artwork/0'), { author: 'alice', permlink: 'my-artwork', edition: 0 })
            assert.deepEqual(parseNftId('@alice/a/b/10000'), { author: 'alice', permlink: 'a/b', edition: 10000 })
            assert.equal(formatNftId('alice', 'my-artwork'), '@alice/my-artwork/0')
            assert.equal(formatNftId('alice', 'my-artwork', 7), '@alice/my-artwork/7')
            for (const bad of ['alice/p/1', '@alice/p/01', '@alice/p/10001', '@alice/p/', '@alice//1', '@/p/1', '@alice/p/-1', '@Alice/p/1', '@alice/p/1.0', '@alice']) {
                assert.equal(isNftId(bad), false, bad)
                assert.throws(() => parseNftId(bad), bad)
            }
            assert.throws(() => formatNftId('alice', 'p', 10001))
        })

        it('mint fee, royalty and sale split, rounded as the node rounds', function() {
            assert.equal(nftMintFee(1).toString(), '1.000 PXS')
            assert.equal(nftMintFee(10000).toString(), '10000.000 PXS')
            assert.throws(() => nftMintFee(0))
            assert.equal(nftRoyalty('300.000 PXS', 1000).toString(), '30.000 PXS')
            assert.equal(nftRoyalty('0.009 PXS', 1000).toString(), '0.000 PXS')
            assert.equal(nftRoyalty('1.239 PXS', 2500).toString(), '0.309 PXS')
            assert.equal(nftRoyalty('92233720368.547 PXS', 2500).toString(), '23058430092.136 PXS')
            assert.deepEqual(nftSaleSplit('300.000 PXS', 1000), { royalty: Asset.from('30.000 PXS'), seller: Asset.from('270.000 PXS') })
            assert.deepEqual(nftSaleSplit('5.000 PXS', 1000, true), { royalty: Asset.from('0.000 PXS'), seller: Asset.from('5.000 PXS') })
        })

        it('checks a mint before it is signed', function() {
            assert.deepEqual(checkNftMint(mint), [])
            assert.deepEqual(checkNftMint({ ...mint, editions: 10000, fee: '10000.000 PXS', royalty: 2500 }), [])
            assert.equal(checkNftMint({ ...mint, fee: '4.000 PXS' }).length, 1)
            assert.equal(checkNftMint({ ...mint, fee: '5.000 PIXA' }).length, 1)
            assert.equal(checkNftMint({ ...mint, royalty: 2501 }).length, 1)
            assert.equal(checkNftMint({ ...mint, editions: 0 }).length, 1)
            assert.equal(checkNftMint({ ...mint, license: 'é'.repeat(NFT_MAX_LICENSE_BYTES / 2) }).length, 0)
            assert.equal(checkNftMint({ ...mint, license: 'é'.repeat(NFT_MAX_LICENSE_BYTES / 2) + 'a' }).length, 1)
            assert.equal(checkNftMint({}).length, 5)
        })

        it('counts UTF-8 bytes like the node', function() {
            for (const text of ['', 'abc', 'Licence « tous droits réservés »', '日本語', '🎨 pixel', 'aࠀb', '\ud800']) {
                assert.equal(utf8ByteLength(text), Buffer.byteLength(text, 'utf8'), JSON.stringify(text))
            }
        })

        it('reads amounts in the database_api form', function() {
            assert.equal(Asset.from({ amount: '5000', precision: 3, nai: '@@000000013' }).toString(), '5.000 PXS')
            assert.equal(Asset.from({ amount: '1', precision: 3, nai: '@@000000021' }).toString(), '0.001 PIXA')
            assert.equal(Asset.from({ amount: '-123456789', precision: 6, nai: '@@000000037' }).toString(), '-123.456789 VESTS')
            assert.equal(Asset.fromNai({ amount: '5000', precision: 3, nai: '@@000000013' }, 'TBD').toString(), '5.000 TBD')
            assert.throws(() => Asset.from({ amount: '1', precision: 3, nai: '@@000000099' }), /Unknown asset NAI/)
            assert.throws(() => Asset.from({ amount: '5000', precision: 3, nai: '@@000000013' }, 'PIXA'), /expected symbol/)
        })

        it('filters account history on NFT operations', function() {
            const op = utils.operationOrders
            assert.equal(op.nft, 37)
            assert.equal(op.nft_sold, 93)
            assert.equal(op.nft_royalty, 94)
            assert.deepEqual(utils.makeBitMaskFilter([op.nft, op.nft_sold, op.nft_royalty]), [(1n << 37n).toString(), ((1n << 29n) | (1n << 30n)).toString()])
        })
    })
})
