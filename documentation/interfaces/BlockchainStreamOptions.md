[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / BlockchainStreamOptions

# Interface: BlockchainStreamOptions

Defined in: [helpers/blockchain.ts:51](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L51)

## Properties

### from?

> `optional` **from?**: `number`

Defined in: [helpers/blockchain.ts:55](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L55)

Start block number, inclusive. If omitted generation will start from current block height.

***

### mode?

> `optional` **mode?**: [`BlockchainMode`](../enumerations/BlockchainMode.md)

Defined in: [helpers/blockchain.ts:64](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L64)

Streaming mode, if set to `Latest` may include blocks that are not applied to the final chain.
Defaults to `Irreversible`.

***

### to?

> `optional` **to?**: `number`

Defined in: [helpers/blockchain.ts:59](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L59)

End block number, inclusive. If omitted stream will continue indefinitely.
