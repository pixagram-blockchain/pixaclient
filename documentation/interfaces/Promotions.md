[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / Promotions

# Interface: Promotions

Defined in: [chain/pixamind.ts:227](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L227)

The promotion payments behind a post (`author`, `permlink`, `promoted`), or what an account spent
on promotion (`sender`, `total`), newest first. Amounts are in PXS, e.g. `"1.750 PXS"`.

## Properties

### author?

> `optional` **author?**: `string`

Defined in: [chain/pixamind.ts:228](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L228)

***

### permlink?

> `optional` **permlink?**: `string`

Defined in: [chain/pixamind.ts:229](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L229)

***

### promoted?

> `optional` **promoted?**: `string`

Defined in: [chain/pixamind.ts:231](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L231)

Total burned for the post.

***

### promotions

> **promotions**: `object`[]

Defined in: [chain/pixamind.ts:235](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L235)

#### amount

> **amount**: `string`

#### author?

> `optional` **author?**: `string`

An account's spending: which post.

#### block\_num

> **block\_num**: `number`

#### permlink?

> `optional` **permlink?**: `string`

#### post\_exists?

> `optional` **post\_exists?**: `boolean`

An account's spending: false when the memo named no promotable post (the PXS burned anyway).

#### sender?

> `optional` **sender?**: `string`

Payments behind a post: who paid.

#### timestamp

> **timestamp**: `string`

***

### sender?

> `optional` **sender?**: `string`

Defined in: [chain/pixamind.ts:232](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L232)

***

### total?

> `optional` **total?**: `string`

Defined in: [chain/pixamind.ts:234](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L234)

Total the sender burned.
