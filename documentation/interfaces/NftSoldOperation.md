[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NftSoldOperation

# Interface: NftSoldOperation

Defined in: [chain/operation.ts:1170](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1170)

Virtual operation 93: a listed copy was bought. For a purchase from the reserve (edition 0),
`edition` is the copy the buyer got.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"nft_sold"`

Defined in: [chain/operation.ts:1171](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1171)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:1172](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1172)

#### author

> **author**: `string`

Creator of the NFT.

#### buyer

> **buyer**: `string`

New owner; paid the price.

#### edition

> **edition**: `number`

#### permlink

> **permlink**: `string`

#### price

> **price**: `string` \| [`Asset`](../classes/Asset.md)

#### royalty

> **royalty**: `string` \| [`Asset`](../classes/Asset.md)

Part of the price paid to the creator; zero when the creator sold.

#### seller

> **seller**: `string`

Previous owner; received the price minus the royalty.

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
