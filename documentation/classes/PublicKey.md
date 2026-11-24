[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / PublicKey

# Class: PublicKey

Defined in: [crypto.ts:220](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/crypto.ts#L220)

ECDSA (secp256k1) public key.

## Constructors

### Constructor

> **new PublicKey**(`key`, `prefix?`): `PublicKey`

Defined in: [crypto.ts:224](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/crypto.ts#L224)

#### Parameters

##### key

`any`

##### prefix?

`string` = `DEFAULT_ADDRESS_PREFIX`

#### Returns

`PublicKey`

## Properties

### key

> `readonly` **key**: `any`

Defined in: [crypto.ts:225](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/crypto.ts#L225)

***

### prefix

> `readonly` **prefix**: `string` = `DEFAULT_ADDRESS_PREFIX`

Defined in: [crypto.ts:226](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/crypto.ts#L226)

***

### uncompressed

> `readonly` **uncompressed**: `BBuffer`

Defined in: [crypto.ts:222](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/crypto.ts#L222)

## Methods

### inspect()

> **inspect**(): `string`

Defined in: [crypto.ts:290](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/crypto.ts#L290)

Used by `utils.inspect` and `console.log` in node.js.

#### Returns

`string`

***

### toJSON()

> **toJSON**(): `string`

Defined in: [crypto.ts:283](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/crypto.ts#L283)

Return JSON representation of this key, same as toString().

#### Returns

`string`

***

### toString()

> **toString**(): `string`

Defined in: [crypto.ts:276](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/crypto.ts#L276)

Return a WIF-encoded representation of the key.

#### Returns

`string`

***

### verify()

> **verify**(`message`, `signature`): `boolean`

Defined in: [crypto.ts:266](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/crypto.ts#L266)

Verify a 32-byte signature.

#### Parameters

##### message

`BBuffer`

32-byte message to verify.

##### signature

[`Signature`](Signature.md)

Signature to verify.

#### Returns

`boolean`

***

### from()

> `static` **from**(`value`): `PublicKey`

Defined in: [crypto.ts:253](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/crypto.ts#L253)

Create a new instance.

#### Parameters

##### value

`string` \| `PublicKey`

#### Returns

`PublicKey`

***

### fromBuffer()

> `static` **fromBuffer**(`key`): `object`

Defined in: [crypto.ts:237](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/crypto.ts#L237)

#### Parameters

##### key

`ByteBuffer`

#### Returns

`object`

##### key

> **key**: `ByteBuffer`

***

### fromString()

> `static` **fromString**(`wif`): `PublicKey`

Defined in: [crypto.ts:245](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/crypto.ts#L245)

Create a new instance from a WIF-encoded key.

#### Parameters

##### wif

`string`

#### Returns

`PublicKey`
