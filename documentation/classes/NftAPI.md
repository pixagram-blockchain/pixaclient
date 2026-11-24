[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / NftAPI

# Class: NftAPI

Defined in: helpers/nft.ts:144

Native NFTs, read from the chain (`database_api`) and acted on with `nft_operation`.

Every action is signed with the active key of `account`, its actor. The market summary of an NFT
page, its history and the lists by creator, owner and price come from Pixamind
([PixamindAPI.getNfts](PixamindAPI.md#getnfts) and the other `…Nft…` methods); this helper is what the chain holds
at head block, which is what a purchase is checked against.

## Constructors

### Constructor

> **new NftAPI**(`client`): `NftAPI`

Defined in: helpers/nft.ts:145

#### Parameters

##### client

[`Client`](Client.md)

#### Returns

`NftAPI`

## Properties

### client

> `readonly` **client**: [`Client`](Client.md)

Defined in: helpers/nft.ts:145

## Methods

### areMinted()

> **areMinted**(`posts`): `Promise`\<`boolean`[]\>

Defined in: helpers/nft.ts:198

Whether each post is minted, in the order given (100 posts per request).

#### Parameters

##### posts

[`PostRef`](../type-aliases/PostRef.md)[]

#### Returns

`Promise`\<`boolean`[]\>

***

### askingPrice()

> **askingPrice**(`author`, `permlink`, `edition`): `Promise`\<[`Asset`](Asset.md)\>

Defined in: helpers/nft.ts:380

The price a copy (or the reserve, edition 0) can be bought at now; throws when it is not for sale.

#### Parameters

##### author

`string`

##### permlink

`string`

##### edition

`number`

#### Returns

`Promise`\<[`Asset`](Asset.md)\>

***

### burn()

> **burn**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: helpers/nft.ts:344

Burn a copy: give it to `null`, for good. It keeps its number and still counts among the copies.

#### Parameters

##### data

`object` & [`NftRef`](../type-aliases/NftRef.md)

##### key

[`PrivateKey`](PrivateKey.md) \| [`PrivateKey`](PrivateKey.md)[]

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### buy()

> **buy**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: helpers/nft.ts:325

Buy a copy (or, with edition 0, the next copy of the reserve). The price has to equal the
asking price; left out, it is read from the chain first, and the purchase fails if the offer
changes before the transaction is included.

#### Parameters

##### data

`object` & [`NftRef`](../type-aliases/NftRef.md)

##### key

[`PrivateKey`](PrivateKey.md) \| [`PrivateKey`](PrivateKey.md)[]

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### buyFromReserve()

> **buyFromReserve**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: helpers/nft.ts:372

Buy the next copy of an author's reserve; `price` left out is read from the chain.

#### Parameters

##### data

###### account

`string`

###### author

`string`

###### permlink

`string`

###### price?

`string` \| [`Asset`](Asset.md)

##### key

[`PrivateKey`](PrivateKey.md) \| [`PrivateKey`](PrivateKey.md)[]

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### call()

> **call**(`method`, `params?`): `Promise`\<`any`\>

Defined in: helpers/nft.ts:148

Convenience for calling `database_api`.

#### Parameters

##### method

`string`

##### params?

`any` = `{}`

#### Returns

`Promise`\<`any`\>

***

### find()

> **find**(`ids`): `Promise`\<\{ `editions`: [`ChainNftEdition`](../interfaces/ChainNftEdition.md)[]; `nfts`: [`ChainNft`](../interfaces/ChainNft.md)[]; \}\>

Defined in: helpers/nft.ts:173

Up to 100 NFTs or copies by id: `@author/permlink/0` for an NFT (with its reserve),
`@author/permlink/N` for the NFT with its copy N. Ids that name nothing are left out, so the
call also tells which posts are minted. Each NFT and each copy is answered once, in the order
first asked; a copy that was never offered nor moved is answered as its creator's.

#### Parameters

##### ids

`string`[]

#### Returns

`Promise`\<\{ `editions`: [`ChainNftEdition`](../interfaces/ChainNftEdition.md)[]; `nfts`: [`ChainNft`](../interfaces/ChainNft.md)[]; \}\>

***

### getEdition()

> **getEdition**(`id`): `Promise`\<[`ChainNftEdition`](../interfaces/ChainNftEdition.md) \| `undefined`\>

Defined in: helpers/nft.ts:188

One copy (`@author/permlink/N`, N >= 1), or undefined when there is no such copy.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`ChainNftEdition`](../interfaces/ChainNftEdition.md) \| `undefined`\>

***

### getNft()

> **getNft**(`author`, `permlink`): `Promise`\<[`ChainNft`](../interfaces/ChainNft.md) \| `undefined`\>

Defined in: helpers/nft.ts:182

The NFT of a post, or undefined when the post is not minted.

#### Parameters

##### author

`string`

##### permlink

`string`

#### Returns

`Promise`\<[`ChainNft`](../interfaces/ChainNft.md) \| `undefined`\>

***

### getParams()

> **getParams**(): `Promise`\<[`NftParams`](../interfaces/NftParams.md)\>

Defined in: helpers/nft.ts:155

The limits and mint fee nft_operation is checked against at head block.

#### Returns

`Promise`\<[`NftParams`](../interfaces/NftParams.md)\>

***

### list()

> **list**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: helpers/nft.ts:299

Offer a copy at a fixed price in PXS, or change its offer. The copy stays with its owner until
someone buys it. `expiration` left out: the offer never expires; otherwise at most
2038-01-19T03:14:07, the latest time the node reads.

#### Parameters

##### data

`object` & [`NftRef`](../type-aliases/NftRef.md)

##### key

[`PrivateKey`](PrivateKey.md) \| [`PrivateKey`](PrivateKey.md)[]

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### listByCreator()

> **listByCreator**(`creator`, `options?`): `Promise`\<[`ChainNft`](../interfaces/ChainNft.md)[]\>

Defined in: helpers/nft.ts:216

NFTs a creator minted, in permlink order.

#### Parameters

##### creator

`string`

##### options?

`after`: the permlink to continue after (the last of the previous page);
               `limit`: 1 to 1000, default 100.

###### after?

`string`

###### limit?

`number`

#### Returns

`Promise`\<[`ChainNft`](../interfaces/ChainNft.md)[]\>

***

### listByOwner()

> **listByOwner**(`owner`, `options?`): `Promise`\<[`ChainNftEdition`](../interfaces/ChainNftEdition.md)[]\>

Defined in: helpers/nft.ts:252

Copies an account owns that were offered or moved at least once. A creator's reserve is not
listed: it is `reserve` on each NFT ([listByCreator](#listbycreator)); Pixamind's
[PixamindAPI.listOwnedNfts](PixamindAPI.md#listownednfts) counts both.

#### Parameters

##### owner

`string`

##### options?

`after`: the copy id to continue after (the last of the previous page);
               `limit`: 1 to 1000, default 100.

###### after?

`string`

###### limit?

`number`

#### Returns

`Promise`\<[`ChainNftEdition`](../interfaces/ChainNftEdition.md)[]\>

***

### listEditions()

> **listEditions**(`nft`, `options?`): `Promise`\<[`ChainNftEdition`](../interfaces/ChainNftEdition.md)[]\>

Defined in: helpers/nft.ts:235

The copies of one NFT in number order, each copy once whether or not it ever moved.

#### Parameters

##### nft

`string`

The NFT, `@author/permlink/0` (or any copy id).

##### options?

`from`: first copy, default 1; `limit`: 1 to 1000, default 100.

###### from?

`number`

###### limit?

`number`

#### Returns

`Promise`\<[`ChainNftEdition`](../interfaces/ChainNftEdition.md)[]\>

***

### mint()

> **mint**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: helpers/nft.ts:277

Mint a root post of `account` in 1 to 10,000 copies. `fee` defaults to the copies times the
fee per copy in force (1.000 PXS); it is burned. Royalty and license can never change, and the
post can no longer be edited or deleted. Throws before signing when [checkNftMint](../functions/checkNftMint.md) finds
a problem.

#### Parameters

##### data

`object` & `Omit`\<[`NftMint`](../interfaces/NftMint.md), `"fee"`\> & `object`

##### key

[`PrivateKey`](PrivateKey.md) \| [`PrivateKey`](PrivateKey.md)[]

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### offerReserve()

> **offerReserve**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: helpers/nft.ts:356

Offer the reserve: every copy that never left the author and has no offer of its own, at one
price, in one action. Each buyer gets the lowest-numbered copy still in the reserve and the
author receives the whole price. The offer ends by itself when the reserve runs out.

#### Parameters

##### data

###### account

`string`

###### expiration?

`string`

###### permlink

`string`

###### price

`string` \| [`Asset`](Asset.md)

##### key

[`PrivateKey`](PrivateKey.md) \| [`PrivateKey`](PrivateKey.md)[]

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### transfer()

> **transfer**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: helpers/nft.ts:335

Give a copy to another account: no payment, so no royalty. Ends any offer of the copy.

#### Parameters

##### data

`object` & [`NftRef`](../type-aliases/NftRef.md)

##### key

[`PrivateKey`](PrivateKey.md) \| [`PrivateKey`](PrivateKey.md)[]

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### unlist()

> **unlist**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: helpers/nft.ts:312

Withdraw the offer of a copy. A copy that never left its author goes back to the reserve.

#### Parameters

##### data

`object` & [`NftRef`](../type-aliases/NftRef.md)

##### key

[`PrivateKey`](PrivateKey.md) \| [`PrivateKey`](PrivateKey.md)[]

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

***

### withdrawReserve()

> **withdrawReserve**(`data`, `key`): `Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>

Defined in: helpers/nft.ts:364

Withdraw the reserve offer.

#### Parameters

##### data

###### account

`string`

###### permlink

`string`

##### key

[`PrivateKey`](PrivateKey.md) \| [`PrivateKey`](PrivateKey.md)[]

#### Returns

`Promise`\<[`TransactionConfirmation`](../interfaces/TransactionConfirmation.md)\>
