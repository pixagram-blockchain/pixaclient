[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / PixamindNftEvent

# Interface: PixamindNftEvent

Defined in: [chain/pixamind.ts:140](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L140)

One event of an NFT's history (`get_history`): mint, list, unlist, sale, transfer or burn.

## Properties

### account

> **account**: `string`

Defined in: [chain/pixamind.ts:152](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L152)

The actor: minter, owner, buyer, giver.

***

### author

> **author**: `string`

Defined in: [chain/pixamind.ts:147](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L147)

***

### block\_num

> **block\_num**: `number`

Defined in: [chain/pixamind.ts:143](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L143)

***

### edition?

> `optional` **edition?**: `number`

Defined in: [chain/pixamind.ts:150](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L150)

Absent for the mint and the reserve.

***

### editions?

> `optional` **editions?**: `number`

Defined in: [chain/pixamind.ts:162](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L162)

Mint only.

***

### expiration?

> `optional` **expiration?**: `string`

Defined in: [chain/pixamind.ts:160](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L160)

***

### fee?

> `optional` **fee?**: `string`

Defined in: [chain/pixamind.ts:166](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L166)

***

### id

> **id**: `string`

Defined in: [chain/pixamind.ts:142](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L142)

Event id (an operation id, as a string).

***

### license\_sha256?

> `optional` **license\_sha256?**: `string`

Defined in: [chain/pixamind.ts:165](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L165)

***

### license\_size?

> `optional` **license\_size?**: `number`

Defined in: [chain/pixamind.ts:164](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L164)

***

### nft\_id

> **nft\_id**: `string`

Defined in: [chain/pixamind.ts:146](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L146)

***

### permlink

> **permlink**: `string`

Defined in: [chain/pixamind.ts:148](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L148)

***

### price?

> `optional` **price?**: `string`

Defined in: [chain/pixamind.ts:157](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L157)

***

### royalty?

> `optional` **royalty?**: `string`

Defined in: [chain/pixamind.ts:159](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L159)

Sale: the part paid to the creator.

***

### royalty\_rate?

> `optional` **royalty\_rate?**: `number`

Defined in: [chain/pixamind.ts:163](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L163)

***

### seller?

> `optional` **seller?**: `string`

Defined in: [chain/pixamind.ts:154](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L154)

Sale: the previous owner.

***

### timestamp

> **timestamp**: `string`

Defined in: [chain/pixamind.ts:144](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L144)

***

### to?

> `optional` **to?**: `string`

Defined in: [chain/pixamind.ts:156](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L156)

Transfer: the receiver.

***

### type

> **type**: `"transfer"` \| `"mint"` \| `"list"` \| `"unlist"` \| `"sale"` \| `"burn"`

Defined in: [chain/pixamind.ts:145](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L145)
