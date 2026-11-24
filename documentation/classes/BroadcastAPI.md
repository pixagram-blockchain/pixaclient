[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / BroadcastAPI

# Class: BroadcastAPI

Defined in: [helpers/broadcast.ts:113](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L113)

Broadcast API helper.

Part of the lite (fetch-only) client: the signing it needs comes from the
crypto module through crypto-registry.ts, so `client.broadcast` exists even
before `@pixagram/dpixa/crypto` has been loaded. Methods that sign or
compute transaction ids throw a descriptive error until it is.

## Constructors

### Constructor

> **new BroadcastAPI**(`client`): `BroadcastAPI`

Defined in: [helpers/broadcast.ts:120](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L120)

#### Parameters

##### client

[`Client`](Client.md)

#### Returns

`BroadcastAPI`

## Properties

### client

> `readonly` **client**: [`Client`](Client.md)

Defined in: [helpers/broadcast.ts:120](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L120)

***

### expireTime

> **expireTime**: `number`

Defined in: [helpers/broadcast.ts:118](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L118)

How many milliseconds in the future to set the expiry time to when
broadcasting a transaction, defaults to 1 minute.

## Methods

### call()

> **call**(`method`, `params?`): `Promise`\<`any`\>

Defined in: [helpers/broadcast.ts:437](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L437)

Convenience for calling `condenser_api`.

#### Parameters

##### method

`string`

##### params?

`any`[]

#### Returns

`Promise`\<`any`\>

***

### claimRewardBalance()

> **claimRewardBalance**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: [helpers/broadcast.ts:186](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L186)

Claim pending rewards into the account's balances.

#### Parameters

##### data

The amounts to claim, as `getAccounts` shows them pending; PIXA as `reward_pixa`
            (or `reward_hive`), PXS as `reward_pxs` (or `reward_hbd`), and `reward_vests`.

###### account

`string`

###### reward_hbd?

`string` \| [`Asset`](Asset.md)

###### reward_hive?

`string` \| [`Asset`](Asset.md)

###### reward_pixa?

`string` \| [`Asset`](Asset.md)

PIXA to claim (node name: `reward_hive`).

###### reward_pxs?

`string` \| [`Asset`](Asset.md)

PXS to claim (node name: `reward_hbd`).

###### reward_vests

`string` \| [`Asset`](Asset.md)

##### key

[`PrivateKey`](PrivateKey.md)

Private posting key of the account.

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### comment()

> **comment**(`comment`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: [helpers/broadcast.ts:127](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L127)

Broadcast a comment, also used to create a new top level post.

#### Parameters

##### comment

The comment/post.

###### author

`string`

###### body

`string`

###### json_metadata

`string`

###### parent_author

`string`

###### parent_permlink

`string`

###### permlink

`string`

###### title

`string`

##### key

[`PrivateKey`](PrivateKey.md)

Private posting key of comment author.

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### commentWithOptions()

> **commentWithOptions**(`comment`, `options`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: [helpers/broadcast.ts:138](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L138)

Broadcast a comment and set the options.

#### Parameters

##### comment

The comment/post.

###### author

`string`

###### body

`string`

###### json_metadata

`string`

###### parent_author

`string`

###### parent_permlink

`string`

###### permlink

`string`

###### title

`string`

##### options

The comment/post options.

###### allow_curation_rewards

`boolean`

Whether to allow post to recieve curation rewards.

###### allow_votes

`boolean`

Whether to allow post to receive votes.

###### author

`string`

###### extensions

\[`0`, \{ `beneficiaries`: [`BeneficiaryRoute`](../interfaces/BeneficiaryRoute.md)[]; \}\][]

###### max_accepted_payout

`string` \| [`Asset`](Asset.md)

PXS value of the maximum payout this post will receive.

###### percent_hbd?

`number`

Same as `percent_pxs`, under the name the node uses.

###### percent_pxs?

`number`

Share of the payout paid in PXS, in basis points (10000 = 100%); the rest is paid as
Pixa Power. Node name: `percent_hbd`.

###### permlink

`string`

##### key

[`PrivateKey`](PrivateKey.md)

Private posting key of comment author.

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### createTestAccount()

> **createTestAccount**(`options`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: [helpers/broadcast.ts:236](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L236)

Create a new account on testnet.

#### Parameters

##### options

[`CreateAccountOptions`](../interfaces/CreateAccountOptions.md)

New account options.

##### key

[`PrivateKey`](PrivateKey.md)

Private active key of account creator.

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### delegateVestingShares()

> **delegateVestingShares**(`options`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: [helpers/broadcast.ts:362](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L362)

Delegate vesting shares from one account to the other. The vesting shares are still owned
by the original account, but content voting rights and bandwidth allocation are transferred
to the receiving account. This sets the delegation to `vesting_shares`, increasing it or
decreasing it as needed. (i.e. a delegation of 0 removes the delegation)

When a delegation is removed the shares are placed in limbo for a week to prevent a satoshi
of VESTS from voting on the same content twice.

#### Parameters

##### options

Delegation options.

###### delegatee

`string`

The account receiving vesting shares.

###### delegator

`string`

The account delegating vesting shares.

###### vesting_shares

`string` \| [`Asset`](Asset.md)

The amount of vesting shares delegated.

##### key

[`PrivateKey`](PrivateKey.md)

Private active key of the delegator.

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### json()

> **json**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: [helpers/broadcast.ts:175](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L175)

Broadcast custom JSON.

#### Parameters

##### data

The custom_json operation payload.

###### id

`string`

ID string, must be less than 32 characters long.

###### json

`string`

JSON encoded string, must be valid JSON.

###### required_auths

`string`[]

###### required_posting_auths

`string`[]

##### key

[`PrivateKey`](PrivateKey.md)

Private posting or active key.

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### nft()

> **nft**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: [helpers/broadcast.ts:197](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L197)

Broadcast an nft_operation (hardfork 32): mint, offer, withdraw an offer, buy or give away a
copy. [NftAPI](NftAPI.md) (`client.nft`) builds each action and checks it first.

#### Parameters

##### data

`account` (the actor) and `action`, e.g. `[0, { permlink, editions, royalty, license, fee }]`.

###### account

`string`

The actor of the action.

###### action

[`NftActionInput`](../type-aliases/NftActionInput.md)

###### extensions?

`any`[]

Not used; `[]` when omitted.

##### key

[`PrivateKey`](PrivateKey.md) \| [`PrivateKey`](PrivateKey.md)[]

Private active key of `account`.

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### promote()

> **promote**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: [helpers/broadcast.ts:210](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L210)

Promote a post: burn PXS for it by sending it to `null` with the memo `@author/permlink`.
Pixamind adds the amount to the post's promoted total, which ranks the promoted feed while
the post awaits its payout. Only a root post can be promoted, only PXS counts, and the PXS is
burned whatever happens to the post.

#### Parameters

##### data

`from` pays, `author`/`permlink` name the post, `amount` in PXS (from 0.001).

###### amount

`string` \| [`Asset`](Asset.md)

###### author

`string`

###### from

`string`

###### permlink

`string`

##### key

[`PrivateKey`](PrivateKey.md) \| [`PrivateKey`](PrivateKey.md)[]

Private active key of `from`.

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### send()

> **send**(`transaction`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: [helpers/broadcast.ts:426](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L426)

Broadcast a signed transaction to the network.

The operations are sent in the form the node reads (see `normalizeTransaction`), which never
changes what the signatures cover. The node checks and queues the transaction; `id` is its
transaction id, and `client.transaction.findTransaction(id)` tells when it is in a block.

#### Parameters

##### transaction

[`SignedTransaction`](../interfaces/SignedTransaction.md)

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### sendOperations()

> **sendOperations**(`operations`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: [helpers/broadcast.ts:375](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L375)

Sign and broadcast transaction with operations to the network. Throws if the transaction expires.

#### Parameters

##### operations

[`Operation`](../interfaces/Operation.md)[]

List of operations to send.

##### key

[`PrivateKey`](PrivateKey.md) \| [`PrivateKey`](PrivateKey.md)[]

Private key(s) used to sign transaction.

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### sign()

> **sign**(`transaction`, `key`): [`SignedTransaction`](../interfaces/SignedTransaction.md)

Defined in: [helpers/broadcast.ts:412](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L412)

Sign a transaction with key(s).

#### Parameters

##### transaction

[`Transaction`](../interfaces/Transaction.md)

##### key

[`PrivateKey`](PrivateKey.md) \| [`PrivateKey`](PrivateKey.md)[]

#### Returns

[`SignedTransaction`](../interfaces/SignedTransaction.md)

***

### transfer()

> **transfer**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: [helpers/broadcast.ts:165](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L165)

Broadcast a transfer.

#### Parameters

##### data

The transfer operation payload.

###### amount

`string` \| [`Asset`](Asset.md)

Amount of PIXA or PXS to send.

###### from

`string`

Sending account name.

###### memo

`string`

Plain-text note attached to transaction.

###### to

`string`

Receiving account name.

##### key

[`PrivateKey`](PrivateKey.md)

Private active key of sender.

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### updateAccount()

> **updateAccount**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: [helpers/broadcast.ts:345](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L345)

Update account.

#### Parameters

##### data

The account_update payload.

###### account

`string`

###### active?

[`AuthorityType`](../interfaces/AuthorityType.md)

###### json_metadata

`string`

###### memo_key

`string` \| [`PublicKey`](PublicKey.md)

###### owner?

[`AuthorityType`](../interfaces/AuthorityType.md)

###### posting?

[`AuthorityType`](../interfaces/AuthorityType.md)

##### key

[`PrivateKey`](PrivateKey.md)

The private key of the account affected, should be the corresponding
           key level or higher for updating account authorities.

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### vote()

> **vote**(`vote`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: [helpers/broadcast.ts:155](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L155)

Broadcast a vote.

#### Parameters

##### vote

The vote to send.

###### author

`string`

###### permlink

`string`

###### voter

`string`

###### weight

`number`

Voting weight, 100% = 10000 (100_PERCENT).

##### key

[`PrivateKey`](PrivateKey.md)

Private posting key of the voter.

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>
