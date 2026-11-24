[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NftRoyaltyOperation

# Interface: NftRoyaltyOperation

Defined in: [chain/operation.ts:1188](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1188)

Virtual operation 94: the royalty of a sale, produced next to nft_sold when it is not zero.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"nft_royalty"`

Defined in: [chain/operation.ts:1189](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1189)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:1190](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1190)

#### buyer

> **buyer**: `string`

#### creator

> **creator**: `string`

Creator of the NFT, who received the royalty.

#### edition

> **edition**: `number`

#### permlink

> **permlink**: `string`

#### royalty

> **royalty**: `string` \| [`Asset`](../classes/Asset.md)

#### seller

> **seller**: `string`

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
