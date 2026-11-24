[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / CreateProposalOperation

# Interface: CreateProposalOperation

Defined in: [chain/operation.ts:966](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L966)

Generic operation.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"create_proposal"`

Defined in: [chain/operation.ts:967](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L967)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:968](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L968)

#### creator

> **creator**: `string`

#### daily\_pay

> **daily\_pay**: `string` \| [`Asset`](../classes/Asset.md)

#### end\_date

> **end\_date**: `string`

#### extensions

> **extensions**: `any`[]

#### permlink

> **permlink**: `string`

#### receiver

> **receiver**: `string`

#### start\_date

> **start\_date**: `string`

#### subject

> **subject**: `string`

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
