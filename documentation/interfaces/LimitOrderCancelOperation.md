[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / LimitOrderCancelOperation

# Interface: LimitOrderCancelOperation

Defined in: [chain/operation.ts:583](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L583)

Cancels an order and returns the balance to owner.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"limit_order_cancel"`

Defined in: [chain/operation.ts:584](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L584)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:585](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L585)

#### orderid

> **orderid**: `number`

#### owner

> **owner**: `string`

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
