[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / PostVersion

# Interface: PostVersion

Defined in: [chain/pixamind.ts:198](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L198)

One version of a post or comment (`pixamind_content.get_post_history`).

## Properties

### block\_num

> **block\_num**: `number`

Defined in: [chain/pixamind.ts:200](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L200)

***

### body?

> `optional` **body?**: `string`

Defined in: [chain/pixamind.ts:209](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L209)

Left out with `bodies: false`.

***

### changed

> **changed**: `string`[]

Defined in: [chain/pixamind.ts:206](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L206)

Fields this version changed: `title`, `body`, `json_metadata`.

***

### created

> **created**: `boolean`

Defined in: [chain/pixamind.ts:204](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L204)

True for the creation, false for an edit.

***

### json\_metadata

> **json\_metadata**: `string`

Defined in: [chain/pixamind.ts:210](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L210)

***

### op\_id

> **op\_id**: `string`

Defined in: [chain/pixamind.ts:202](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L202)

***

### timestamp

> **timestamp**: `string`

Defined in: [chain/pixamind.ts:201](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L201)

***

### title

> **title**: `string`

Defined in: [chain/pixamind.ts:207](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L207)

***

### version

> **version**: `number`

Defined in: [chain/pixamind.ts:199](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L199)
