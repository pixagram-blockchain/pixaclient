[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NftTransfer

# Interface: NftTransfer

Defined in: [chain/operation.ts:1108](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1108)

nft_transfer, action 4: gives a copy away, without payment and so without royalty. Only the
owner can. Ends any offer of the copy. Giving it to `null` burns it.

## Properties

### author

> **author**: `string`

Defined in: [chain/operation.ts:1109](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1109)

***

### edition

> **edition**: `number`

Defined in: [chain/operation.ts:1112](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1112)

The copy, 1 to the number of copies (the reserve cannot be given as a whole).

***

### extensions?

> `optional` **extensions?**: `any`[]

Defined in: [chain/operation.ts:1116](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1116)

Not used; `[]` when omitted.

***

### permlink

> **permlink**: `string`

Defined in: [chain/operation.ts:1110](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1110)

***

### to

> **to**: `string`

Defined in: [chain/operation.ts:1114](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1114)

The new owner; `null` burns the copy.
