[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / nftMintFee

# Function: nftMintFee()

> **nftMintFee**(`editions`, `perEdition?`): [`Asset`](../classes/Asset.md)

Defined in: chain/nft.ts:187

The mint fee nft_mint has to carry: `editions` times 1.000 PXS, which the chain burns.

## Parameters

### editions

`number`

### perEdition?

`string` \| [`Asset`](../classes/Asset.md)

The fee per copy; `database_api.get_nft_params` returns the one in force.

## Returns

[`Asset`](../classes/Asset.md)
