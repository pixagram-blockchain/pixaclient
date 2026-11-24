[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NftHistoryQuery

# Type Alias: NftHistoryQuery

> **NftHistoryQuery** = \{ `nft`: `string`; \} \| \{ `account`: `string`; \} & `object`

Defined in: [helpers/pixamind.ts:86](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/pixamind.ts#L86)

Query of `pixamind_nft.get_history`: one NFT (`…/0`, every copy) or copy (`…/N`), or one account.

## Type Declaration

### limit?

> `optional` **limit?**: `number`

### start?

> `optional` **start?**: `string`
