[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NftActionInput

# Type Alias: NftActionInput

> **NftActionInput** = [`NftAction`](NftAction.md) \| \[`"nft_mint"`, [`NftMint`](../interfaces/NftMint.md)\] \| \[`"nft_list"`, [`NftList`](../interfaces/NftList.md)\] \| \[`"nft_unlist"`, [`NftUnlist`](../interfaces/NftUnlist.md)\] \| \[`"nft_buy"`, [`NftBuy`](../interfaces/NftBuy.md)\] \| \[`"nft_transfer"`, [`NftTransfer`](../interfaces/NftTransfer.md)\] \| \{ `type`: `"nft_mint"`; `value`: [`NftMint`](../interfaces/NftMint.md); \} \| \{ `type`: `"nft_list"`; `value`: [`NftList`](../interfaces/NftList.md); \} \| \{ `type`: `"nft_unlist"`; `value`: [`NftUnlist`](../interfaces/NftUnlist.md); \} \| \{ `type`: `"nft_buy"`; `value`: [`NftBuy`](../interfaces/NftBuy.md); \} \| \{ `type`: `"nft_transfer"`; `value`: [`NftTransfer`](../interfaces/NftTransfer.md); \}

Defined in: [chain/operation.ts:1134](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1134)

The forms an action can be given in: `[tag, payload]`, `[name, payload]`, or `{type, value}` as
database_api and HAF write it. dpixa signs and sends the `[tag, payload]` form.
