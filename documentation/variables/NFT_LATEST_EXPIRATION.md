[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NFT\_LATEST\_EXPIRATION

# Variable: NFT\_LATEST\_EXPIRATION

> `const` **NFT\_LATEST\_EXPIRATION**: `"2038-01-19T03:14:07"` = `'2038-01-19T03:14:07'`

Defined in: chain/nft.ts:73

Latest expiration an offer can be given: the node reads JSON times up to 2^31 - 1 seconds after
1970 and refuses later ones ("Datetime overflow"), the never-expiring value included.
