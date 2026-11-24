[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NFT\_NEVER\_EXPIRES

# Variable: NFT\_NEVER\_EXPIRES

> `const` **NFT\_NEVER\_EXPIRES**: `"2106-02-07T06:28:15"` = `'2106-02-07T06:28:15'`

Defined in: chain/nft.ts:67

Expiration of an offer that never expires (`time_point_sec::maximum()`), as the node writes it
in what it returns. To make such an offer, leave `expiration` out: the node cannot read this
time back from JSON (see [NFT\_LATEST\_EXPIRATION](NFT_LATEST_EXPIRATION.md)), and dpixa does not send it.
