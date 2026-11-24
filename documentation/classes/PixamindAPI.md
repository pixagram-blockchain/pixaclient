[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / PixamindAPI

# Class: PixamindAPI

Defined in: [helpers/pixamind.ts:127](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L127)

## Constructors

### Constructor

> **new PixamindAPI**(`client`): `PixamindAPI`

Defined in: [helpers/pixamind.ts:128](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L128)

#### Parameters

##### client

[`Client`](Client.md)

#### Returns

`PixamindAPI`

## Properties

### client

> `readonly` **client**: [`Client`](Client.md)

Defined in: [helpers/pixamind.ts:128](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L128)

## Methods

### call()

> **call**(`method`, `params?`): `Promise`\<`any`\>

Defined in: [helpers/pixamind.ts:135](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L135)

Convenience of calling pixamind api

#### Parameters

##### method

`string`

##### params?

`any`

#### Returns

`Promise`\<`any`\>

***

### callNamespace()

> **callNamespace**(`namespace`, `method`, `params?`): `Promise`\<`any`\>

Defined in: [helpers/pixamind.ts:193](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L193)

Call a method of another Pixamind namespace: `pixamind_api`, `pixamind_content`,
`pixamind_feed`, `pixamind_graph` or `pixamind_nft`.

#### Parameters

##### namespace

`string`

##### method

`string`

##### params?

`any` = `{}`

#### Returns

`Promise`\<`any`\>

***

### getAccountNotifications()

> **getAccountNotifications**(`options?`): `Promise`\<[`Notifications`](../interfaces/Notifications.md)[]\>

Defined in: [helpers/pixamind.ts:177](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L177)

Get particular account notifications feed

#### Parameters

##### options?

[`AccountNotifsQuery`](../interfaces/AccountNotifsQuery.md)

#### Returns

`Promise`\<[`Notifications`](../interfaces/Notifications.md)[]\>

***

### getAccountPosts()

> **getAccountPosts**(`options`): `Promise`\<[`Discussion`](../interfaces/Discussion.md)[]\>

Defined in: [helpers/pixamind.ts:151](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L151)

Get posts by particular account from Pixamind

#### Parameters

##### options

[`AccountPostsQuery`](../interfaces/AccountPostsQuery.md)

#### Returns

`Promise`\<[`Discussion`](../interfaces/Discussion.md)[]\>

***

### getCommunity()

> **getCommunity**(`options`): `Promise`\<[`CommunityDetail`](../interfaces/CommunityDetail.md)[]\>

Defined in: [helpers/pixamind.ts:160](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L160)

Get community details such as who are the admin,
moderators, how many subscribers, etc..

#### Parameters

##### options

[`CommunityQuery`](../interfaces/CommunityQuery.md)

#### Returns

`Promise`\<[`CommunityDetail`](../interfaces/CommunityDetail.md)[]\>

***

### getContentMetadata()

> **getContentMetadata**(`author`, `permlink`): `Promise`\<[`ContentMetadata`](../interfaces/ContentMetadata.md)\>

Defined in: [helpers/pixamind.ts:248](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L248)

Metadata of a post: format, tags, license, picture size, and when they apply `promoted`,
`versions` (recorded edits) and `nft` (terms and market summary of a minted post).
Throws when the post does not exist.

#### Parameters

##### author

`string`

##### permlink

`string`

#### Returns

`Promise`\<[`ContentMetadata`](../interfaces/ContentMetadata.md)\>

***

### getContentMetadataBatch()

> **getContentMetadataBatch**(`posts`): `Promise`\<([`ContentMetadata`](../interfaces/ContentMetadata.md) \| `null`)[]\>

Defined in: [helpers/pixamind.ts:255](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L255)

Metadata of up to 100 posts in one call, in the order asked; `null` for a post that does not exist.

#### Parameters

##### posts

\[`string`, `string`\][] \| `object`[]

#### Returns

`Promise`\<([`ContentMetadata`](../interfaces/ContentMetadata.md) \| `null`)[]\>

***

### getInfo()

> **getInfo**(): `Promise`\<\{\[`key`: `string`\]: `any`; \}\>

Defined in: [helpers/pixamind.ts:201](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L201)

What the Pixamind node is: version, indexed block, enabled features (`nfts`, `promotions`,
`post_history`, …) and namespaces.

#### Returns

`Promise`\<\{\[`key`: `string`\]: `any`; \}\>

***

### getNft()

> **getNft**(`author`, `permlink`): `Promise`\<[`PixamindNft`](../interfaces/PixamindNft.md) \| `undefined`\>

Defined in: [helpers/pixamind.ts:296](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L296)

One NFT with its terms and market summary; undefined when the post is not minted.

#### Parameters

##### author

`string`

##### permlink

`string`

#### Returns

`Promise`\<[`PixamindNft`](../interfaces/PixamindNft.md) \| `undefined`\>

***

### getNftHistory()

> **getNftHistory**(`query`): `Promise`\<[`PixamindPage`](../interfaces/PixamindPage.md) & `object`\>

Defined in: [helpers/pixamind.ts:347](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L347)

History of an NFT (`…/0`: every copy), of one copy (`…/N`: that copy and the mint), or of an
account, newest first: mints, offers, sales, gifts and burns. `limit` up to 1,000.

#### Parameters

##### query

[`NftHistoryQuery`](../type-aliases/NftHistoryQuery.md)

#### Returns

`Promise`\<[`PixamindPage`](../interfaces/PixamindPage.md) & `object`\>

***

### getNftLicense()

> **getNftLicense**(`id`): `Promise`\<[`PixamindNftLicense`](../interfaces/PixamindNftLicense.md) \| `undefined`\>

Defined in: [helpers/pixamind.ts:356](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L356)

The full license text of an NFT (any copy id names it), with its size and SHA-256; undefined
when the post is not minted. Compare `license_sha256` with the chain's
([NftAPI.getNft](NftAPI.md#getnft)) to check the text is the one minted.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`PixamindNftLicense`](../interfaces/PixamindNftLicense.md) \| `undefined`\>

***

### getNfts()

> **getNfts**(`ids`): `Promise`\<([`PixamindNftEdition`](../interfaces/PixamindNftEdition.md) \| [`PixamindNft`](../interfaces/PixamindNft.md))[]\>

Defined in: [helpers/pixamind.ts:285](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L285)

NFTs and copies by id, at most 100: for `@author/permlink/0` the NFT with its terms and
market summary (copies, for_sale, floor, reserve, reserve_offer, …), for `@author/permlink/N`
copy N with the terms of its NFT under `nft`. Ids that name nothing are left out, so an empty
answer means "not minted".

#### Parameters

##### ids

`string` \| `string`[]

#### Returns

`Promise`\<([`PixamindNftEdition`](../interfaces/PixamindNftEdition.md) \| [`PixamindNft`](../interfaces/PixamindNft.md))[]\>

***

### getPost()

> **getPost**(`author`, `permlink`, `observer?`): `Promise`\<[`Discussion`](../interfaces/Discussion.md)\>

Defined in: [helpers/pixamind.ts:208](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L208)

One post with its bridge fields, `nft_minted` and `promoted` included.

#### Parameters

##### author

`string`

##### permlink

`string`

##### observer?

`string`

#### Returns

`Promise`\<[`Discussion`](../interfaces/Discussion.md)\>

***

### getPostHistory()

> **getPostHistory**(`author`, `permlink`, `options?`): `Promise`\<[`PostHistory`](../interfaces/PostHistory.md)\>

Defined in: [helpers/pixamind.ts:269](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L269)

Every recorded version of a post or comment, oldest first: the creation, then each edit, with
the fields it changed. `bodies: false` leaves the bodies out.

#### Parameters

##### author

`string`

##### permlink

`string`

##### options?

`start` (version number, from 1), `limit` (1 to 100, default 20), `bodies` (default true)

###### bodies?

`boolean`

###### limit?

`number`

###### start?

`number`

#### Returns

`Promise`\<[`PostHistory`](../interfaces/PostHistory.md)\>

***

### getPromotedPosts()

> **getPromotedPosts**(`query?`): `Promise`\<[`Discussion`](../interfaces/Discussion.md)[]\>

Defined in: [helpers/pixamind.ts:219](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L219)

The promoted feed: root posts awaiting payout that PXS was burned for, highest total first
(newest first on a tie), each with `promoted`. `tag` can be a tag, a community or `my` with
an observer. To promote a post: [BroadcastAPI.promote](BroadcastAPI.md#promote).

#### Parameters

##### query?

[`PromotedPostsQuery`](../type-aliases/PromotedPostsQuery.md) = `{}`

#### Returns

`Promise`\<[`Discussion`](../interfaces/Discussion.md)[]\>

***

### getPromotions()

> **getPromotions**(`author`, `permlink`, `limit?`): `Promise`\<[`Promotions`](../interfaces/Promotions.md)\>

Defined in: [helpers/pixamind.ts:227](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L227)

The payments behind a post, newest first, with its total.

#### Parameters

##### author

`string`

##### permlink

`string`

##### limit?

`number`

1 to 1000, default 100.

#### Returns

`Promise`\<[`Promotions`](../interfaces/Promotions.md)\>

***

### getPromotionsBySender()

> **getPromotionsBySender**(`sender`, `limit?`): `Promise`\<[`Promotions`](../interfaces/Promotions.md)\>

Defined in: [helpers/pixamind.ts:236](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L236)

What an account burned to promote posts, newest first, with its total.

#### Parameters

##### sender

`string`

##### limit?

`number`

1 to 1000, default 100.

#### Returns

`Promise`\<[`Promotions`](../interfaces/Promotions.md)\>

***

### getRankedPosts()

> **getRankedPosts**(`options`): `Promise`\<[`Discussion`](../interfaces/Discussion.md)[]\>

Defined in: [helpers/pixamind.ts:143](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L143)

Get trending, hot, recent community posts from Pixamind

#### Parameters

##### options

[`PostsQuery`](../interfaces/PostsQuery.md)

#### Returns

`Promise`\<[`Discussion`](../interfaces/Discussion.md)[]\>

***

### listAllSubscriptions()

> **listAllSubscriptions**(`account`): `Promise`\<[`Discussion`](../interfaces/Discussion.md)[]\>

Defined in: [helpers/pixamind.ts:169](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L169)

List all subscriptions by particular account

#### Parameters

##### account

`string` \| `object`

the account you want to query

#### Returns

`Promise`\<[`Discussion`](../interfaces/Discussion.md)[]\>

return role, what community the account joined

***

### listCommunities()

> **listCommunities**(`options`): `Promise`\<[`CommunityDetail`](../interfaces/CommunityDetail.md)[]\>

Defined in: [helpers/pixamind.ts:185](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L185)

List all available communities on pixamind

#### Parameters

##### options

[`ListCommunitiesQuery`](../interfaces/ListCommunitiesQuery.md)

#### Returns

`Promise`\<[`CommunityDetail`](../interfaces/CommunityDetail.md)[]\>

***

### listCreatedNfts()

> **listCreatedNfts**(`account`, `options?`): `Promise`\<[`PixamindPage`](../interfaces/PixamindPage.md) & `object`\>

Defined in: [helpers/pixamind.ts:314](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L314)

NFTs an account minted, newest first, each with its summary, and their `total`.

#### Parameters

##### account

`string`

##### options?

###### limit?

`number`

###### start?

`string`

#### Returns

`Promise`\<[`PixamindPage`](../interfaces/PixamindPage.md) & `object`\>

***

### listNftEditions()

> **listNftEditions**(`query`): `Promise`\<[`PixamindPage`](../interfaces/PixamindPage.md) & `object`\>

Defined in: [helpers/pixamind.ts:305](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L305)

The copies of one NFT, page by page: by number (every copy, reserve included) or by price
(what can be bought now, cheapest first, the offered reserve as copy 0).

#### Parameters

##### query

[`NftEditionsQuery`](../interfaces/NftEditionsQuery.md)

#### Returns

`Promise`\<[`PixamindPage`](../interfaces/PixamindPage.md) & `object`\>

***

### listNftMarket()

> **listNftMarket**(`query?`): `Promise`\<[`PixamindPage`](../interfaces/PixamindPage.md) & `object`\>

Defined in: [helpers/pixamind.ts:337](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L337)

What can be bought now across all NFTs, each with the terms of its NFT: copies offered on their
own, and offered reserves as one entry each (copy 0, `reserve: true`, `copies`, `next`).

#### Parameters

##### query?

[`NftMarketQuery`](../interfaces/NftMarketQuery.md) = `{}`

#### Returns

`Promise`\<[`PixamindPage`](../interfaces/PixamindPage.md) & `object`\>

***

### listOwnedNfts()

> **listOwnedNfts**(`account`, `options?`): `Promise`\<[`PixamindPage`](../interfaces/PixamindPage.md) & `object`\>

Defined in: [helpers/pixamind.ts:326](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L326)

NFTs an account holds copies of, latest acquisition first: the terms, how many it holds and
how many of those are for sale. A creator holds the copies it never parted with;
`acquired_only` leaves those out.

#### Parameters

##### account

`string`

##### options?

###### acquired_only?

`boolean`

###### limit?

`number`

###### start?

`string`

#### Returns

`Promise`\<[`PixamindPage`](../interfaces/PixamindPage.md) & `object`\>
