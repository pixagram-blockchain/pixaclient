[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / DynamicGlobalProperties

# Interface: DynamicGlobalProperties

Defined in: [chain/misc.ts:140](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L140)

Node state.

## Properties

### average\_block\_size

> **average\_block\_size**: `number`

Defined in: [chain/misc.ts:198](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L198)

Average block size is updated every block to be:

average_block_size = (99 * average_block_size + new_block_size) / 100

This property is used to update the current_reserve_ratio to maintain
approximately 50% or less utilization of network capacity.

***

### confidential\_pxs\_supply

> **confidential\_pxs\_supply**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:175](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L175)

Total asset held in confidential balances.

***

### confidential\_supply

> **confidential\_supply**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:170](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L170)

Total asset held in confidential balances.

***

### current\_aslot

> **current\_aslot**: `number`

Defined in: [chain/misc.ts:213](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L213)

The current absolute slot number. Equal to the total
number of slots since genesis. Also equal to the total
number of missed slots plus head_block_number.

***

### current\_hbd\_supply?

> `optional` **current\_hbd\_supply?**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:261](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L261)

***

### current\_pxs\_supply

> **current\_pxs\_supply**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:171](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L171)

***

### current\_reserve\_ratio

> **current\_reserve\_ratio**: `number`

Defined in: [chain/misc.ts:236](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L236)

Any time average_block_size <= 50% maximum_block_size this value grows by 1 until it
reaches MAX_RESERVE_RATIO.  Any time average_block_size is greater than
50% it falls by 1%.  Upward adjustments happen once per round, downward adjustments
happen every block.

***

### current\_supply

> **current\_supply**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:166](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L166)

***

### current\_witness

> **current\_witness**: `string`

Defined in: [chain/misc.ts:154](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L154)

Currently elected witness.

***

### delegation\_return\_period?

> `optional` **delegation\_return\_period?**: `number`

Defined in: [chain/misc.ts:253](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L253)

Seconds before vesting shares taken back from a delegation can be delegated again:
604,800 (7 days) from hardfork 32, 432,000 (5 days) before.

***

### downvote\_pool\_percent?

> `optional` **downvote\_pool\_percent?**: `number`

Defined in: [chain/misc.ts:255](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L255)

Size of the downvote bar, in basis points of the voting bar.

***

### hbd\_interest\_rate?

> `optional` **hbd\_interest\_rate?**: `number`

Defined in: [chain/misc.ts:262](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L262)

***

### hbd\_print\_rate?

> `optional` **hbd\_print\_rate?**: `number`

Defined in: [chain/misc.ts:263](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L263)

***

### head\_block\_id

> **head\_block\_id**: `string`

Defined in: [chain/misc.ts:146](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L146)

***

### head\_block\_number

> **head\_block\_number**: `number`

Defined in: [chain/misc.ts:145](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L145)

Current block height.

***

### id

> **id**: `number`

Defined in: [chain/misc.ts:141](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L141)

***

### last\_irreversible\_block\_num

> **last\_irreversible\_block\_num**: `number`

Defined in: [chain/misc.ts:219](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L219)

***

### max\_virtual\_bandwidth

> **max\_virtual\_bandwidth**: `string`

Defined in: [chain/misc.ts:229](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L229)

The maximum bandwidth the blockchain can support is:

max_bandwidth = maximum_block_size * BANDWIDTH_AVERAGE_WINDOW_SECONDS / BLOCK_INTERVAL

The maximum virtual bandwidth is:

max_bandwidth * current_reserve_ratio

***

### maximum\_block\_size

> **maximum\_block\_size**: `number`

Defined in: [chain/misc.ts:207](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L207)

Maximum block size is decided by the set of active witnesses which change every round.
Each witness posts what they think the maximum size should be as part of their witness
properties, the median size is chosen to be the maximum block size for the round.

#### Remarks

the minimum value for maximum_block_size is defined by the protocol to prevent the
network from getting stuck by witnesses attempting to set this too low.

***

### num\_pow\_witnesses

> **num\_pow\_witnesses**: `number`

Defined in: [chain/misc.ts:164](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L164)

The current count of how many pending POW witnesses there are, determines
the difficulty of doing pow.

***

### participation\_count

> **participation\_count**: `number`

Defined in: [chain/misc.ts:218](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L218)

***

### pending\_rewarded\_vesting\_hive?

> `optional` **pending\_rewarded\_vesting\_hive?**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:264](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L264)

***

### pending\_rewarded\_vesting\_pixa

> **pending\_rewarded\_vesting\_pixa**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:184](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L184)

***

### pending\_rewarded\_vesting\_shares

> **pending\_rewarded\_vesting\_shares**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:183](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L183)

***

### pxs\_interest\_rate

> **pxs\_interest\_rate**: `number`

Defined in: [chain/misc.ts:188](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L188)

This property defines the interest rate that PXS deposits receive.

***

### pxs\_print\_rate

> **pxs\_print\_rate**: `number`

Defined in: [chain/misc.ts:189](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L189)

***

### recent\_slots\_filled

> **recent\_slots\_filled**: `string`

Defined in: [chain/misc.ts:217](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L217)

Used to compute witness participation.

***

### time

> **time**: `string`

Defined in: [chain/misc.ts:150](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L150)

UTC Server time, e.g. 2020-01-15T00:42:00

***

### total\_pow

> **total\_pow**: `number`

Defined in: [chain/misc.ts:159](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L159)

The total POW accumulated, aka the sum of num_pow_witness at the time
new POW is added.

***

### total\_reward\_fund\_pixa

> **total\_reward\_fund\_pixa**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:178](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L178)

***

### total\_reward\_shares2

> **total\_reward\_shares2**: `string`

Defined in: [chain/misc.ts:182](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L182)

The running total of REWARD^2.

***

### total\_vesting\_fund\_hive?

> `optional` **total\_vesting\_fund\_hive?**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:260](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L260)

Names the node uses for fields that dpixa names after PIXA and PXS: an API node returns one
set or the other. [getVestingSharePrice](../functions/getVestingSharePrice.md) reads either.

***

### total\_vesting\_fund\_pixa

> **total\_vesting\_fund\_pixa**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:176](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L176)

***

### total\_vesting\_shares

> **total\_vesting\_shares**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:177](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L177)

***

### virtual\_supply

> **virtual\_supply**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:165](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L165)

***

### vote\_power\_reserve\_rate

> **vote\_power\_reserve\_rate**: `number`

Defined in: [chain/misc.ts:242](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L242)

Full votes a full voting bar holds, per day of refill: a 100% vote costs
`86400 / (vote_power_reserve_rate * voting_mana_regeneration_seconds)` of the bar.
10 before hardfork 32 (2% per full vote), 5 from it (3%).

***

### voting\_mana\_regeneration\_seconds?

> `optional` **voting\_mana\_regeneration\_seconds?**: `number`

Defined in: [chain/misc.ts:248](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L248)

Seconds an empty voting bar takes to refill (the downvote bar too). A global property from
hardfork 32: 576,000 (6 days 16 hours, 15% a day); older nodes leave it out, and the
refill time was then 432,000 (5 days, 20% a day).
