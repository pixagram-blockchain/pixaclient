[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NftBuy

# Interface: NftBuy

Defined in: [chain/operation.ts:1093](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1093)

nft_buy, action 3: takes an offer. `price` has to equal the asking price exactly, so a buyer never
pays a price changed after signing. The author receives the royalty unless he is the seller, the
seller the rest. Edition 0 buys the next copy of the reserve, all of the price going to the author.

## Properties

### author

> **author**: `string`

Defined in: [chain/operation.ts:1094](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1094)

***

### edition

> **edition**: `number`

Defined in: [chain/operation.ts:1097](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1097)

The copy, 1 to the number of copies; 0 for the next copy of the reserve.

***

### extensions?

> `optional` **extensions?**: `any`[]

Defined in: [chain/operation.ts:1101](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1101)

Not used; `[]` when omitted.

***

### permlink

> **permlink**: `string`

Defined in: [chain/operation.ts:1095](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1095)

***

### price

> **price**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/operation.ts:1099](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1099)

The asking price, in PXS.
