[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / CustomBinaryOperation

# Interface: CustomBinaryOperation

Defined in: [chain/operation.ts:389](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L389)

Generic operation.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"custom_binary"`

Defined in: [chain/operation.ts:390](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L390)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:391](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L391)

#### data

> **data**: `number`[] \| [`HexBuffer`](../classes/HexBuffer.md) \| `Buffer`\<`ArrayBufferLike`\>

#### id

> **id**: `string`

ID string, must be less than 32 characters long.

#### required\_active\_auths

> **required\_active\_auths**: `string`[]

#### required\_auths

> **required\_auths**: [`AuthorityType`](AuthorityType.md)[]

#### required\_owner\_auths

> **required\_owner\_auths**: `string`[]

#### required\_posting\_auths

> **required\_posting\_auths**: `string`[]

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
