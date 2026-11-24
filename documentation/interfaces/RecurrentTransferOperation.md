[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / RecurrentTransferOperation

# Interface: RecurrentTransferOperation

Defined in: [chain/operation.ts:1020](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1020)

Generic operation.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"recurrent_transfer"`

Defined in: [chain/operation.ts:1021](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1021)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:1022](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L1022)

#### amount

> **amount**: `string` \| [`Asset`](../classes/Asset.md)

#### executions

> **executions**: `number`

#### extensions

> **extensions**: `any`[]

#### from

> **from**: `string`

#### memo

> **memo**: `string`

#### recurrence

> **recurrence**: `number`

#### to

> **to**: `string`

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
