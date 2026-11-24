[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / CommentOptionsOperation

# Interface: CommentOptionsOperation

Defined in: [chain/operation.ts:332](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L332)

Payout options of a post or comment, set before its first vote.

The node names the PXS share `percent_hbd`; dpixa also accepts `percent_pxs` and writes both
names when it signs, so the node reads the value that was signed. Give it under one name.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"comment_options"`

Defined in: [chain/operation.ts:333](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L333)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:334](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L334)

#### allow\_curation\_rewards

> **allow\_curation\_rewards**: `boolean`

Whether to allow post to recieve curation rewards.

#### allow\_votes

> **allow\_votes**: `boolean`

Whether to allow post to receive votes.

#### author

> **author**: `string`

#### extensions

> **extensions**: \[`0`, \{ `beneficiaries`: [`BeneficiaryRoute`](BeneficiaryRoute.md)[]; \}\][]

#### max\_accepted\_payout

> **max\_accepted\_payout**: `string` \| [`Asset`](../classes/Asset.md)

PXS value of the maximum payout this post will receive.

#### percent\_hbd?

> `optional` **percent\_hbd?**: `number`

Same as `percent_pxs`, under the name the node uses.

#### percent\_pxs?

> `optional` **percent\_pxs?**: `number`

Share of the payout paid in PXS, in basis points (10000 = 100%); the rest is paid as
Pixa Power. Node name: `percent_hbd`.

#### permlink

> **permlink**: `string`

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
