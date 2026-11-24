[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / EscrowReleaseOperation

# Interface: EscrowReleaseOperation

Defined in: [chain/operation.ts:500](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L500)

This operation can be used by anyone associated with the escrow transfer to
release funds if they have permission.

The permission scheme is as follows:
If there is no dispute and escrow has not expired, either party can release funds to the other.
If escrow expires and there is no dispute, either party can release funds to either party.
If there is a dispute regardless of expiration, the agent can release funds to either party
   following whichever agreement was in place between the parties.

## Extends

- [`Operation`](Operation.md)

## Properties

### 0

> **0**: `"escrow_release"`

Defined in: [chain/operation.ts:501](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L501)

#### Overrides

[`Operation`](Operation.md).[`0`](Operation.md#0)

***

### 1

> **1**: `object`

Defined in: [chain/operation.ts:502](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L502)

#### agent

> **agent**: `string`

#### escrow\_id

> **escrow\_id**: `number`

#### from

> **from**: `string`

#### hbd\_amount?

> `optional` **hbd\_amount?**: `string` \| [`Asset`](../classes/Asset.md)

#### hive\_amount?

> `optional` **hive\_amount?**: `string` \| [`Asset`](../classes/Asset.md)

#### pixa\_amount?

> `optional` **pixa\_amount?**: `string` \| [`Asset`](../classes/Asset.md)

The amount of PIXA to release (node name: `hive_amount`).

#### pxs\_amount?

> `optional` **pxs\_amount?**: `string` \| [`Asset`](../classes/Asset.md)

The amount of PXS to release (node name: `hbd_amount`).

#### receiver

> **receiver**: `string`

The account that should receive funds (might be from, might be to).

#### to

> **to**: `string`

The original 'to'.

#### who

> **who**: `string`

The account that is attempting to release the funds, determines valid 'receiver'.

#### Overrides

[`Operation`](Operation.md).[`1`](Operation.md#1)
