[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NftEditionsQuery

# Interface: NftEditionsQuery

Defined in: [helpers/pixamind.ts:59](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L59)

Query of `pixamind_nft.list_editions`.

## Properties

### limit?

> `optional` **limit?**: `number`

Defined in: [helpers/pixamind.ts:70](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L70)

1 to 100.

***

### nft

> **nft**: `string`

Defined in: [helpers/pixamind.ts:61](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L61)

The NFT, `@author/permlink/0` (any copy number names it).

***

### owner?

> `optional` **owner?**: `string`

Defined in: [helpers/pixamind.ts:68](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L68)

Keep one account's copies.

***

### sort?

> `optional` **sort?**: `"number"` \| `"price"`

Defined in: [helpers/pixamind.ts:66](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L66)

`number`: every copy in order, those of the reserve with `reserve: true`. `price`: what can
be bought now, cheapest first, the offered reserve as one entry (copy 0).

***

### start?

> `optional` **start?**: `string`

Defined in: [helpers/pixamind.ts:72](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L72)

`next_start` of the previous page.
