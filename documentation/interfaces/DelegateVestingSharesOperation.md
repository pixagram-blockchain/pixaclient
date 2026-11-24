[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / DelegateVestingSharesOperation

# Interface: DelegateVestingSharesOperation

Defined in: [chain/operation.ts:428](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L428)

Generic operation.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"delegate_vesting_shares"`

Defined in: [chain/operation.ts:429](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L429)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:430](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L430)

#### delegatee

> **delegatee**: `string`

The account receiving vesting shares.

#### delegator

> **delegator**: `string`

The account delegating vesting shares.

#### vesting\_shares

> **vesting\_shares**: `string` \| [`Asset`](../classes/Asset.md)

The amount of vesting shares delegated.

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
