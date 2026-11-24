[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / parseNftId

# Function: parseNftId()

> **parseNftId**(`id`): [`NftIdParts`](../interfaces/NftIdParts.md)

Defined in: chain/nft.ts:108

Read an NFT id, "@author/permlink/N", with the node's rules: the author runs to the first '/'
and N follows the last one, so a permlink that holds a '/' still reads correctly; N is written
without leading zeros and is at most 10,000. Throws on anything else.

## Parameters

### id

`string`

## Returns

[`NftIdParts`](../interfaces/NftIdParts.md)
