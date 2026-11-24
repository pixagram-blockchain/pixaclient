[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NftMint

# Interface: NftMint

Defined in: [chain/operation.ts:1038](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1038)

nft_mint, action 0 of [NftOperation](NftOperation.md): mints a root post of the actor.
All copies start with the author. Royalty and license are fixed for the life of the NFT, and the
post can no longer be edited or deleted. See [checkNftMint](../functions/checkNftMint.md) and [nftMintFee](../functions/nftMintFee.md).

## Properties

### editions

> **editions**: `number`

Defined in: [chain/operation.ts:1042](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1042)

Number of copies, 1 to 10,000.

***

### extensions?

> `optional` **extensions?**: `any`[]

Defined in: [chain/operation.ts:1050](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1050)

Not used; `[]` when omitted.

***

### fee

> **fee**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/operation.ts:1048](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1048)

`editions` x 1.000 PXS, exactly; burned.

***

### license

> **license**: `string`

Defined in: [chain/operation.ts:1046](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1046)

Full text of the license terms, UTF-8, at most 72 KiB. The chain keeps its SHA-256.

***

### permlink

> **permlink**: `string`

Defined in: [chain/operation.ts:1040](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1040)

Permlink of a root post of the actor (the minter is the author).

***

### royalty

> **royalty**: `number`

Defined in: [chain/operation.ts:1044](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1044)

Basis points of each later sale price paid to the author: 0 to 2500 (25%).
