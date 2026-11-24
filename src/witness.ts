/**
 * @file witness_set_properties builder.
 *
 * Moved here from utils.ts: it needs the binary serializer (and therefore
 * secp256k1 for public keys), so it belongs to the crypto side of the
 * library. `utils.buildWitnessUpdateOp` forwards to it.
 */

import ByteBuffer from './bytebuffer'
import type { Asset, PriceType } from './chain/asset'
import type { WitnessSetPropertiesOperation } from './chain/operation'
import { Serializer, Types } from './chain/serializer'
import type { PublicKey } from './crypto'

// Hack to be able to generate a valid witness_set_properties op
// Can hopefully be removed when pixad's JSON representation is fixed
export interface WitnessProps {
  account_creation_fee?: string | Asset
  account_subsidy_budget?: number // uint32_t
  account_subsidy_decay?: number // uint32_t
  key: PublicKey | string
  maximum_block_size?: number // uint32_t
  new_signing_key?: PublicKey | string | null
  /** PXS price feed: PXS per PIXA. Written as the node's `hbd_exchange_rate` property. */
  pxs_exchange_rate?: PriceType
  /** Fixed at 0 on Pixa. Written as the node's `hbd_interest_rate` property. */
  pxs_interest_rate?: number // uint16_t
  /** Same as `pxs_exchange_rate`, under the node's name. */
  hbd_exchange_rate?: PriceType
  /** Same as `pxs_interest_rate`, under the node's name. */
  hbd_interest_rate?: number // uint16_t
  url?: string
}

/**
 * Property names the node reads (hive_evaluator.cpp looks props up by these names and skips any
 * other): dpixa's PXS names are written under them, or the node would ignore the value.
 */
const NODE_PROP_NAMES: { [name: string]: string } = {
  pxs_exchange_rate: 'hbd_exchange_rate',
  pxs_interest_rate: 'hbd_interest_rate'
}

/** Byte order of the property names, the order of the node's flat_map. */
const byteOrder = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0)

const serialize = (serializer: Serializer, data: any) => {
  const buffer = new ByteBuffer(
    ByteBuffer.DEFAULT_CAPACITY,
    ByteBuffer.LITTLE_ENDIAN
  )
  serializer(buffer, data)
  buffer.flip()
  // `props` values must be hex
  return buffer.toString('hex')
}

export const buildWitnessUpdateOp = (
  owner: string,
  props: WitnessProps
): WitnessSetPropertiesOperation => {
  const data: WitnessSetPropertiesOperation[1] = {
    extensions: [],
    owner,
    props: []
  }
  const written = new Set<string>()
  for (const key of Object.keys(props)) {
    if (props[key] === undefined) {
      continue
    }
    let type: Serializer
    switch (key) {
      case 'key':
      case 'new_signing_key':
        type = Types.PublicKey
        break
      case 'account_subsidy_budget':
      case 'account_subsidy_decay':
      case 'maximum_block_size':
        type = Types.UInt32
        break
      case 'pxs_interest_rate':
      case 'hbd_interest_rate':
        type = Types.UInt16
        break
      case 'url':
        type = Types.String
        break
      case 'pxs_exchange_rate':
      case 'hbd_exchange_rate':
        type = Types.Price
        break
      case 'account_creation_fee':
        type = Types.Asset
        break
      default:
        throw new Error(`Unknown witness prop: ${key}`)
    }
    const name = NODE_PROP_NAMES[key] || key
    if (written.has(name)) {
      throw new Error(`Witness prop given twice: ${name}`)
    }
    written.add(name)
    data.props.push([name, serialize(type, props[key])])
  }
  data.props.sort((a, b) => byteOrder(a[0], b[0]))
  return ['witness_set_properties', data]
}
