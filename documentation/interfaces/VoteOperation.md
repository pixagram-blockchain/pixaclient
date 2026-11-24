[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / VoteOperation

# Interface: VoteOperation

Defined in: [chain/operation.ts:876](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L876)

Generic operation.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"vote"`

Defined in: [chain/operation.ts:877](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L877)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:878](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L878)

#### author

> **author**: `string`

#### permlink

> **permlink**: `string`

#### voter

> **voter**: `string`

#### weight

> **weight**: `number`

Voting weight, 100% = 10000 (100_PERCENT).

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
