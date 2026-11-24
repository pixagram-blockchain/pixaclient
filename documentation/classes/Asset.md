[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / Asset

# Class: Asset

Defined in: [chain/asset.ts:64](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L64)

Class representing a pixa asset, e.g. `1.000 PIXA` or `12.112233 VESTS`.

## Constructors

### Constructor

> **new Asset**(`amount`, `symbol`): `Asset`

Defined in: [chain/asset.ts:65](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L65)

#### Parameters

##### amount

`number`

##### symbol

[`AssetSymbol`](../type-aliases/AssetSymbol.md)

#### Returns

`Asset`

## Properties

### amount

> `readonly` **amount**: `number`

Defined in: [chain/asset.ts:66](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L66)

***

### symbol

> `readonly` **symbol**: [`AssetSymbol`](../type-aliases/AssetSymbol.md)

Defined in: [chain/asset.ts:67](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L67)

## Methods

### add()

> **add**(`amount`): `Asset`

Defined in: [chain/asset.ts:204](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L204)

Return a new Asset instance with amount added.

#### Parameters

##### amount

`string` \| `number` \| `Asset`

#### Returns

`Asset`

***

### divide()

> **divide**(`divisor`): `Asset`

Defined in: [chain/asset.ts:237](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L237)

Return a new Asset with the amount divided.

#### Parameters

##### divisor

`string` \| `number` \| `Asset`

#### Returns

`Asset`

***

### getPrecision()

> **getPrecision**(): `number`

Defined in: [chain/asset.ts:171](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L171)

Return asset precision.

#### Returns

`number`

***

### multiply()

> **multiply**(`factor`): `Asset`

Defined in: [chain/asset.ts:225](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L225)

Return a new Asset with the amount multiplied by factor.

#### Parameters

##### factor

`string` \| `number` \| `Asset`

#### Returns

`Asset`

***

### steem\_symbols()

> **steem\_symbols**(): `Asset`

Defined in: [chain/asset.ts:183](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L183)

returns a representation of this asset using only STEEM SBD for
legacy purposes

#### Returns

`Asset`

***

### subtract()

> **subtract**(`amount`): `Asset`

Defined in: [chain/asset.ts:213](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L213)

Return a new Asset instance with amount subtracted.

#### Parameters

##### amount

`string` \| `number` \| `Asset`

#### Returns

`Asset`

***

### toJSON()

> **toJSON**(): `string`

Defined in: [chain/asset.ts:249](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L249)

For JSON serialization, same as toString().

#### Returns

`string`

***

### toString()

> **toString**(): `string`

Defined in: [chain/asset.ts:197](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L197)

Return a string representation of this asset, e.g. `42.000 PIXA`.

#### Returns

`string`

***

### from()

> `static` **from**(`value`, `symbol?`): `Asset`

Defined in: [chain/asset.ts:122](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L122)

Convenience to create new Asset.

#### Parameters

##### value

`string` \| `number` \| [`SMTAsset`](../interfaces/SMTAsset.md) \| `Asset`

An Asset, a string such as `"42.000 PIXA"`, a number, or an amount in the
              database_api form `{ amount, precision, nai }` (see [Asset.fromNai](#fromnai)).

##### symbol?

[`AssetSymbol`](../type-aliases/AssetSymbol.md)

Symbol to use when created from number. Will also be used to validate
              the asset, throws if the passed value has a different symbol than this.

#### Returns

`Asset`

***

### fromNai()

> `static` **fromNai**(`value`, `symbol?`): `Asset`

Defined in: [chain/asset.ts:97](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L97)

Create an Asset from the form database_api (and HAF) use for amounts,
`{ amount: "5000", precision: 3, nai: "@@000000013" }`: `@@000000021` is PIXA, `@@000000013`
PXS and `@@000000037` VESTS (on a testnet, pass `TESTS` or `TBD` as `symbol`).

#### Parameters

##### value

[`SMTAsset`](../interfaces/SMTAsset.md)

##### symbol?

[`AssetSymbol`](../type-aliases/AssetSymbol.md)

#### Returns

`Asset`

***

### fromString()

> `static` **fromString**(`string`, `expectedSymbol?`): `Asset`

Defined in: [chain/asset.ts:73](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L73)

Create a new Asset instance from a string, e.g. `42.000 PIXA`.

#### Parameters

##### string

`string`

##### expectedSymbol?

[`AssetSymbol`](../type-aliases/AssetSymbol.md)

#### Returns

`Asset`

***

### max()

> `static` **max**(`a`, `b`): `Asset`

Defined in: [chain/asset.ts:160](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L160)

Return the larger of the two assets.

#### Parameters

##### a

`Asset`

##### b

`Asset`

#### Returns

`Asset`

***

### min()

> `static` **min**(`a`, `b`): `Asset`

Defined in: [chain/asset.ts:149](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L149)

Return the smaller of the two assets.

#### Parameters

##### a

`Asset`

##### b

`Asset`

#### Returns

`Asset`
