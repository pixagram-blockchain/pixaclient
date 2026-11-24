[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / ChainNft

# Interface: ChainNft

Defined in: helpers/nft.ts:67

An NFT as the chain keeps it (`database_api.find_nfts`, `list_nfts`).

## Properties

### author

> **author**: `string`

Defined in: helpers/nft.ts:72

Creator of the NFT, author of the minted post.

***

### editions

> **editions**: `number`

Defined in: helpers/nft.ts:76

Number of copies, numbered from 1.

***

### id

> **id**: `number`

Defined in: helpers/nft.ts:68

***

### license\_sha256

> **license\_sha256**: `string`

Defined in: helpers/nft.ts:82

SHA-256 of the license text.

***

### license\_size

> **license\_size**: `number`

Defined in: helpers/nft.ts:80

Bytes of the license text, which the mint operation carries.

***

### mint\_time

> **mint\_time**: `string`

Defined in: helpers/nft.ts:74

***

### nft\_id

> **nft\_id**: `string`

Defined in: helpers/nft.ts:70

`@author/permlink/0`

***

### permlink

> **permlink**: `string`

Defined in: helpers/nft.ts:73

***

### reserve

> **reserve**: `number`

Defined in: helpers/nft.ts:84

Copies still with the author since the mint, without an offer of their own.

***

### reserve\_expiration

> **reserve\_expiration**: `string`

Defined in: helpers/nft.ts:92

The reserve offer ends at this time; meaningful only when `reserve_listed`.

***

### reserve\_listed

> **reserve\_listed**: `boolean`

Defined in: helpers/nft.ts:88

True when copy 0 can be bought at head block time.

***

### reserve\_next

> **reserve\_next**: `number`

Defined in: helpers/nft.ts:86

The copy a buyer of copy 0 gets now; 0 when the reserve is empty.

***

### reserve\_price

> **reserve\_price**: [`Asset`](../classes/Asset.md)

Defined in: helpers/nft.ts:90

The author's price for one copy of the reserve; meaningful only when `reserve_listed`.

***

### royalty

> **royalty**: `number`

Defined in: helpers/nft.ts:78

Basis points of a sale price paid to the author.
