[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / ClaimRewardBalanceOperation

# Interface: ClaimRewardBalanceOperation

Defined in: [chain/operation.ts:287](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L287)

Moves pending rewards to the account's balances. Signed with the posting key.

The node names the first two fields `reward_hive` and `reward_hbd`; dpixa also accepts
`reward_pixa` and `reward_pxs`, and writes both names when it signs, so the node reads the
amounts that were signed. Give each amount under one of its names.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"claim_reward_balance"`

Defined in: [chain/operation.ts:288](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L288)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:289](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L289)

#### account

> **account**: `string`

#### reward\_hbd?

> `optional` **reward\_hbd?**: `string` \| [`Asset`](../classes/Asset.md)

#### reward\_hive?

> `optional` **reward\_hive?**: `string` \| [`Asset`](../classes/Asset.md)

#### reward\_pixa?

> `optional` **reward\_pixa?**: `string` \| [`Asset`](../classes/Asset.md)

PIXA to claim (node name: `reward_hive`).

#### reward\_pxs?

> `optional` **reward\_pxs?**: `string` \| [`Asset`](../classes/Asset.md)

PXS to claim (node name: `reward_hbd`).

#### reward\_vests

> **reward\_vests**: `string` \| [`Asset`](../classes/Asset.md)

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
