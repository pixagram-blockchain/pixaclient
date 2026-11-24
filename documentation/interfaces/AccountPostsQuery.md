[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / AccountPostsQuery

# Interface: AccountPostsQuery

Defined in: [helpers/pixamind.ts:91](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L91)

Omitting sort extended from BridgeParam

## Extends

- `Omit`\<[`PostsQuery`](PostsQuery.md), `"sort"`\>

## Properties

### account

> **account**: `string`

Defined in: [helpers/pixamind.ts:92](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L92)

***

### limit?

> `optional` **limit?**: `number`

Defined in: [helpers/pixamind.ts:27](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L27)

Number of posts to fetch

#### Inherited from

[`PostsQuery`](PostsQuery.md).[`limit`](PostsQuery.md#limit)

***

### muted\_reasons\_filter?

> `optional` **muted\_reasons\_filter?**: `number`[]

Defined in: [helpers/pixamind.ts:52](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L52)

Mute reasons to leave out (bridge's muted_reasons_filter)

#### Inherited from

[`PostsQuery`](PostsQuery.md).[`muted_reasons_filter`](PostsQuery.md#muted_reasons_filter)

***

### observer?

> `optional` **observer?**: `string`

Defined in: [helpers/pixamind.ts:40](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L40)

Observer account

#### Inherited from

[`PostsQuery`](PostsQuery.md).[`observer`](PostsQuery.md#observer)

***

### sort

> **sort**: `"posts"`

Defined in: [helpers/pixamind.ts:93](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L93)

***

### start\_author?

> `optional` **start\_author?**: `string`

Defined in: [helpers/pixamind.ts:44](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L44)

Paginating last post author

#### Inherited from

[`PostsQuery`](PostsQuery.md).[`start_author`](PostsQuery.md#start_author)

***

### start\_permlink?

> `optional` **start\_permlink?**: `string`

Defined in: [helpers/pixamind.ts:48](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L48)

Paginating last post permlink

#### Inherited from

[`PostsQuery`](PostsQuery.md).[`start_permlink`](PostsQuery.md#start_permlink)

***

### tag?

> `optional` **tag?**: `string` \| `string`[]

Defined in: [helpers/pixamind.ts:36](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L36)

Tag, community (`portal-…`), or `my` with an observer: the communities the observer
subscribes to (`promoted` too)

#### Inherited from

[`PostsQuery`](PostsQuery.md).[`tag`](PostsQuery.md#tag)
