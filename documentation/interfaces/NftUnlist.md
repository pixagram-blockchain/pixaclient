[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NftUnlist

# Interface: NftUnlist

Defined in: [chain/operation.ts:1079](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1079)

nft_unlist, action 2: withdraws an offer. Edition 0 withdraws the reserve offer. A copy that never
left its author goes back to the reserve.

## Properties

### author

> **author**: `string`

Defined in: [chain/operation.ts:1080](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1080)

***

### edition

> **edition**: `number`

Defined in: [chain/operation.ts:1083](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1083)

The copy, 1 to the number of copies; 0 for the reserve.

***

### extensions?

> `optional` **extensions?**: `any`[]

Defined in: [chain/operation.ts:1085](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1085)

Not used; `[]` when omitted.

***

### permlink

> **permlink**: `string`

Defined in: [chain/operation.ts:1081](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1081)
