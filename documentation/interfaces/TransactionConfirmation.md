[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / TransactionConfirmation

# Interface: TransactionConfirmation

Defined in: [chain/transaction.ts:57](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/transaction.ts#L57)

What a broadcast returns. dpixa broadcasts with `condenser_api.broadcast_transaction`, which
answers once the node has accepted the transaction, before it is in a block: `id` is set, and
`client.transaction.findTransaction(id)` tells when the transaction is in a block. The other
fields come only from `broadcast_transaction_synchronous`, called directly.

## Properties

### block\_num?

> `optional` **block\_num?**: `number`

Defined in: [chain/transaction.ts:59](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/transaction.ts#L59)

***

### expired?

> `optional` **expired?**: `boolean`

Defined in: [chain/transaction.ts:61](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/transaction.ts#L61)

***

### id

> **id**: `string`

Defined in: [chain/transaction.ts:58](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/transaction.ts#L58)

***

### trx\_num?

> `optional` **trx\_num?**: `number`

Defined in: [chain/transaction.ts:60](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/transaction.ts#L60)
