[**@pixagram/dpixa**](../../../../README.md)

***

[@pixagram/dpixa](../../../../globals.md) / [utils](../README.md) / WitnessProps

# Interface: WitnessProps

Defined in: [witness.ts:17](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/witness.ts#L17)

## Properties

### account\_creation\_fee?

> `optional` **account\_creation\_fee?**: `string` \| [`Asset`](../../../../classes/Asset.md)

Defined in: [witness.ts:18](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/witness.ts#L18)

***

### account\_subsidy\_budget?

> `optional` **account\_subsidy\_budget?**: `number`

Defined in: [witness.ts:19](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/witness.ts#L19)

***

### account\_subsidy\_decay?

> `optional` **account\_subsidy\_decay?**: `number`

Defined in: [witness.ts:20](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/witness.ts#L20)

***

### hbd\_exchange\_rate?

> `optional` **hbd\_exchange\_rate?**: [`PriceType`](../../../../type-aliases/PriceType.md)

Defined in: [witness.ts:29](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/witness.ts#L29)

Same as `pxs_exchange_rate`, under the node's name.

***

### hbd\_interest\_rate?

> `optional` **hbd\_interest\_rate?**: `number`

Defined in: [witness.ts:31](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/witness.ts#L31)

Same as `pxs_interest_rate`, under the node's name.

***

### key

> **key**: `string` \| [`PublicKey`](../../../../classes/PublicKey.md)

Defined in: [witness.ts:21](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/witness.ts#L21)

***

### maximum\_block\_size?

> `optional` **maximum\_block\_size?**: `number`

Defined in: [witness.ts:22](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/witness.ts#L22)

***

### new\_signing\_key?

> `optional` **new\_signing\_key?**: `string` \| [`PublicKey`](../../../../classes/PublicKey.md) \| `null`

Defined in: [witness.ts:23](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/witness.ts#L23)

***

### pxs\_exchange\_rate?

> `optional` **pxs\_exchange\_rate?**: [`PriceType`](../../../../type-aliases/PriceType.md)

Defined in: [witness.ts:25](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/witness.ts#L25)

PXS price feed: PXS per PIXA. Written as the node's `hbd_exchange_rate` property.

***

### pxs\_interest\_rate?

> `optional` **pxs\_interest\_rate?**: `number`

Defined in: [witness.ts:27](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/witness.ts#L27)

Fixed at 0 on Pixa. Written as the node's `hbd_interest_rate` property.

***

### url?

> `optional` **url?**: `string`

Defined in: [witness.ts:32](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/witness.ts#L32)
