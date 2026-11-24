[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / Price

# Class: Price

Defined in: [chain/asset.ts:267](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L267)

Represents quotation of the relative value of asset against another asset.
Similar to 'currency pair' used to determine value of currencies.

 For example:
 1 EUR / 1.25 USD where:
 1 EUR is an asset specified as a base
 1.25 USD us an asset specified as a qute

 can determine value of EUR against USD.

## Constructors

### Constructor

> **new Price**(`base`, `quote`): `Price`

Defined in: [chain/asset.ts:276](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L276)

#### Parameters

##### base

[`Asset`](Asset.md)

represents a value of the price object to be expressed relatively to quote
               asset. Cannot have amount == 0 if you want to build valid price.

##### quote

[`Asset`](Asset.md)

represents an relative asset. Cannot have amount == 0, otherwise
               asertion fail.

Both base and quote shall have different symbol defined.

#### Returns

`Price`

## Properties

### base

> `readonly` **base**: [`Asset`](Asset.md)

Defined in: [chain/asset.ts:276](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L276)

represents a value of the price object to be expressed relatively to quote
               asset. Cannot have amount == 0 if you want to build valid price.

***

### quote

> `readonly` **quote**: [`Asset`](Asset.md)

Defined in: [chain/asset.ts:276](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L276)

represents an relative asset. Cannot have amount == 0, otherwise
               asertion fail.

Both base and quote shall have different symbol defined.

## Methods

### convert()

> **convert**(`asset`): [`Asset`](Asset.md)

Defined in: [chain/asset.ts:309](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L309)

Return a new Asset with the price converted between the symbols in the pair.
Throws if passed asset symbol is not base or quote.

#### Parameters

##### asset

[`Asset`](Asset.md)

#### Returns

[`Asset`](Asset.md)

***

### toString()

> **toString**(): `string`

Defined in: [chain/asset.ts:301](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L301)

Return a string representation of this price pair.

#### Returns

`string`

***

### from()

> `static` **from**(`value`): `Price`

Defined in: [chain/asset.ts:290](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/asset.ts#L290)

Convenience to create new Price.

#### Parameters

##### value

[`PriceType`](../type-aliases/PriceType.md)

#### Returns

`Price`
