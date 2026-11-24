[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / PostsQuery

# Interface: PostsQuery

Defined in: [helpers/pixamind.ts:23](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L23)

## Properties

### limit?

> `optional` **limit?**: `number`

Defined in: [helpers/pixamind.ts:27](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L27)

Number of posts to fetch

***

### muted\_reasons\_filter?

> `optional` **muted\_reasons\_filter?**: `number`[]

Defined in: [helpers/pixamind.ts:52](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L52)

Mute reasons to leave out (bridge's muted_reasons_filter)

***

### observer?

> `optional` **observer?**: `string`

Defined in: [helpers/pixamind.ts:40](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L40)

Observer account

***

### sort

> **sort**: `"hot"` \| `"promoted"` \| `"trending"` \| `"created"` \| `"payout"` \| `"payout_comments"` \| `"muted"`

Defined in: [helpers/pixamind.ts:31](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L31)

Sorting posts

***

### start\_author?

> `optional` **start\_author?**: `string`

Defined in: [helpers/pixamind.ts:44](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L44)

Paginating last post author

***

### start\_permlink?

> `optional` **start\_permlink?**: `string`

Defined in: [helpers/pixamind.ts:48](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L48)

Paginating last post permlink

***

### tag?

> `optional` **tag?**: `string` \| `string`[]

Defined in: [helpers/pixamind.ts:36](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L36)

Tag, community (`portal-…`), or `my` with an observer: the communities the observer
subscribes to (`promoted` too)
