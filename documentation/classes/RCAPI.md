[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / RCAPI

# Class: RCAPI

Defined in: [helpers/rc.ts:35](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L35)

## Constructors

### Constructor

> **new RCAPI**(`client`): `RCAPI`

Defined in: [helpers/rc.ts:36](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L36)

#### Parameters

##### client

[`Client`](Client.md)

#### Returns

`RCAPI`

## Properties

### client

> `readonly` **client**: [`Client`](Client.md)

Defined in: [helpers/rc.ts:36](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L36)

## Methods

### calculateDownvoteMana()

> **calculateDownvoteMana**(`account`, `props`): [`Manabar`](../interfaces/Manabar.md)

Defined in: [helpers/rc.ts:125](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L125)

Calculates the downvote mana-data based on an Account - getAccounts(). The downvote bar holds
`downvote_pool_percent` of the voting bar and refills in the same time.

#### Parameters

##### account

[`Account`](../interfaces/Account.md)

##### props

`Partial`\<[`DynamicGlobalProperties`](../interfaces/DynamicGlobalProperties.md)\>

#### Returns

[`Manabar`](../interfaces/Manabar.md)

***

### calculateRCMana()

> **calculateRCMana**(`rc_account`): [`Manabar`](../interfaces/Manabar.md)

Defined in: [helpers/rc.ts:102](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L102)

Calculates the RC mana-data based on an RCAccount - findRCAccounts()

#### Parameters

##### rc\_account

[`RCAccount`](../interfaces/RCAccount.md)

#### Returns

[`Manabar`](../interfaces/Manabar.md)

***

### calculateVoteCost()

> **calculateVoteCost**(`account`, `weight`, `props`): [`VoteCost`](../interfaces/VoteCost.md)

Defined in: [helpers/rc.ts:140](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L140)

What a vote of `weight` (-10000 to 10000) costs the voter, exactly as the node computes it
since hardfork 28: `ceil(floor(effective vests * |weight| * 86400 / 10000) /
(vote_power_reserve_rate * voting_mana_regeneration_seconds))`. From hardfork 32 a 100% vote
costs 3% of a full bar (2% before). A downvote is paid from the downvote bar first.

#### Parameters

##### account

[`Account`](../interfaces/Account.md)

##### weight

`number`

##### props

`Partial`\<[`DynamicGlobalProperties`](../interfaces/DynamicGlobalProperties.md)\>

#### Returns

[`VoteCost`](../interfaces/VoteCost.md)

***

### calculateVPMana()

> **calculateVPMana**(`account`, `props?`): [`Manabar`](../interfaces/Manabar.md)

Defined in: [helpers/rc.ts:116](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L116)

Calculates the voting mana-data based on an Account - getAccounts()

#### Parameters

##### account

[`Account`](../interfaces/Account.md)

##### props?

`Partial`\<[`DynamicGlobalProperties`](../interfaces/DynamicGlobalProperties.md)\>

The dynamic global properties (`getDynamicGlobalProperties()`), whose
             `voting_mana_regeneration_seconds` is the refill time of the bar: 576,000 s
             (15% a day) from hardfork 32. Without them, the 432,000 s (20% a day) of
             earlier hardforks is used.

#### Returns

[`Manabar`](../interfaces/Manabar.md)

***

### call()

> **call**(`method`, `params?`): `Promise`\<`any`\>

Defined in: [helpers/rc.ts:41](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L41)

Convenience for calling `rc_api`.

#### Parameters

##### method

`string`

##### params?

`any`

#### Returns

`Promise`\<`any`\>

***

### findRCAccounts()

> **findRCAccounts**(`usernames`): `Promise`\<[`RCAccount`](../interfaces/RCAccount.md)[]\>

Defined in: [helpers/rc.ts:48](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L48)

Returns RC data for array of usernames

#### Parameters

##### usernames

`string`[]

#### Returns

`Promise`\<[`RCAccount`](../interfaces/RCAccount.md)[]\>

***

### getDownvoteMana()

> **getDownvoteMana**(`username`): `Promise`\<[`Manabar`](../interfaces/Manabar.md)\>

Defined in: [helpers/rc.ts:86](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L86)

Makes API calls and returns the downvote mana-data for a specified username.

#### Parameters

##### username

`string`

#### Returns

`Promise`\<[`Manabar`](../interfaces/Manabar.md)\>

***

### getRCMana()

> **getRCMana**(`username`): `Promise`\<[`Manabar`](../interfaces/Manabar.md)\>

Defined in: [helpers/rc.ts:69](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L69)

Makes a API call and returns the RC mana-data for a specified username

#### Parameters

##### username

`string`

#### Returns

`Promise`\<[`Manabar`](../interfaces/Manabar.md)\>

***

### getResourceParams()

> **getResourceParams**(): `Promise`\<[`RCParams`](../interfaces/RCParams.md)\>

Defined in: [helpers/rc.ts:55](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L55)

Returns the global resource params

#### Returns

`Promise`\<[`RCParams`](../interfaces/RCParams.md)\>

***

### getResourcePool()

> **getResourcePool**(): `Promise`\<[`RCPool`](../interfaces/RCPool.md)\>

Defined in: [helpers/rc.ts:62](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L62)

Returns the global resource pool

#### Returns

`Promise`\<[`RCPool`](../interfaces/RCPool.md)\>

***

### getVoteCost()

> **getVoteCost**(`username`, `weight`): `Promise`\<[`VoteCost`](../interfaces/VoteCost.md)\>

Defined in: [helpers/rc.ts:94](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L94)

Makes API calls and returns what a vote of `weight` would cost `username` now.

#### Parameters

##### username

`string`

##### weight

`number`

#### Returns

`Promise`\<[`VoteCost`](../interfaces/VoteCost.md)\>

***

### getVPMana()

> **getVPMana**(`username`): `Promise`\<[`Manabar`](../interfaces/Manabar.md)\>

Defined in: [helpers/rc.ts:78](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/rc.ts#L78)

Makes API calls and returns the voting mana-data for a specified username, refilled with
the refill time the chain has now.

#### Parameters

##### username

`string`

#### Returns

`Promise`\<[`Manabar`](../interfaces/Manabar.md)\>
