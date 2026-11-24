[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NftList

# Interface: NftList

Defined in: [chain/operation.ts:1058](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1058)

nft_list, action 1: offers a copy at a fixed price in PXS, or replaces its offer. Only the owner
can. Edition 0 offers the author's reserve: every copy that never left the author and has no
offer of its own, at one price, each buyer getting the lowest-numbered copy still in it.

## Properties

### author

> **author**: `string`

Defined in: [chain/operation.ts:1060](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1060)

Author of the minted post.

***

### edition

> **edition**: `number`

Defined in: [chain/operation.ts:1063](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1063)

The copy, 1 to the number of copies; 0 for the reserve.

***

### expiration?

> `optional` **expiration?**: `string`

Defined in: [chain/operation.ts:1070](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1070)

The offer cannot be taken at or after this time. Leave it out for an offer that never expires.
At most 2038-01-19T03:14:07: the node refuses later times in JSON.

***

### extensions?

> `optional` **extensions?**: `any`[]

Defined in: [chain/operation.ts:1072](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1072)

Not used; `[]` when omitted.

***

### permlink

> **permlink**: `string`

Defined in: [chain/operation.ts:1061](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1061)

***

### price

> **price**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/operation.ts:1065](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1065)

Asking price, in PXS.
