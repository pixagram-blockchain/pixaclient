[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / AccountUpdateOperation

# Interface: AccountUpdateOperation

Defined in: [chain/operation.ts:207](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L207)

Generic operation.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"account_update"`

Defined in: [chain/operation.ts:208](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L208)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:209](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L209)

#### account

> **account**: `string`

#### active?

> `optional` **active?**: [`AuthorityType`](AuthorityType.md)

#### json\_metadata

> **json\_metadata**: `string`

#### memo\_key

> **memo\_key**: `string` \| [`PublicKey`](../classes/PublicKey.md)

#### owner?

> `optional` **owner?**: [`AuthorityType`](AuthorityType.md)

#### posting?

> `optional` **posting?**: [`AuthorityType`](AuthorityType.md)

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
