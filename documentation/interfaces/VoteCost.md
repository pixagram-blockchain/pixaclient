[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / VoteCost

# Interface: VoteCost

Defined in: [chain/rc.ts:59](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/rc.ts#L59)

What a vote costs (`RCAPI.calculateVoteCost`).

## Properties

### full\_vote\_percentage

> **full\_vote\_percentage**: `number`

Defined in: [chain/rc.ts:65](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/rc.ts#L65)

What a 100% vote costs, as a percentage of a full bar: 3 from hardfork 32, 2 before.

***

### mana

> **mana**: `number`

Defined in: [chain/rc.ts:61](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/rc.ts#L61)

Mana the vote uses, in millionths of VESTS (the unit of `voting_manabar`).

***

### percentage

> **percentage**: `number`

Defined in: [chain/rc.ts:63](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/rc.ts#L63)

That mana as a percentage of a full bar, two decimals: 3 is 3%.
