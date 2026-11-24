[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / CustomJsonOperation

# Interface: CustomJsonOperation

Defined in: [chain/operation.ts:404](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L404)

Generic operation.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"custom_json"`

Defined in: [chain/operation.ts:405](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L405)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:406](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L406)

#### id

> **id**: `string`

ID string, must be less than 32 characters long.

#### json

> **json**: `string`

JSON encoded string, must be valid JSON.

#### required\_auths

> **required\_auths**: `string`[]

#### required\_posting\_auths

> **required\_posting\_auths**: `string`[]

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
