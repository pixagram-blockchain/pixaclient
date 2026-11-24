[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NftOperation

# Interface: NftOperation

Defined in: [chain/operation.ts:1155](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1155)

The operation of native NFTs (hardfork 32). It carries one action; `account` is its actor (the
minter, the owner who lists, unlists or gives a copy, or the buyer) and signs with the active key.

An NFT is written `@author/permlink/0` and its copy N `@author/permlink/N`. Prices, royalties and
the mint fee are in PXS. A purchase produces the virtual operations `nft_sold` (93) and, when a
royalty is paid, `nft_royalty` (94).

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"nft"`

Defined in: [chain/operation.ts:1156](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1156)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:1157](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1157)

#### account

> **account**: `string`

The actor of the action.

#### action

> **action**: [`NftActionInput`](../type-aliases/NftActionInput.md)

#### extensions?

> `optional` **extensions?**: `any`[]

Not used; `[]` when omitted.

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
