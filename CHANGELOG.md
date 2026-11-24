# Changelog

## 1.7.0 — 2026-11-24

Support for chain hardfork 32 (native NFTs, the new voting bar) and Pixamind's NFT, promotion and
post-history methods. Nothing that worked in 1.6.0 needs a change; the few type changes are listed
under Breaking (types only).

### NFTs (hardfork 32)

- `nft` operation (37), its five actions (`nft_mint`, `nft_list`, `nft_unlist`, `nft_buy`,
  `nft_transfer`) and its serializer, checked byte for byte against bytes printed by the node
  (`test/nft.ts`). The action can be given as `[tag, payload]`, `[name, payload]` or
  `{ type, value }`; it is signed and sent as `[tag, payload]`, the form condenser_api reads.
  Missing or out-of-range numbers and unreadable dates throw instead of being signed as 0.
  Fed through the node's own JSON parser (condenser_api mode), every action dpixa sends gives
  back the bytes it signed.
- An offer that never expires is sent without `expiration`: the node refuses JSON times after
  2038-01-19T03:14:07, including its own never-expiring `2106-02-07T06:28:15`, so dpixa drops that
  value and refuses a later expiration before signing (`NFT_LATEST_EXPIRATION`).
- Virtual operations `nft_sold` (93) and `nft_royalty` (94), with their types.
- `client.nft` (`NftAPI`): `getParams`, `find`, `getNft`, `getEdition`, `areMinted`,
  `listByCreator`, `listEditions`, `listByOwner`, `askingPrice` (`database_api`, amounts as
  `Asset`), and the actions `mint` (fee computed from the chain, checked before signing),
  `list`, `unlist`, `buy` (price read from the chain when left out), `transfer`, `burn`.
- The reserve: `offerReserve`, `withdrawReserve` and `buyFromReserve` offer and buy every copy
  that never left its author at one price, as edition 0.
- `client.pixamind`: `getNft`, `getNfts`, `listNftEditions`, `listCreatedNfts`, `listOwnedNfts`,
  `listNftMarket`, `getNftHistory`, `getNftLicense`.
- Helpers: `parseNftId`, `formatNftId`, `isNftId`, `nftMintFee`, `nftRoyalty` (rounded down as the
  node rounds), `nftSaleSplit`, `checkNftMint`, `utf8ByteLength`, `toNftAction`,
  `nftActionName` and the `NFT_*` constants.
- `Discussion.nft_minted`, which every post from Pixamind carries.
- `client.broadcast.nft(data, key)` for an operation built by hand.

### Voting bar (hardfork 32)

- `DynamicGlobalProperties` has `voting_mana_regeneration_seconds` (576,000 from hardfork 32),
  `delegation_return_period` and `downvote_pool_percent`.
- `client.rc.calculateVPMana(account, props)` refills with the chain's refill time;
  `getVPMana(username)` reads it. Without `props`, the 432,000 s of earlier hardforks is kept.
- New: `calculateDownvoteMana`, `getDownvoteMana`, `calculateVoteCost` and `getVoteCost` (the
  node's exact formula; a 100% vote costs 3% of the bar from hardfork 32, 2% before),
  `getVotingManaRegenerationSeconds`.

### Promotion, post metadata and history

- `client.broadcast.promote({ from, author, permlink, amount }, key)`: burns PXS for a post with
  the memo `@author/permlink`; refuses other assets.
- `client.pixamind.getPromotedPosts`, `getPromotions`, `getPromotionsBySender`,
  `getContentMetadata`, `getContentMetadataBatch`, `getPostHistory`, `getPost`, `getInfo`,
  `callNamespace`.

### Fixes

- Operation 37 is `nft`. It was `reset_account`, a placeholder no block ever contained; sending it
  would now be read as an NFT operation, so its serializer is removed.
- The node reads `percent_hbd`, `reward_hive`/`reward_hbd`, `hbd_amount`/`hive_amount` and
  `hbd_interest_rate`, where dpixa uses `percent_pxs`, `reward_pixa`/`reward_pxs`,
  `pxs_amount`/`pixa_amount` and `pxs_interest_rate`. Either name is accepted now, and signing
  writes the value under both, so the node reads what was signed: a node reading only the Hive
  names rejected such an operation whenever the field was not at its default (for example
  `percent_pxs: 0`). `api.pixagram.com` renames these fields on the way to its node, so this
  showed only with a node reached directly. `normalizeTransaction` / `normalizeOperation` do
  this and never change a digest. Two names holding different values are refused.
- `utils.buildWitnessUpdateOp` writes `pxs_exchange_rate` and `pxs_interest_rate` as
  `hbd_exchange_rate` and `hbd_interest_rate`, the properties the node looks up; it ignored the
  `pxs_*` names, and through `api.pixagram.com`, which renames them inside the signed data, the
  signature failed. Now that the node reads it, a non-zero interest rate is refused by the node,
  which fixes the rate at 0. Properties are sorted in byte order, as the node sorts them.
- `client.broadcast.claimRewardBalance`, documented in the README but missing, exists.
- `getVestingSharePrice` reads `total_vesting_fund_pixa` or `total_vesting_fund_hive`.
- `Asset.from` reads amounts in the database_api form `{ amount, precision, nai }`
  (`Asset.fromNai`, `symbolOfNai`).
- `VirtualOperationName` and `utils.operationOrders` list the virtual operations 85 to 94 and the
  node's names of 67, 68, 69 and 74 (`dhf_funding`, `hardfork_hive`, `hardfork_hive_restore`,
  `dhf_conversion`); the earlier names stay.
- `TransactionConfirmation.block_num`, `trx_num` and `expired` are optional: the broadcast dpixa
  uses answers before the transaction is in a block, with its `id` only.
  `client.transaction.findTransaction` returns `block_num` when there is one.
- The serializer test vectors expected Steem's symbol bytes (STEEM, SBD); Pixa's are PIXA and PXS.
  `make test-unit` passes again.
- `npm test`, the lint gate, passes: 178 errors fixed on main (formatting, unused names,
  shadowing); member order is not enforced in the vendored `src/bytebuffer.ts`.
- `BroadcastAPI`, `TransactionStatusAPI` and the resource credit types are exported, so the API
  reference documents them.

### Repository and node names

- dpixa's repository is now [pixagram-blockchain/pixaclient](https://github.com/pixagram-blockchain/pixaclient),
  with the history of `pixagram-blockchain/dpixa`. The npm package keeps its name, `@pixagram/dpixa`.
- pixacore 1.32.0, the node of hardfork 32 ([pixagram-blockchain/pixacore](https://github.com/pixagram-blockchain/pixacore)),
  writes Pixa's names in its JSON (`percent_pxs`, `pxs_balance`, `reward_pixa`, ...) and still reads
  Hive's. dpixa signs the same bytes for either and writes both names, so it works with that node
  and with earlier ones. The witness properties `hbd_exchange_rate` and `hbd_interest_rate` keep
  their names on every node: they are signed data.

### Breaking (types only)

- `ResetAccountOperation` is removed and `'reset_account'` is no longer an `OperationName`.
- `CommentOptionsOperation.percent_pxs`, the reward fields of `ClaimRewardBalanceOperation`, the
  amounts of the escrow operations and `ChainProperties.pxs_interest_rate` are optional, each
  having a second name.
- `TransactionConfirmation.block_num`, `trx_num` and `expired` are optional.

### Documentation

- README rewritten around one table of contents, with sections on NFTs, the voting bar, promoted
  posts, post metadata and the field names; Hive node URLs, a wrong asset description, wrong
  method names (`customJson`), the license and the manabar percentage scale corrected.
- `docs/` and `documentation/` regenerated.
