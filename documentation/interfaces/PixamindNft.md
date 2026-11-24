[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / PixamindNft

# Interface: PixamindNft

Defined in: [chain/pixamind.ts:101](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L101)

An NFT with its terms and the market summary an NFT page needs.

## Extends

- [`PixamindNftTerms`](PixamindNftTerms.md)

## Properties

### author

> **author**: `string`

Defined in: [chain/pixamind.ts:46](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L46)

#### Inherited from

[`PixamindNftTerms`](PixamindNftTerms.md).[`author`](PixamindNftTerms.md#author)

***

### burned

> **burned**: `number`

Defined in: [chain/pixamind.ts:111](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L111)

Copies given to `null`.

***

### copies

> **copies**: `number`

Defined in: [chain/pixamind.ts:103](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L103)

Number of copies (the same as `editions`).

***

### editions

> **editions**: `number`

Defined in: [chain/pixamind.ts:51](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L51)

#### Inherited from

[`PixamindNftTerms`](PixamindNftTerms.md).[`editions`](PixamindNftTerms.md#editions)

***

### floor?

> `optional` **floor?**: `object`

Defined in: [chain/pixamind.ts:123](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L123)

The lowest price a copy can be bought at now, how many copies sell at it, and the ids to buy
them with (at most 100; `@author/permlink/0` is the reserve, which gives `reserve_offer.next`).

#### copies

> **copies**: `number`

#### nft\_ids

> **nft\_ids**: `string`[]

#### price

> **price**: `string`

***

### for\_sale

> **for\_sale**: `number`

Defined in: [chain/pixamind.ts:105](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L105)

Copies that can be bought now: each copy offered on its own, plus the whole reserve while offered.

***

### held\_by\_creator

> **held\_by\_creator**: `number`

Defined in: [chain/pixamind.ts:113](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L113)

Copies the creator still holds: the reserve, plus copies offered on their own or got back.

***

### last\_sale?

> `optional` **last\_sale?**: `object`

Defined in: [chain/pixamind.ts:125](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L125)

The most recent sale of any copy.

#### edition

> **edition**: `number`

#### price

> **price**: `string`

#### time

> **time**: `string`

***

### license\_sha256

> **license\_sha256**: `string`

Defined in: [chain/pixamind.ts:60](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L60)

SHA-256 of the license text, as the chain keeps it.

#### Inherited from

[`PixamindNftTerms`](PixamindNftTerms.md).[`license_sha256`](PixamindNftTerms.md#license_sha256)

***

### license\_size

> **license\_size**: `number`

Defined in: [chain/pixamind.ts:58](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L58)

Bytes of the license text; the text itself: [PixamindAPI.getNftLicense](../classes/PixamindAPI.md#getnftlicense).

#### Inherited from

[`PixamindNftTerms`](PixamindNftTerms.md).[`license_size`](PixamindNftTerms.md#license_size)

***

### listed

> **listed**: `number`

Defined in: [chain/pixamind.ts:107](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L107)

Copies offered on their own.

***

### mint\_block

> **mint\_block**: `number`

Defined in: [chain/pixamind.ts:50](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L50)

#### Inherited from

[`PixamindNftTerms`](PixamindNftTerms.md).[`mint_block`](PixamindNftTerms.md#mint_block)

***

### mint\_fee

> **mint\_fee**: `string`

Defined in: [chain/pixamind.ts:56](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L56)

#### Inherited from

[`PixamindNftTerms`](PixamindNftTerms.md).[`mint_fee`](PixamindNftTerms.md#mint_fee)

***

### minted

> **minted**: `string`

Defined in: [chain/pixamind.ts:49](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L49)

Mint time, e.g. `2027-01-10T12:02:03`.

#### Inherited from

[`PixamindNftTerms`](PixamindNftTerms.md).[`minted`](PixamindNftTerms.md#minted)

***

### nft\_id

> **nft\_id**: `string`

Defined in: [chain/pixamind.ts:45](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L45)

`@author/permlink/0`

#### Inherited from

[`PixamindNftTerms`](PixamindNftTerms.md).[`nft_id`](PixamindNftTerms.md#nft_id)

***

### permlink

> **permlink**: `string`

Defined in: [chain/pixamind.ts:47](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L47)

#### Inherited from

[`PixamindNftTerms`](PixamindNftTerms.md).[`permlink`](PixamindNftTerms.md#permlink)

***

### post\_exists

> **post\_exists**: `boolean`

Defined in: [chain/pixamind.ts:62](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L62)

False when the minted post was removed from Pixamind's index.

#### Inherited from

[`PixamindNftTerms`](PixamindNftTerms.md).[`post_exists`](PixamindNftTerms.md#post_exists)

***

### reserve

> **reserve**: `number`

Defined in: [chain/pixamind.ts:109](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L109)

Copies in the creator's reserve: never left the creator, no offer of their own.

***

### reserve\_offer?

> `optional` **reserve\_offer?**: [`PixamindNftEdition`](PixamindNftEdition.md)

Defined in: [chain/pixamind.ts:118](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L118)

The reserve offer, when copy 0 can be bought now.

***

### royalties

> **royalties**: `string`

Defined in: [chain/pixamind.ts:116](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L116)

***

### royalty

> **royalty**: `number`

Defined in: [chain/pixamind.ts:53](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L53)

Basis points of each later sale paid to the creator.

#### Inherited from

[`PixamindNftTerms`](PixamindNftTerms.md).[`royalty`](PixamindNftTerms.md#royalty)

***

### royalty\_percent

> **royalty\_percent**: `string`

Defined in: [chain/pixamind.ts:55](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L55)

The royalty as a percentage with two decimals, e.g. `"10.00"`.

#### Inherited from

[`PixamindNftTerms`](PixamindNftTerms.md).[`royalty_percent`](PixamindNftTerms.md#royalty_percent)

***

### sales

> **sales**: `number`

Defined in: [chain/pixamind.ts:114](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L114)

***

### volume

> **volume**: `string`

Defined in: [chain/pixamind.ts:115](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L115)
