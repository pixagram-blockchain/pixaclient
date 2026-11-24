[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / TransactionStatusAPI

# Class: TransactionStatusAPI

Defined in: [helpers/transaction.ts:21](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/transaction.ts#L21)

## Constructors

### Constructor

> **new TransactionStatusAPI**(`client`): `TransactionStatusAPI`

Defined in: [helpers/transaction.ts:22](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/transaction.ts#L22)

#### Parameters

##### client

[`Client`](Client.md)

#### Returns

`TransactionStatusAPI`

## Properties

### client

> `readonly` **client**: [`Client`](Client.md)

Defined in: [helpers/transaction.ts:22](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/transaction.ts#L22)

## Methods

### call()

> **call**(`method`, `params?`): `Promise`\<`any`\>

Defined in: [helpers/transaction.ts:27](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/transaction.ts#L27)

Convenience for calling `transaction_status_api`.

#### Parameters

##### method

`string`

##### params?

`any`

#### Returns

`Promise`\<`any`\>

***

### findTransaction()

> **findTransaction**(`transaction_id`, `expiration?`): `Promise`\<\{ `block_num?`: `number`; `status`: [`TransactionStatus`](../type-aliases/TransactionStatus.md); \}\>

Defined in: [helpers/transaction.ts:35](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/transaction.ts#L35)

Returns the status of a given transaction id, with the number of its block once it is in one.
Pass the transaction's `expiration` to tell an expired transaction from an unknown one.

#### Parameters

##### transaction\_id

`string`

##### expiration?

`string`

#### Returns

`Promise`\<\{ `block_num?`: `number`; `status`: [`TransactionStatus`](../type-aliases/TransactionStatus.md); \}\>
