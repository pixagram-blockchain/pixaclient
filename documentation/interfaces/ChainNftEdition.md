[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / ChainNftEdition

# Interface: ChainNftEdition

Defined in: helpers/nft.ts:96

One copy as the chain sees it (`find_nfts`, `list_nft_editions`).

## Properties

### acquired

> **acquired**: `string`

Defined in: helpers/nft.ts:108

When the owner got the copy.

***

### author

> **author**: `string`

Defined in: helpers/nft.ts:101

***

### burned

> **burned**: `boolean`

Defined in: helpers/nft.ts:106

***

### edition

> **edition**: `number`

Defined in: helpers/nft.ts:103

***

### expiration

> **expiration**: `string`

Defined in: helpers/nft.ts:114

The offer ends at this time; meaningful only when `listed`.

***

### listed

> **listed**: `boolean`

Defined in: helpers/nft.ts:110

True when it can be bought at head block time.

***

### nft

> **nft**: `number`

Defined in: helpers/nft.ts:100

Id of the NFT object.

***

### nft\_id

> **nft\_id**: `string`

Defined in: helpers/nft.ts:98

`@author/permlink/N`

***

### owner

> **owner**: `string`

Defined in: helpers/nft.ts:105

`null` once the copy is burned.

***

### permlink

> **permlink**: `string`

Defined in: helpers/nft.ts:102

***

### price

> **price**: [`Asset`](../classes/Asset.md)

Defined in: helpers/nft.ts:112

Asking price; meaningful only when `listed`.
