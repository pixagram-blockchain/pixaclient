[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / PixamindNftEdition

# Interface: PixamindNftEdition

Defined in: [chain/pixamind.ts:66](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L66)

One copy as Pixamind shows it. A field that does not apply is left out.

## Properties

### acquired?

> `optional` **acquired?**: `string`

Defined in: [chain/pixamind.ts:75](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L75)

***

### author

> **author**: `string`

Defined in: [chain/pixamind.ts:69](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L69)

***

### burned?

> `optional` **burned?**: `boolean`

Defined in: [chain/pixamind.ts:74](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L74)

***

### copies?

> `optional` **copies?**: `number`

Defined in: [chain/pixamind.ts:93](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L93)

Reserve offer only: how many copies it covers.

***

### edition

> **edition**: `number`

Defined in: [chain/pixamind.ts:72](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L72)

1 to 10,000; 0 for an offered reserve.

***

### expiration?

> `optional` **expiration?**: `string`

Defined in: [chain/pixamind.ts:80](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L80)

Only for an offer that expires.

***

### last\_sale?

> `optional` **last\_sale?**: `string`

Defined in: [chain/pixamind.ts:86](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L86)

***

### last\_sale\_price?

> `optional` **last\_sale\_price?**: `string`

Defined in: [chain/pixamind.ts:85](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L85)

***

### listed

> **listed**: `boolean`

Defined in: [chain/pixamind.ts:77](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L77)

True while the copy can be bought.

***

### listed\_at?

> `optional` **listed\_at?**: `string`

Defined in: [chain/pixamind.ts:81](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L81)

***

### next?

> `optional` **next?**: `string`

Defined in: [chain/pixamind.ts:95](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L95)

Reserve offer only: the copy the next buyer of copy 0 gets, `@author/permlink/N`.

***

### nft?

> `optional` **nft?**: [`PixamindNftTerms`](PixamindNftTerms.md)

Defined in: [chain/pixamind.ts:97](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L97)

The terms of the NFT, in `get_nfts` for a copy and in market lists.

***

### nft\_id

> **nft\_id**: `string`

Defined in: [chain/pixamind.ts:68](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L68)

`@author/permlink/N`; `@author/permlink/0` for an offered reserve.

***

### owner

> **owner**: `string`

Defined in: [chain/pixamind.ts:73](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L73)

***

### permlink

> **permlink**: `string`

Defined in: [chain/pixamind.ts:70](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L70)

***

### price?

> `optional` **price?**: `string`

Defined in: [chain/pixamind.ts:78](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L78)

***

### reserve?

> `optional` **reserve?**: `boolean`

Defined in: [chain/pixamind.ts:91](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L91)

The copy is in the creator's reserve (bought through copy 0 while the reserve is offered),
or, with edition 0, this entry is the reserve offer itself.

***

### royalties?

> `optional` **royalties?**: `string`

Defined in: [chain/pixamind.ts:84](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L84)

***

### sales?

> `optional` **sales?**: `number`

Defined in: [chain/pixamind.ts:82](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L82)

***

### volume?

> `optional` **volume?**: `string`

Defined in: [chain/pixamind.ts:83](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/pixamind.ts#L83)
