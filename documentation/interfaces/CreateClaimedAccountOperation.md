[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / CreateClaimedAccountOperation

# Interface: CreateClaimedAccountOperation

Defined in: [chain/operation.ts:363](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L363)

Generic operation.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"create_claimed_account"`

Defined in: [chain/operation.ts:364](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L364)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:365](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L365)

#### active

> **active**: [`AuthorityType`](AuthorityType.md)

#### creator

> **creator**: `string`

#### extensions

> **extensions**: `any`[]

Extensions. Not currently used.

#### json\_metadata

> **json\_metadata**: `string`

#### memo\_key

> **memo\_key**: `string` \| [`PublicKey`](../classes/PublicKey.md)

#### new\_account\_name

> **new\_account\_name**: `string`

#### owner

> **owner**: [`AuthorityType`](AuthorityType.md)

#### posting

> **posting**: [`AuthorityType`](AuthorityType.md)

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
