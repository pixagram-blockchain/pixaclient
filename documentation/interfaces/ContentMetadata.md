[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / ContentMetadata

# Interface: ContentMetadata

Defined in: [chain/pixamind.ts:178](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L178)

Metadata of a post (`pixamind_content.get_content_metadata`). A field that does not apply is left out.

## Properties

### author

> **author**: `string`

Defined in: [chain/pixamind.ts:179](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L179)

***

### category?

> `optional` **category?**: `string`

Defined in: [chain/pixamind.ts:182](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L182)

***

### community?

> `optional` **community?**: `string`

Defined in: [chain/pixamind.ts:183](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L183)

***

### content?

> `optional` **content?**: `object`

Defined in: [chain/pixamind.ts:188](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L188)

Format, app, tags, license and, for an artwork, the picture's size, read from json_metadata and the body.

#### Index Signature

\[`key`: `string`\]: `any`

***

### created

> **created**: `string`

Defined in: [chain/pixamind.ts:184](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L184)

***

### depth

> **depth**: `number`

Defined in: [chain/pixamind.ts:181](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L181)

***

### nft?

> `optional` **nft?**: [`PixamindNft`](PixamindNft.md)

Defined in: [chain/pixamind.ts:194](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L194)

Terms and market summary, when the post is minted.

***

### permlink

> **permlink**: `string`

Defined in: [chain/pixamind.ts:180](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L180)

***

### promoted?

> `optional` **promoted?**: `string`

Defined in: [chain/pixamind.ts:190](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L190)

Total burned to promote the post, e.g. `"1.750 PXS"`; only when something was.

***

### title?

> `optional` **title?**: `string`

Defined in: [chain/pixamind.ts:186](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L186)

***

### updated

> **updated**: `string`

Defined in: [chain/pixamind.ts:185](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L185)

***

### versions?

> `optional` **versions?**: `number`

Defined in: [chain/pixamind.ts:192](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L192)

Number of recorded versions (the creation and each edit); only when the history is recorded.
