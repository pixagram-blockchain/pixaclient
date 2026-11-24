[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / Blockchain

# Class: Blockchain

Defined in: [helpers/blockchain.ts:67](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L67)

## Constructors

### Constructor

> **new Blockchain**(`client`): `Blockchain`

Defined in: [helpers/blockchain.ts:68](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L68)

#### Parameters

##### client

[`Client`](Client.md)

#### Returns

`Blockchain`

## Properties

### client

> `readonly` **client**: [`Client`](Client.md)

Defined in: [helpers/blockchain.ts:68](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L68)

## Methods

### getBlockNumbers()

> **getBlockNumbers**(`options?`): `AsyncGenerator`\<`number`, `void`, `unknown`\>

Defined in: [helpers/blockchain.ts:103](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L103)

Return a asynchronous block number iterator.

#### Parameters

##### options?

`number` \| [`BlockchainStreamOptions`](../interfaces/BlockchainStreamOptions.md)

Feed options, can also be a block number to start from.

#### Returns

`AsyncGenerator`\<`number`, `void`, `unknown`\>

***

### getBlockNumberStream()

> **getBlockNumberStream**(`options?`): `ReadableStream`

Defined in: [helpers/blockchain.ts:134](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L134)

Return a stream of block numbers, accepts same parameters as [getBlockNumbers](#getblocknumbers).

#### Parameters

##### options?

`number` \| [`BlockchainStreamOptions`](../interfaces/BlockchainStreamOptions.md)

#### Returns

`ReadableStream`

***

### getBlocks()

> **getBlocks**(`options?`): `AsyncGenerator`\<[`SignedBlock`](../interfaces/SignedBlock.md), `void`, `unknown`\>

Defined in: [helpers/blockchain.ts:141](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L141)

Return a asynchronous block iterator, accepts same parameters as [getBlockNumbers](#getblocknumbers).

#### Parameters

##### options?

`number` \| [`BlockchainStreamOptions`](../interfaces/BlockchainStreamOptions.md)

#### Returns

`AsyncGenerator`\<[`SignedBlock`](../interfaces/SignedBlock.md), `void`, `unknown`\>

***

### getBlockStream()

> **getBlockStream**(`options?`): `ReadableStream`

Defined in: [helpers/blockchain.ts:150](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L150)

Return a stream of blocks, accepts same parameters as [getBlockNumbers](#getblocknumbers).

#### Parameters

##### options?

`number` \| [`BlockchainStreamOptions`](../interfaces/BlockchainStreamOptions.md)

#### Returns

`ReadableStream`

***

### getCurrentBlock()

> **getCurrentBlock**(`mode?`): `Promise`\<[`SignedBlock`](../interfaces/SignedBlock.md)\>

Defined in: [helpers/blockchain.ts:95](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L95)

Get latest block.

#### Parameters

##### mode?

[`BlockchainMode`](../enumerations/BlockchainMode.md)

#### Returns

`Promise`\<[`SignedBlock`](../interfaces/SignedBlock.md)\>

***

### getCurrentBlockHeader()

> **getCurrentBlockHeader**(`mode?`): `Promise`\<[`BlockHeader`](../interfaces/BlockHeader.md)\>

Defined in: [helpers/blockchain.ts:86](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L86)

Get latest block header.

#### Parameters

##### mode?

[`BlockchainMode`](../enumerations/BlockchainMode.md)

#### Returns

`Promise`\<[`BlockHeader`](../interfaces/BlockHeader.md)\>

***

### getCurrentBlockNum()

> **getCurrentBlockNum**(`mode?`): `Promise`\<`number`\>

Defined in: [helpers/blockchain.ts:73](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L73)

Get latest block number.

#### Parameters

##### mode?

[`BlockchainMode`](../enumerations/BlockchainMode.md) = `BlockchainMode.Irreversible`

#### Returns

`Promise`\<`number`\>

***

### getOperations()

> **getOperations**(`options?`): `AsyncGenerator`\<[`AppliedOperation`](../interfaces/AppliedOperation.md), `void`, `unknown`\>

Defined in: [helpers/blockchain.ts:157](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L157)

Return a asynchronous operation iterator, accepts same parameters as [getBlockNumbers](#getblocknumbers).

#### Parameters

##### options?

`number` \| [`BlockchainStreamOptions`](../interfaces/BlockchainStreamOptions.md)

#### Returns

`AsyncGenerator`\<[`AppliedOperation`](../interfaces/AppliedOperation.md), `void`, `unknown`\>

***

### getOperationsStream()

> **getOperationsStream**(`options?`): `ReadableStream`

Defined in: [helpers/blockchain.ts:169](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/blockchain.ts#L169)

Return a stream of operations, accepts same parameters as [getBlockNumbers](#getblocknumbers).

#### Parameters

##### options?

`number` \| [`BlockchainStreamOptions`](../interfaces/BlockchainStreamOptions.md)

#### Returns

`ReadableStream`
