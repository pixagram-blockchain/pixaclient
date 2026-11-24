[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / Comment

# Interface: Comment

Defined in: [chain/comment.ts:39](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L39)

## Extended by

- [`Discussion`](Discussion.md)

## Properties

### abs\_rshares

> **abs\_rshares**: `string`

Defined in: [chain/comment.ts:56](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L56)

***

### active

> **active**: `string`

Defined in: [chain/comment.ts:51](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L51)

***

### allow\_curation\_rewards

> **allow\_curation\_rewards**: `boolean`

Defined in: [chain/comment.ts:74](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L74)

***

### allow\_replies

> **allow\_replies**: `boolean`

Defined in: [chain/comment.ts:72](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L72)

***

### allow\_votes

> **allow\_votes**: `boolean`

Defined in: [chain/comment.ts:73](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L73)

***

### author

> **author**: `string`

Defined in: [chain/comment.ts:44](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L44)

***

### author\_rewards

> **author\_rewards**: `string`

Defined in: [chain/comment.ts:65](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L65)

***

### beneficiaries

> **beneficiaries**: [`BeneficiaryRoute`](BeneficiaryRoute.md)[]

Defined in: [chain/comment.ts:75](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L75)

***

### body

> **body**: `string`

Defined in: [chain/comment.ts:47](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L47)

***

### cashout\_time

> **cashout\_time**: `string`

Defined in: [chain/comment.ts:59](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L59)

***

### category

> **category**: `string`

Defined in: [chain/comment.ts:41](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L41)

***

### children

> **children**: `number`

Defined in: [chain/comment.ts:54](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L54)

***

### children\_abs\_rshares

> **children\_abs\_rshares**: `string`

Defined in: [chain/comment.ts:58](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L58)

***

### created

> **created**: `string`

Defined in: [chain/comment.ts:50](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L50)

***

### curator\_payout\_value

> **curator\_payout\_value**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/comment.ts:64](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L64)

***

### depth

> **depth**: `number`

Defined in: [chain/comment.ts:53](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L53)

***

### id

> **id**: `number`

Defined in: [chain/comment.ts:40](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L40)

***

### json\_metadata

> **json\_metadata**: `string`

Defined in: [chain/comment.ts:48](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L48)

***

### last\_payout

> **last\_payout**: `string`

Defined in: [chain/comment.ts:52](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L52)

***

### last\_update

> **last\_update**: `string`

Defined in: [chain/comment.ts:49](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L49)

***

### max\_accepted\_payout

> **max\_accepted\_payout**: `string`

Defined in: [chain/comment.ts:68](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L68)

***

### max\_cashout\_time

> **max\_cashout\_time**: `string`

Defined in: [chain/comment.ts:60](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L60)

***

### net\_rshares

> **net\_rshares**: `string`

Defined in: [chain/comment.ts:55](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L55)

***

### net\_votes

> **net\_votes**: `number`

Defined in: [chain/comment.ts:66](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L66)

***

### parent\_author

> **parent\_author**: `string`

Defined in: [chain/comment.ts:42](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L42)

***

### parent\_permlink

> **parent\_permlink**: `string`

Defined in: [chain/comment.ts:43](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L43)

***

### percent\_hbd?

> `optional` **percent\_hbd?**: `number`

Defined in: [chain/comment.ts:71](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L71)

***

### percent\_pxs?

> `optional` **percent\_pxs?**: `number`

Defined in: [chain/comment.ts:70](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L70)

Share of the payout paid in PXS, basis points. An API node writes it `percent_pxs` or `percent_hbd`.

***

### permlink

> **permlink**: `string`

Defined in: [chain/comment.ts:45](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L45)

***

### reward\_weight

> **reward\_weight**: `number`

Defined in: [chain/comment.ts:62](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L62)

***

### root\_comment

> **root\_comment**: `number`

Defined in: [chain/comment.ts:67](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L67)

***

### title

> **title**: `string`

Defined in: [chain/comment.ts:46](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L46)

***

### total\_payout\_value

> **total\_payout\_value**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/comment.ts:63](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L63)

***

### total\_vote\_weight

> **total\_vote\_weight**: `number`

Defined in: [chain/comment.ts:61](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L61)

***

### vote\_rshares

> **vote\_rshares**: `string`

Defined in: [chain/comment.ts:57](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/comment.ts#L57)
