[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / ChainProperties

# Interface: ChainProperties

Defined in: [chain/misc.ts:87](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L87)

Chain roperties that are decided by the witnesses.

## Properties

### account\_creation\_fee

> **account\_creation\_fee**: `string` \| [`Asset`](../classes/Asset.md)

Defined in: [chain/misc.ts:98](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L98)

This fee, paid in PIXA, is converted into VESTING SHARES for the new account. Accounts
without vesting shares cannot earn usage rations and therefore are powerless. This minimum
fee requires all accounts to have some kind of commitment to the network that includes the
ability to vote and make transactions.

#### Remarks

This has to be multiplied by STEEMIT ? `CREATE_ACCOUNT_WITH_PIXA_MODIFIER`
(defined as 30 on the main chain) to get the minimum fee needed to create an account.

***

### hbd\_interest\_rate?

> `optional` **hbd\_interest\_rate?**: `number`

Defined in: [chain/misc.ts:111](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L111)

Same as `pxs_interest_rate`, under the name the node uses.

***

### maximum\_block\_size

> **maximum\_block\_size**: `number`

Defined in: [chain/misc.ts:103](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L103)

This witnesses vote for the maximum_block_size which is used by the network
to tune rate limiting and capacity.

***

### pxs\_interest\_rate?

> `optional` **pxs\_interest\_rate?**: `number`

Defined in: [chain/misc.ts:109](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/misc.ts#L109)

The PXS interest percentage rate decided by witnesses, expressed 0 to 10000 (fixed at 0
on Pixa). The node names it `hbd_interest_rate`; dpixa accepts either name in
`witness_update` and writes both when it signs.
