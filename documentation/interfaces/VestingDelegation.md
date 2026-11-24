[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / VestingDelegation

# Interface: VestingDelegation

Defined in: [chain/misc.ts:114](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L114)

## Properties

### delegatee

> **delegatee**: `string`

Defined in: [chain/misc.ts:126](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L126)

Account that is receiving vests from delegator.

***

### delegator

> **delegator**: `string`

Defined in: [chain/misc.ts:122](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L122)

Account that is delegating vests to delegatee.

***

### id

> **id**: `number`

Defined in: [chain/misc.ts:118](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L118)

Delegation id.

***

### min\_delegation\_time

> **min\_delegation\_time**: `string`

Defined in: [chain/misc.ts:134](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L134)

Earliest date delegation can be removed.

***

### vesting\_shares

> **vesting\_shares**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:130](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L130)

Amount of VESTS delegated.
