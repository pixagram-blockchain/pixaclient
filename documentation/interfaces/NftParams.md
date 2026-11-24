[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NftParams

# Interface: NftParams

Defined in: helpers/nft.ts:53

The limits and mint fee nft_operation is checked against at head block (`get_nft_params`).

## Properties

### max\_editions

> **max\_editions**: `number`

Defined in: helpers/nft.ts:57

Copies per NFT: 10,000.

***

### max\_license\_length

> **max\_license\_length**: `number`

Defined in: helpers/nft.ts:61

Bytes of license text: 73,728 (72 KiB).

***

### max\_royalty

> **max\_royalty**: `number`

Defined in: helpers/nft.ts:59

Royalty ceiling in basis points: 2500 (25%).

***

### mint\_fee\_per\_edition

> **mint\_fee\_per\_edition**: [`Asset`](../classes/Asset.md)

Defined in: helpers/nft.ts:55

Mint fee per copy: 1.000 PXS. nft_mint carries it times its number of copies.

***

### price\_symbols

> **price\_symbols**: `string`[]

Defined in: helpers/nft.ts:63

Assets an offer can be made in: `['PXS']`.
