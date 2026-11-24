[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / nftSaleSplit

# Function: nftSaleSplit()

> **nftSaleSplit**(`price`, `royalty`, `sellerIsCreator?`): `object`

Defined in: chain/nft.ts:212

How a sale price is shared: the creator gets the royalty unless the seller is the creator
(a first sale, or a copy the creator got back), and the seller gets the rest.

## Parameters

### price

`string` \| [`Asset`](../classes/Asset.md)

### royalty

`number`

### sellerIsCreator?

`boolean` = `false`

## Returns

`object`

### royalty

> **royalty**: [`Asset`](../classes/Asset.md)

### seller

> **seller**: [`Asset`](../classes/Asset.md)
