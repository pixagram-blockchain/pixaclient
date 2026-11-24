[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / checkNftMint

# Function: checkNftMint()

> **checkNftMint**(`mint`): `string`[]

Defined in: chain/nft.ts:228

Check an nft_mint the way the node will (format and consensus limits), so a user is told before
signing. Returns the list of problems, empty when the mint would be accepted on these points;
the chain also checks that the post is a root post of the minter, not minted before, and that the
minter holds the fee in liquid PXS.

## Parameters

### mint

`Partial`\<[`NftMint`](../interfaces/NftMint.md)\>

## Returns

`string`[]
