[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / PixamindNftTerms

# Interface: PixamindNftTerms

Defined in: [chain/pixamind.ts:43](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L43)

Terms of an NFT, fixed at mint. Amounts are strings such as `"5.000 PXS"`.

## Extended by

- [`PixamindNft`](PixamindNft.md)

## Properties

### author

> **author**: `string`

Defined in: [chain/pixamind.ts:46](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L46)

***

### editions

> **editions**: `number`

Defined in: [chain/pixamind.ts:51](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L51)

***

### license\_sha256

> **license\_sha256**: `string`

Defined in: [chain/pixamind.ts:60](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L60)

SHA-256 of the license text, as the chain keeps it.

***

### license\_size

> **license\_size**: `number`

Defined in: [chain/pixamind.ts:58](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L58)

Bytes of the license text; the text itself: [PixamindAPI.getNftLicense](../classes/PixamindAPI.md#getnftlicense).

***

### mint\_block

> **mint\_block**: `number`

Defined in: [chain/pixamind.ts:50](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L50)

***

### mint\_fee

> **mint\_fee**: `string`

Defined in: [chain/pixamind.ts:56](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L56)

***

### minted

> **minted**: `string`

Defined in: [chain/pixamind.ts:49](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L49)

Mint time, e.g. `2027-01-10T12:02:03`.

***

### nft\_id

> **nft\_id**: `string`

Defined in: [chain/pixamind.ts:45](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L45)

`@author/permlink/0`

***

### permlink

> **permlink**: `string`

Defined in: [chain/pixamind.ts:47](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L47)

***

### post\_exists

> **post\_exists**: `boolean`

Defined in: [chain/pixamind.ts:62](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L62)

False when the minted post was removed from Pixamind's index.

***

### royalty

> **royalty**: `number`

Defined in: [chain/pixamind.ts:53](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L53)

Basis points of each later sale paid to the creator.

***

### royalty\_percent

> **royalty\_percent**: `string`

Defined in: [chain/pixamind.ts:55](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L55)

The royalty as a percentage with two decimals, e.g. `"10.00"`.
