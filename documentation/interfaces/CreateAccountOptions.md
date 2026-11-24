[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / CreateAccountOptions

# Interface: CreateAccountOptions

Defined in: [helpers/broadcast.ts:65](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L65)

## Properties

### auths?

> `optional` **auths?**: `object`

Defined in: [helpers/broadcast.ts:78](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L78)

Account authorities, used to manually set account keys.
Can not be used together with the password option.

#### active

> **active**: `string` \| [`PublicKey`](../classes/PublicKey.md) \| [`AuthorityType`](AuthorityType.md)

#### memoKey

> **memoKey**: `string` \| [`PublicKey`](../classes/PublicKey.md)

#### owner

> **owner**: `string` \| [`PublicKey`](../classes/PublicKey.md) \| [`AuthorityType`](AuthorityType.md)

#### posting

> **posting**: `string` \| [`PublicKey`](../classes/PublicKey.md) \| [`AuthorityType`](AuthorityType.md)

***

### creator

> **creator**: `string`

Defined in: [helpers/broadcast.ts:88](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L88)

Creator account, fee will be deducted from this and the key to sign
the transaction must be the creators active key.

***

### delegation?

> `optional` **delegation?**: `string` \| `number` \| [`Asset`](../classes/Asset.md)

Defined in: [helpers/broadcast.ts:98](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L98)

Account delegation, amount of VESTS to delegate to the new account.
If omitted the delegation amount will be the lowest possible based
on the fee. Can be set to zero to disable delegation.

***

### fee?

> `optional` **fee?**: `string` \| `number` \| [`Asset`](../classes/Asset.md)

Defined in: [helpers/broadcast.ts:92](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L92)

Account creation fee. If omitted fee will be set to lowest possible.

***

### metadata?

> `optional` **metadata?**: `object`

Defined in: [helpers/broadcast.ts:102](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L102)

Optional account meta-data.

#### Index Signature

\[`key`: `string`\]: `any`

***

### password?

> `optional` **password?**: `string`

Defined in: [helpers/broadcast.ts:73](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L73)

Password for the new account, if set, all keys will be derived from this.

***

### username

> **username**: `string`

Defined in: [helpers/broadcast.ts:69](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/helpers/broadcast.ts#L69)

Username for the new account.
