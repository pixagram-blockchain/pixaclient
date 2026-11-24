[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / Client

# Class: Client

Defined in: [client.ts:171](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L171)

RPC Client
----------
Can be used in both node.js and the browser. Also see [ClientOptions](../interfaces/ClientOptions.md).

## Constructors

### Constructor

> **new Client**(`address`, `options?`): `Client`

Defined in: [client.ts:250](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L250)

#### Parameters

##### address

`string` \| `string`[]

The address to the Pixa RPC server,
e.g. `https://api.pixagram.com`. or [`https://api.pixagram.com`, `https://another.api.com`]

##### options?

[`ClientOptions`](../interfaces/ClientOptions.md) = `{}`

Client options.

#### Returns

`Client`

## Properties

### address

> **address**: `string` \| `string`[]

Defined in: [client.ts:181](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L181)

Address to Pixa RPC server.
String or String[] *read-only*

***

### addressPrefix

> `readonly` **addressPrefix**: `string`

Defined in: [client.ts:231](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L231)

Address prefix for current network.

***

### blockchain

> `readonly` **blockchain**: [`Blockchain`](Blockchain.md)

Defined in: [client.ts:201](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L201)

Blockchain helper.

***

### broadcast

> `readonly` **broadcast**: [`BroadcastAPI`](BroadcastAPI.md)

Defined in: [client.ts:196](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L196)

Broadcast API helper.

***

### chainId

> `readonly` **chainId**: `BBuffer`

Defined in: [client.ts:226](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L226)

Chain ID for current network.

***

### currentAddress

> **currentAddress**: `string`

Defined in: [client.ts:236](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L236)

The RPC node requests go to now; changes when the client fails over to another address.

***

### database

> `readonly` **database**: [`DatabaseAPI`](DatabaseAPI.md)

Defined in: [client.ts:186](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L186)

Database API helper.

***

### keys

> `readonly` **keys**: [`AccountByKeyAPI`](AccountByKeyAPI.md)

Defined in: [client.ts:216](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L216)

Accounts by key API helper.

***

### nft

> `readonly` **nft**: [`NftAPI`](NftAPI.md)

Defined in: [client.ts:211](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L211)

Native NFTs (hardfork 32): chain queries and the actions of nft_operation.

***

### options

> `readonly` **options**: [`ClientOptions`](../interfaces/ClientOptions.md)

Defined in: [client.ts:175](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L175)

Client options, *read-only*.

***

### pixamind

> `readonly` **pixamind**: [`PixamindAPI`](PixamindAPI.md)

Defined in: [client.ts:206](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L206)

Pixamind helper.

***

### rc

> `readonly` **rc**: [`RCAPI`](RCAPI.md)

Defined in: [client.ts:191](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L191)

RC API helper.

***

### transaction

> `readonly` **transaction**: [`TransactionStatusAPI`](TransactionStatusAPI.md)

Defined in: [client.ts:221](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L221)

Transaction status API helper.

## Methods

### call()

> **call**(`api`, `method`, `params?`): `Promise`\<`any`\>

Defined in: [client.ts:303](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L303)

Make a RPC call to the server.

#### Parameters

##### api

`string`

The API to call, e.g. `database_api`.

##### method

`string`

The API method, e.g. `get_dynamic_global_properties`.

##### params?

`any` = `[]`

Array of parameters to pass to the method, optional.

#### Returns

`Promise`\<`any`\>

***

### updateOperations()

> **updateOperations**(`_rebrandedApi?`): `void`

Defined in: [client.ts:406](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L406)

#### Parameters

##### \_rebrandedApi?

`boolean`

#### Returns

`void`

***

### testnet()

> `static` **testnet**(`options?`): `Client`

Defined in: [client.ts:283](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/client.ts#L283)

Create a new client instance configured for the testnet.

#### Parameters

##### options?

[`ClientOptions`](../interfaces/ClientOptions.md)

#### Returns

`Client`
