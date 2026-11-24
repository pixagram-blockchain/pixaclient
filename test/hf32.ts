import 'mocha'
import * as assert from 'assert'

import {
    Account,
    Asset,
    Client,
    cryptoUtils,
    getVestingSharePrice,
    PrivateKey,
    Signature,
    utils
} from '../src'

/*
 * Hardfork 32 support without a node: global fetch is replaced by a handler that records each
 * JSON-RPC request and answers from a table, so the tests check what dpixa sends and how it reads
 * the answers. Answers follow the node's database_api and Pixamind's formats.
 */

interface Request { method: string, params: any }

let requests: Request[] = []
let answers: { [method: string]: (params: any) => any } = {}
const originalFetch = (globalThis as any).fetch

const DGP = {
    head_block_number: 1000,
    head_block_id: '000003e8aabbccdd00112233445566778899aabb',
    time: '2027-01-10T12:00:00'
}

const pxs = (milli: number) => ({ amount: String(milli), precision: 3, nai: '@@000000013' })

const CHAIN_NFT = {
    id: 3, nft_id: '@carol/drop/0', author: 'carol', permlink: 'drop', mint_time: '2027-01-10T11:00:00',
    editions: 5, royalty: 1000, license_size: 1, license_sha256: 'ab'.repeat(32),
    reserve: 2, reserve_next: 4, reserve_listed: true, reserve_price: pxs(5000), reserve_expiration: '2106-02-07T06:28:15'
}

const CHAIN_COPY = {
    nft_id: '@carol/drop/1', nft: 3, author: 'carol', permlink: 'drop', edition: 1, owner: 'bob', burned: false,
    acquired: '2027-01-10T11:30:00', listed: true, price: pxs(7500), expiration: '2106-02-07T06:28:15'
}

const sent = () => requests.filter((r) => r.method === 'condenser_api.broadcast_transaction').map((r) => r.params[0])

describe('hardfork 32 support', function() {
    const client = new Client('https://node.example')
    const key = PrivateKey.fromSeed('hf32-test')

    before(function() {
        (globalThis as any).fetch = async (_url: string, init: any) => {
            const { id, method, params } = JSON.parse(init.body)
            requests.push({ method, params })
            const answer = answers[method]
            if (!answer) {
                return { ok: true, status: 200, json: async () => ({ jsonrpc: '2.0', id, error: { code: -32601, message: `no ${method}` } }) }
            }
            return { ok: true, status: 200, json: async () => ({ jsonrpc: '2.0', id, result: answer(params) }) }
        }
    })

    after(function() {
        (globalThis as any).fetch = originalFetch
    })

    beforeEach(function() {
        requests = []
        answers = {
            'condenser_api.get_dynamic_global_properties': () => DGP,
            'condenser_api.broadcast_transaction': () => ({}),
            'database_api.get_nft_params': () => ({
                mint_fee_per_edition: pxs(1000), max_editions: 10000, max_royalty: 2500, max_license_length: 73728,
                price_symbols: [{ nai: '@@000000013', precision: 3 }]
            }),
            'database_api.find_nfts': (params: any) => ({
                nfts: params.nfts.some((id: string) => id.startsWith('@carol/drop/')) ? [CHAIN_NFT] : [],
                editions: params.nfts.includes('@carol/drop/1') ? [CHAIN_COPY] : []
            })
        }
    })

    /** The signature of a sent transaction recovers the public key of `signer`. */
    const assertSignedBy = (tx: any, signer: PrivateKey) => {
        const digest = cryptoUtils.transactionDigest(tx, client.chainId)
        assert.equal(Signature.fromString(tx.signatures[0]).recover(digest).toString(), signer.createPublic().toString())
    }

    describe('client.nft, chain reads', function() {
        it('getParams reads amounts and symbols in the database_api form', async function() {
            const params = await client.nft.getParams()
            assert.equal(params.mint_fee_per_edition.toString(), '1.000 PXS')
            assert.deepEqual(params.price_symbols, ['PXS'])
            assert.equal(params.max_royalty, 2500)
            assert.deepEqual(requests, [{ method: 'database_api.get_nft_params', params: {} }])
        })

        it('find, getNft and getEdition', async function() {
            const { nfts, editions } = await client.nft.find(['@carol/drop/0', '@carol/drop/1'])
            assert.equal(nfts[0].reserve_price.toString(), '5.000 PXS')
            assert.equal(editions[0].price.toString(), '7.500 PXS')
            assert.deepEqual(requests[0], { method: 'database_api.find_nfts', params: { nfts: ['@carol/drop/0', '@carol/drop/1'] } })
            assert.equal((await client.nft.getNft('carol', 'drop'))!.reserve_next, 4)
            assert.equal(await client.nft.getNft('carol', 'other'), undefined)
            assert.equal((await client.nft.getEdition('@carol/drop/1'))!.owner, 'bob')
            await assert.rejects(client.nft.getEdition('@carol/drop/0'), /names an NFT/)
            await assert.rejects(client.nft.find(new Array(101).fill('@carol/drop/0')), /At most 100/)
        })

        it('areMinted asks 100 ids at a time and keeps the order', async function() {
            const posts: [string, string][] = Array.from({ length: 150 }, (_, i) => ['dave', `p${i}`] as [string, string])
            posts[120] = ['carol', 'drop']
            const minted = await client.nft.areMinted(posts)
            assert.equal(requests.length, 2)
            assert.equal(requests[0].params.nfts.length, 100)
            assert.equal(minted.filter(Boolean).length, 1)
            assert.equal(minted[120], true)
        })

        it('lists stay on the account asked and continue after the given entry', async function() {
            answers['database_api.list_nfts'] = () => ({ nfts: [
                { ...CHAIN_NFT, permlink: 'a' }, { ...CHAIN_NFT, permlink: 'b' }, { ...CHAIN_NFT, author: 'dave', permlink: 'c' }
            ] })
            const created = await client.nft.listByCreator('carol', { after: 'a', limit: 10 })
            assert.deepEqual(created.map((n) => n.permlink), ['b'])
            assert.deepEqual(requests[0].params, { limit: 11, order: 'by_creator', start: ['carol', 'a'] })

            answers['database_api.list_nft_editions'] = (params: any) => ({ editions: params.order === 'by_account'
                ? [{ ...CHAIN_COPY }, { ...CHAIN_COPY, nft_id: '@carol/drop/2', edition: 2 }, { ...CHAIN_COPY, owner: 'erin', nft_id: '@x/y/1' }]
                : [{ ...CHAIN_COPY }] })
            const owned = await client.nft.listByOwner('bob', { after: '@carol/drop/1' })
            assert.deepEqual(owned.map((c) => c.nft_id), ['@carol/drop/2'])
            assert.deepEqual(requests[1].params, { limit: 101, order: 'by_account', start: ['bob', '@carol/drop/1'] })
            const copies = await client.nft.listEditions('@carol/drop/0', { from: 3, limit: 2 })
            assert.equal(copies[0].price.toString(), '7.500 PXS')
            assert.deepEqual(requests[2].params, { limit: 2, order: 'by_permlink', start: '@carol/drop/3' })
        })
    })

    describe('client.nft, actions', function() {
        it('mint computes the fee from the chain and signs what it sends', async function() {
            await client.nft.mint({ account: 'alice', permlink: 'art', editions: 5, royalty: 1000, license: 'PIXA_LICENSE/1.0' }, key)
            assert.deepEqual(requests.map((r) => r.method), [
                'database_api.get_nft_params', 'condenser_api.get_dynamic_global_properties', 'condenser_api.broadcast_transaction'
            ])
            const [tx] = sent()
            assert.deepEqual(tx.operations, [['nft', { account: 'alice', extensions: [],
                action: [0, { permlink: 'art', editions: 5, royalty: 1000, license: 'PIXA_LICENSE/1.0', fee: '5.000 PXS', extensions: [] }] }]])
            assertSignedBy(tx, key)
        })

        it('mint refuses, before any request, what the chain would refuse', async function() {
            await assert.rejects(
                client.nft.mint({ account: 'alice', permlink: 'art', editions: 5, royalty: 3000, license: 'x', fee: '5.000 PXS' }, key),
                /royalty: 0 to 2500/
            )
            await assert.rejects(
                client.nft.mint({ account: 'alice', permlink: 'art', editions: 5, royalty: 0, license: 'x', fee: '4.000 PXS' }, key),
                /fee: exactly 5.000 PXS/
            )
            assert.equal(requests.length, 0)
        })

        it('list, unlist, gift and burn, by id or by parts', async function() {
            await client.nft.list({ account: 'bob', nft: '@carol/drop/1', price: '9.000 PXS' }, key)
            await client.nft.list({ account: 'bob', author: 'carol', permlink: 'drop', edition: 1, price: Asset.from('9.000 PXS'), expiration: '2027-02-01T00:00:00' }, key)
            await client.nft.unlist({ account: 'bob', nft: '@carol/drop/1' }, key)
            await client.nft.transfer({ account: 'bob', nft: '@carol/drop/1', to: 'frank' }, key)
            await client.nft.burn({ account: 'bob', nft: '@carol/drop/1' }, key)
            const actions = sent().map((tx) => tx.operations[0][1].action)
            assert.deepEqual(actions, [
                [1, { author: 'carol', edition: 1, permlink: 'drop', price: '9.000 PXS', extensions: [] }],
                [1, { author: 'carol', edition: 1, permlink: 'drop', price: '9.000 PXS', expiration: '2027-02-01T00:00:00', extensions: [] }],
                [2, { author: 'carol', edition: 1, permlink: 'drop', extensions: [] }],
                [4, { author: 'carol', edition: 1, permlink: 'drop', to: 'frank', extensions: [] }],
                [4, { author: 'carol', edition: 1, permlink: 'drop', to: 'null', extensions: [] }]
            ])
            sent().forEach((tx) => assertSignedBy(tx, key))
        })

        it('the reserve: offer, withdraw, buy the next copy at the chain\'s price', async function() {
            await client.nft.offerReserve({ account: 'carol', permlink: 'drop', price: '5.000 PXS' }, key)
            await client.nft.withdrawReserve({ account: 'carol', permlink: 'drop' }, key)
            await client.nft.buyFromReserve({ account: 'erin', author: 'carol', permlink: 'drop' }, key)
            const ops = sent().map((tx) => tx.operations[0][1])
            assert.deepEqual(ops[0], { account: 'carol', extensions: [], action: [1, { author: 'carol', edition: 0, permlink: 'drop', price: '5.000 PXS', extensions: [] }] })
            assert.deepEqual(ops[1].action, [2, { author: 'carol', edition: 0, permlink: 'drop', extensions: [] }])
            assert.deepEqual(ops[2], { account: 'erin', extensions: [], action: [3, { author: 'carol', edition: 0, permlink: 'drop', price: '5.000 PXS', extensions: [] }] })
            assert.ok(requests.some((r) => r.method === 'database_api.find_nfts' && r.params.nfts[0] === '@carol/drop/0'))
        })

        it('buy reads the asking price when none is given, and stops when nothing is for sale', async function() {
            await client.nft.buy({ account: 'dave', nft: '@carol/drop/1' }, key)
            assert.deepEqual(sent()[0].operations[0][1].action, [3, { author: 'carol', edition: 1, permlink: 'drop', price: '7.500 PXS', extensions: [] }])
            await client.nft.buy({ account: 'dave', nft: '@carol/drop/1', price: '7.500 PXS' }, key)
            assert.equal(requests.filter((r) => r.method === 'database_api.find_nfts').length, 1, 'a given price is not looked up')
            const unlisted = { ...CHAIN_COPY, listed: false }
            answers['database_api.find_nfts'] = () => ({ nfts: [{ ...CHAIN_NFT, reserve_listed: false }], editions: [unlisted] })
            await assert.rejects(client.nft.buy({ account: 'dave', nft: '@carol/drop/1' }, key), /is not offered/)
            await assert.rejects(client.nft.buyFromReserve({ account: 'dave', author: 'carol', permlink: 'drop' }, key), /reserve of @carol\/drop\/0 is not offered/)
            answers['database_api.find_nfts'] = () => ({ nfts: [], editions: [] })
            await assert.rejects(client.nft.buy({ account: 'dave', nft: '@carol/nope/1' }, key), /not minted/)
        })
    })

    describe('client.broadcast additions', function() {
        it('promote burns PXS for a post with the exact memo', async function() {
            await client.broadcast.promote({ from: 'carol', author: 'alice', permlink: 'cat', amount: '1.500 PXS' }, key)
            assert.deepEqual(sent()[0].operations, [['transfer', { amount: '1.500 PXS', from: 'carol', memo: '@alice/cat', to: 'null' }]])
            await assert.rejects(client.broadcast.promote({ from: 'carol', author: 'alice', permlink: 'cat', amount: '1.500 PIXA' }, key), /paid in PXS/)
            await assert.rejects(client.broadcast.promote({ from: 'carol', author: 'alice', permlink: 'cat', amount: '0.000 PXS' }, key), /at least 0.001/)
        })

        it('claimRewardBalance sends each amount under both names', async function() {
            await client.broadcast.claimRewardBalance({ account: 'alice', reward_pixa: '1.000 PIXA', reward_pxs: '0.500 PXS', reward_vests: '2.000000 VESTS' }, key)
            const [tx] = sent()
            assert.deepEqual(tx.operations[0][1], { account: 'alice', reward_pixa: '1.000 PIXA', reward_pxs: '0.500 PXS', reward_vests: '2.000000 VESTS',
                reward_hive: '1.000 PIXA', reward_hbd: '0.500 PXS' })
            assertSignedBy(tx, key)
        })

        it('send puts a transaction signed elsewhere in the form the node reads, without touching its signature', async function() {
            const tx = { ref_block_num: 1, ref_block_prefix: 2, expiration: '2027-01-10T12:01:00', extensions: [],
                operations: [['nft', { account: 'alice', action: { type: 'nft_unlist', value: { author: 'alice', permlink: 'art', edition: 2 } } }]] as any }
            const digest = cryptoUtils.transactionDigest(tx, client.chainId)
            const signed = { ...tx, signatures: [key.sign(digest).toString()] }
            const result = await client.broadcast.send(signed)
            assert.equal(result.id, cryptoUtils.generateTrxId(tx))
            const [out] = sent()
            assert.deepEqual(out.operations[0][1].action, [2, { author: 'alice', permlink: 'art', edition: 2, extensions: [] }])
            assertSignedBy(out, key)
        })

        it('witness props are written under the names the node reads', function() {
            const pub = key.createPublic().toString()
            const op = utils.buildWitnessUpdateOp('w', { key: pub, pxs_interest_rate: 0, pxs_exchange_rate: { base: '0.010 PXS', quote: '1.000 PIXA' }, url: 'https://w' })
            assert.deepEqual(op[1].props.map((p) => p[0]), ['hbd_exchange_rate', 'hbd_interest_rate', 'key', 'url'])
            const same = utils.buildWitnessUpdateOp('w', { key: pub, hbd_interest_rate: 0, hbd_exchange_rate: { base: '0.010 PXS', quote: '1.000 PIXA' }, url: 'https://w' })
            assert.deepEqual(same, op)
            assert.throws(() => utils.buildWitnessUpdateOp('w', { key: pub, pxs_interest_rate: 0, hbd_interest_rate: 0 }), /given twice/)
        })
    })

    describe('client.pixamind additions', function() {
        it('calls each method in its namespace', async function() {
            const echo = (params: any) => params
            for (const method of ['pixamind_nft.list_editions', 'pixamind_nft.list_created', 'pixamind_nft.list_owned', 'pixamind_nft.list_market',
                'pixamind_nft.get_history', 'pixamind_content.get_content_metadata', 'pixamind_content.get_post_history',
                'pixamind_feed.get_promotions', 'pixamind_api.get_info', 'bridge.get_ranked_posts', 'bridge.get_post']) {
                answers[method] = echo
            }
            answers['pixamind_nft.get_nfts'] = (params: any) => ({ nfts: params.nfts.map((nft_id: string) => ({ nft_id })) })
            answers['pixamind_nft.get_license'] = (params: any) => (params.nft.startsWith('@carol/') ? { nft_id: '@carol/drop/0', license: 'L', license_size: 1, license_sha256: 'x' } : {})

            assert.deepEqual(await client.pixamind.getNfts('@carol/drop/0'), [{ nft_id: '@carol/drop/0' }])
            assert.deepEqual(await client.pixamind.getNft('carol', 'drop'), { nft_id: '@carol/drop/0' })
            await client.pixamind.listNftEditions({ nft: '@carol/drop/0', sort: 'price', limit: 5 })
            await client.pixamind.listCreatedNfts('carol', { limit: 3 })
            await client.pixamind.listOwnedNfts('bob', { acquired_only: true })
            await client.pixamind.listNftMarket({ sort: 'price', creator: 'carol' })
            await client.pixamind.getNftHistory({ account: 'bob', limit: 3 })
            assert.equal((await client.pixamind.getNftLicense('@carol/drop/3'))!.license, 'L')
            assert.equal(await client.pixamind.getNftLicense('@dave/x/0'), undefined)
            await client.pixamind.getContentMetadata('alice', 'cat')
            await client.pixamind.getPostHistory('bob', 'blog-1', { bodies: false })
            await client.pixamind.getPromotions('alice', 'cat')
            await client.pixamind.getPromotionsBySender('carol', 10)
            await client.pixamind.getPromotedPosts({ tag: 'my', observer: 'dave', limit: 20 })
            await client.pixamind.getPost('alice', 'cat', 'dave')
            await client.pixamind.getInfo()
            assert.deepEqual(requests.map((r) => [r.method, r.params]), [
                ['pixamind_nft.get_nfts', { nfts: ['@carol/drop/0'] }],
                ['pixamind_nft.get_nfts', { nfts: ['@carol/drop/0'] }],
                ['pixamind_nft.list_editions', { nft: '@carol/drop/0', sort: 'price', limit: 5 }],
                ['pixamind_nft.list_created', { account: 'carol', limit: 3 }],
                ['pixamind_nft.list_owned', { account: 'bob', acquired_only: true }],
                ['pixamind_nft.list_market', { sort: 'price', creator: 'carol' }],
                ['pixamind_nft.get_history', { account: 'bob', limit: 3 }],
                ['pixamind_nft.get_license', { nft: '@carol/drop/3' }],
                ['pixamind_nft.get_license', { nft: '@dave/x/0' }],
                ['pixamind_content.get_content_metadata', { author: 'alice', permlink: 'cat' }],
                ['pixamind_content.get_post_history', { author: 'bob', permlink: 'blog-1', bodies: false }],
                ['pixamind_feed.get_promotions', { author: 'alice', permlink: 'cat' }],
                ['pixamind_feed.get_promotions', { sender: 'carol', limit: 10 }],
                ['bridge.get_ranked_posts', { tag: 'my', observer: 'dave', limit: 20, sort: 'promoted' }],
                ['bridge.get_post', { author: 'alice', permlink: 'cat', observer: 'dave' }],
                ['pixamind_api.get_info', {}]
            ])
        })
    })

    describe('voting bar', function() {
        // 1,000,000 VESTS of which 100,000 delegated away and 50,000 received; no power-down
        const account = {
            vesting_shares: '1000000.000000 VESTS', delegated_vesting_shares: '100000.000000 VESTS',
            received_vesting_shares: '50000.000000 VESTS', vesting_withdraw_rate: '0.000000 VESTS', to_withdraw: 0, withdrawn: 0,
            voting_manabar: { current_mana: '0', last_update_time: 0 },
            downvote_manabar: { current_mana: '0', last_update_time: 0 }
        } as any as Account
        const hf32 = { vote_power_reserve_rate: 5, voting_mana_regeneration_seconds: 576000, downvote_pool_percent: 2500 }
        const before32 = { vote_power_reserve_rate: 10 }

        it('a full vote costs 3% of the bar from hardfork 32, 2% before', function() {
            const now = client.rc.calculateVoteCost(account, 10000, hf32)
            assert.equal(now.full_vote_percentage, 3)
            assert.equal(now.percentage, 3)
            // ceil(floor(950000000000 * 10000 * 86400 / 10000) / (5 * 576000))
            assert.equal(now.mana, 28500000000)
            assert.equal(client.rc.calculateVoteCost(account, 10000, before32).full_vote_percentage, 2)
            assert.equal(client.rc.calculateVoteCost(account, -5000, hf32).percentage, 1.5)
            assert.equal(client.rc.calculateVoteCost(account, 1, hf32).mana, 2850000)
            assert.throws(() => client.rc.calculateVoteCost(account, 10001, hf32), /from -10000 to 10000/)
            assert.throws(() => client.rc.calculateVoteCost(account, 100, {}), /vote_power_reserve_rate/)
        })

        it('a weekly power-down is left out of the stake, as the node does', function() {
            const poweringDown = { ...account, vesting_withdraw_rate: '76923.076923 VESTS', to_withdraw: '1000000000000', withdrawn: '0' } as any
            const cost = client.rc.calculateVoteCost(poweringDown, 10000, hf32)
            // (950000 - 76923.076923) VESTS * 3%, rounded up to the next millionth
            assert.equal(cost.mana, Math.ceil(873076923077 * 86400 / (5 * 576000)))
        })

        it('the bar refills in voting_mana_regeneration_seconds', function() {
            const half = { ...account, voting_manabar: { current_mana: '0', last_update_time: Date.now() / 1000 - 288000 } } as any
            const now = client.rc.calculateVPMana(half, hf32)
            assert.ok(Math.abs(now.percentage - 5000) <= 1, `${now.percentage}`)
            const old = client.rc.calculateVPMana(half)
            assert.ok(Math.abs(old.percentage - 6667) <= 1, `${old.percentage}`)
            const down = client.rc.calculateDownvoteMana(half, hf32)
            assert.equal(down.max_mana, 950000 * 1e6 * 0.25)
            assert.equal(client.rc.calculateDownvoteMana(half, { ...hf32, downvote_pool_percent: 0 }).max_mana, 0)
        })

        it('getVPMana and getVoteCost read the refill time from the chain', async function() {
            answers['condenser_api.get_accounts'] = () => [account]
            answers['condenser_api.get_dynamic_global_properties'] = () => ({ ...DGP, ...hf32 })
            assert.equal((await client.rc.getVoteCost('alice', 10000)).full_vote_percentage, 3)
            assert.equal((await client.rc.getVPMana('alice')).max_mana, 950000 * 1e6)
            answers['condenser_api.get_accounts'] = () => []
            await assert.rejects(client.rc.getVPMana('nobody'), /not found/)
        })

        it('reads the vesting fund under either name', function() {
            const pixa = getVestingSharePrice({ total_vesting_fund_pixa: '5.000 PIXA', total_vesting_shares: '10.000000 VESTS' } as any)
            const hive = getVestingSharePrice({ total_vesting_fund_hive: '5.000 PIXA', total_vesting_shares: '10.000000 VESTS' } as any)
            assert.equal(pixa.toString(), hive.toString())
        })
    })
})
