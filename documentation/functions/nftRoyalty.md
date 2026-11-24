[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / nftRoyalty

# Function: nftRoyalty()

> **nftRoyalty**(`price`, `royalty`): [`Asset`](../classes/Asset.md)

Defined in: chain/nft.ts:200

What the creator receives from a sale: `price * royalty / 10000`, rounded down to 0.001, as the
node computes it. A sale by the creator pays no royalty; use [nftSaleSplit](nftSaleSplit.md) for that case.

## Parameters

### price

`string` \| [`Asset`](../classes/Asset.md)

### royalty

`number`

Basis points (1000 is 10%).

## Returns

[`Asset`](../classes/Asset.md)
