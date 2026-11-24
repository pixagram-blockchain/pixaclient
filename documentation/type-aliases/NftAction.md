[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NftAction

# Type Alias: NftAction

> **NftAction** = \[`0`, [`NftMint`](../interfaces/NftMint.md)\] \| \[`1`, [`NftList`](../interfaces/NftList.md)\] \| \[`2`, [`NftUnlist`](../interfaces/NftUnlist.md)\] \| \[`3`, [`NftBuy`](../interfaces/NftBuy.md)\] \| \[`4`, [`NftTransfer`](../interfaces/NftTransfer.md)\]

Defined in: [chain/operation.ts:1123](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1123)

An nft_operation action as the node writes it in condenser_api JSON: `[tag, payload]`, the tag
being the action's position (0 mint, 1 list, 2 unlist, 3 buy, 4 transfer).
