[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / EscrowDisputeOperation

# Interface: EscrowDisputeOperation

Defined in: [chain/operation.ts:479](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L479)

If either the sender or receiver of an escrow payment has an issue, they can
raise it for dispute. Once a payment is in dispute, the agent has authority over
who gets what.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"escrow_dispute"`

Defined in: [chain/operation.ts:480](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L480)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:481](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L481)

#### agent

> **agent**: `string`

#### escrow\_id

> **escrow\_id**: `number`

#### from

> **from**: `string`

#### to

> **to**: `string`

#### who

> **who**: `string`

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
