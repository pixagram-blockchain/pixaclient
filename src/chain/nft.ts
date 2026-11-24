/**
 * @file Native NFTs of the Pixa chain (hardfork 32): ids, limits and amounts.
 * @author Matias Affolter
 * @license
 * Copyright (c) 2026 Matias Affolter. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *  1. Redistribution of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *
 *  2. Redistribution in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *
 *  3. Neither the name of the copyright holder nor the names of its contributors
 *     may be used to endorse or promote products derived from this software without
 *     specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * You acknowledge that this software is not designed, licensed or intended for use
 * in the design, construction, operation or maintenance of any military facility.
 */

import { Asset } from './asset'
import type { NftAction, NftActionInput, NftBuy, NftList, NftMint, NftTransfer, NftUnlist } from './operation'

/*
 * An NFT is a root post its author minted, in 1 to 10,000 copies numbered from 1. It is written
 * "@author/permlink/0"; copy N is "@author/permlink/N". The copies that never left the author and
 * have no offer of their own are the author's reserve: edition 0 stands for it in nft_list,
 * nft_unlist and nft_buy, so the author offers every such copy at one price in one action and each
 * buyer gets the lowest-numbered copy still in it. Prices, royalties and the mint fee are in PXS.
 */

/** Most copies an NFT can have (`PIXA_NFT_EDITIONS_LIMIT`). */
export const NFT_MAX_EDITIONS = 10000

/** Highest royalty, in basis points: 2500 is 25% (`PIXA_NFT_MAX_ROYALTY`). */
export const NFT_MAX_ROYALTY = 2500

/** Longest license text, in UTF-8 bytes: 72 KiB (`PIXA_NFT_MAX_LICENSE_LENGTH`). */
export const NFT_MAX_LICENSE_BYTES = 72 * 1024

/** Mint fee per copy, burned (`PIXA_NFT_MINT_FEE_PER_EDITION`). */
export const NFT_MINT_FEE_PER_EDITION = '1.000 PXS'

/** The edition number that stands for the author's reserve in nft_list, nft_unlist and nft_buy. */
export const NFT_RESERVE = 0

/**
 * Expiration of an offer that never expires (`time_point_sec::maximum()`), as the node writes it
 * in what it returns. To make such an offer, leave `expiration` out: the node cannot read this
 * time back from JSON (see {@link NFT_LATEST_EXPIRATION}), and dpixa does not send it.
 */
export const NFT_NEVER_EXPIRES = '2106-02-07T06:28:15'

/**
 * Latest expiration an offer can be given: the node reads JSON times up to 2^31 - 1 seconds after
 * 1970 and refuses later ones ("Datetime overflow"), the never-expiring value included.
 */
export const NFT_LATEST_EXPIRATION = '2038-01-19T03:14:07'

/** The account a copy is given to in order to burn it. */
export const NFT_BURN_ACCOUNT = 'null'

/** Most ids per `database_api.find_nfts` or `pixamind_nft.get_nfts` call. */
export const NFT_FIND_LIMIT = 100

/** Binary tag of each nft_operation action, its position in the node's `nft_action` variant. */
export const NFT_ACTION_TAGS = {
  nft_mint: 0,
  nft_list: 1,
  nft_unlist: 2,
  nft_buy: 3,
  nft_transfer: 4
} as const

/** Name of an nft_operation action. */
export type NftActionName = keyof typeof NFT_ACTION_TAGS

const NFT_ACTION_NAMES: NftActionName[] = ['nft_mint', 'nft_list', 'nft_unlist', 'nft_buy', 'nft_transfer']

/** What an NFT id names: copy `edition` of the NFT (author, permlink), or the NFT itself for 0. */
export interface NftIdParts {
  author: string
  permlink: string
  /** 0 for the NFT (or its reserve, in list, unlist and buy), 1 to 10,000 for a copy. */
  edition: number
}

/**
 * Read an NFT id, "@author/permlink/N", with the node's rules: the author runs to the first '/'
 * and N follows the last one, so a permlink that holds a '/' still reads correctly; N is written
 * without leading zeros and is at most 10,000. Throws on anything else.
 */
export const parseNftId = (id: string): NftIdParts => {
  const first = typeof id === 'string' ? id.indexOf('/') : -1
  const last = typeof id === 'string' ? id.lastIndexOf('/') : -1
  const wellFormed = typeof id === 'string' && id.length >= 2 && id[0] === '@'
    && first >= 0 && last > first + 1 && last + 1 < id.length
  if (!wellFormed) {
    throw new Error(`An NFT id is written @author/permlink/N, got '${String(id)}'`)
  }
  const author = id.slice(1, first)
  if (!/^[a-z][a-z0-9.-]{2,15}$/.test(author)) {
    throw new Error(`Invalid author in NFT id '${id}'`)
  }
  const number = id.slice(last + 1)
  if (!/^(0|[1-9][0-9]{0,4})$/.test(number) || Number(number) > NFT_MAX_EDITIONS) {
    throw new Error(`Invalid copy number in NFT id '${id}'`)
  }
  return { author, permlink: id.slice(first + 1, last), edition: Number(number) }
}

/** Whether `id` is a well-formed NFT id ("@author/permlink/N"). */
export const isNftId = (id: string): boolean => {
  try {
    parseNftId(id)
    return true
  } catch (_error) {
    return false
  }
}

/**
 * Write an NFT id: "@author/permlink/0" for the NFT (the default), "@author/permlink/N" for copy N.
 */
export const formatNftId = (author: string, permlink: string, edition = 0): string => {
  if (!Number.isInteger(edition) || edition < 0 || edition > NFT_MAX_EDITIONS) {
    throw new Error(`NFT edition must be an integer from 0 to ${NFT_MAX_EDITIONS}, got ${edition}`)
  }
  return `@${author}/${permlink}/${edition}`
}

/** Number of bytes of `text` in UTF-8, the unit of the license limit. */
export const utf8ByteLength = (text: string): number => {
  let bytes = 0
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    if (code < 0x80) {
      bytes += 1
    } else if (code < 0x800) {
      bytes += 2
    } else if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
      // a surrogate pair is one code point of four bytes
      bytes += 4
      i++
    } else {
      bytes += 3
    }
  }
  return bytes
}

/** Thousandths of a 3-decimal asset, exactly. */
const milli = (asset: Asset): bigint => {
  const [whole, fraction = ''] = asset.amount.toFixed(3).split('.')
  const negative = whole.startsWith('-')
  const value = BigInt(whole.replace('-', '')) * 1000n + BigInt(fraction.padEnd(3, '0').slice(0, 3))
  return negative ? -value : value
}

/** A 3-decimal asset from thousandths. */
const fromMilli = (value: bigint, symbol: Asset['symbol']): Asset => {
  const negative = value < 0n
  const magnitude = negative ? -value : value
  const text = `${negative ? '-' : ''}${magnitude / 1000n}.${(magnitude % 1000n).toString().padStart(3, '0')}`
  return Asset.fromString(`${text} ${symbol}`)
}

/**
 * The mint fee nft_mint has to carry: `editions` times 1.000 PXS, which the chain burns.
 * @param perEdition The fee per copy; `database_api.get_nft_params` returns the one in force.
 */
export const nftMintFee = (editions: number, perEdition: Asset | string = NFT_MINT_FEE_PER_EDITION): Asset => {
  if (!Number.isInteger(editions) || editions < 1 || editions > NFT_MAX_EDITIONS) {
    throw new Error(`An NFT has 1 to ${NFT_MAX_EDITIONS} copies, got ${editions}`)
  }
  const fee = Asset.from(perEdition)
  return fromMilli(milli(fee) * BigInt(editions), fee.symbol)
}

/**
 * What the creator receives from a sale: `price * royalty / 10000`, rounded down to 0.001, as the
 * node computes it. A sale by the creator pays no royalty; use {@link nftSaleSplit} for that case.
 * @param royalty Basis points (1000 is 10%).
 */
export const nftRoyalty = (price: Asset | string, royalty: number): Asset => {
  if (!Number.isInteger(royalty) || royalty < 0 || royalty > 10000) {
    throw new Error(`An NFT royalty is in basis points, 0 to 10000, got ${royalty}`)
  }
  const amount = Asset.from(price)
  return fromMilli((milli(amount) * BigInt(royalty)) / 10000n, amount.symbol)
}

/**
 * How a sale price is shared: the creator gets the royalty unless the seller is the creator
 * (a first sale, or a copy the creator got back), and the seller gets the rest.
 */
export const nftSaleSplit = (
  price: Asset | string,
  royalty: number,
  sellerIsCreator = false
): { royalty: Asset, seller: Asset } => {
  const amount = Asset.from(price)
  const toCreator = sellerIsCreator ? fromMilli(0n, amount.symbol) : nftRoyalty(amount, royalty)
  return { royalty: toCreator, seller: fromMilli(milli(amount) - milli(toCreator), amount.symbol) }
}

/**
 * Check an nft_mint the way the node will (format and consensus limits), so a user is told before
 * signing. Returns the list of problems, empty when the mint would be accepted on these points;
 * the chain also checks that the post is a root post of the minter, not minted before, and that the
 * minter holds the fee in liquid PXS.
 */
export const checkNftMint = (mint: Partial<NftMint>): string[] => {
  const problems: string[] = []
  if (typeof mint.permlink !== 'string' || mint.permlink.length === 0) {
    problems.push('permlink: the permlink of a root post of the minter is required')
  }
  const editions = Number(mint.editions)
  if (!Number.isInteger(editions) || editions < 1 || editions > NFT_MAX_EDITIONS) {
    problems.push(`editions: 1 to ${NFT_MAX_EDITIONS} copies`)
  }
  const royalty = Number(mint.royalty)
  if (!Number.isInteger(royalty) || royalty < 0 || royalty > NFT_MAX_ROYALTY) {
    problems.push(`royalty: 0 to ${NFT_MAX_ROYALTY} basis points (25%)`)
  }
  if (typeof mint.license !== 'string') {
    problems.push('license: the full text of the license terms is required')
  } else if (utf8ByteLength(mint.license) > NFT_MAX_LICENSE_BYTES) {
    problems.push(`license: at most ${NFT_MAX_LICENSE_BYTES} bytes of UTF-8 (72 KiB)`)
  }
  if (mint.fee === undefined) {
    problems.push('fee: editions x 1.000 PXS')
  } else {
    let fee: Asset | undefined
    try {
      fee = Asset.from(mint.fee)
    } catch (_error) {
      problems.push('fee: not an asset')
    }
    if (fee && fee.symbol !== 'PXS' && fee.symbol !== 'TBD') {
      problems.push('fee: the mint fee is paid in PXS')
    } else if (fee && Number.isInteger(editions) && editions >= 1 && editions <= NFT_MAX_EDITIONS
      && milli(fee) !== milli(nftMintFee(editions))) {
      problems.push(`fee: exactly ${nftMintFee(editions, Asset.from(1, fee.symbol)).toString()} for ${editions} copies`)
    }
  }
  return problems
}

/** Tag and payload of an action, whatever form it was given in. */
export const toNftAction = (action: NftActionInput): NftAction => {
  let tag: number
  let payload: any
  if (Array.isArray(action)) {
    const [kind, value] = action as [number | string, any]
    tag = typeof kind === 'number' ? kind : (NFT_ACTION_TAGS as any)[kind]
    payload = value
  } else if (action && typeof action === 'object' && 'type' in action) {
    const { type, value } = action as { type: string, value: any }
    tag = (NFT_ACTION_TAGS as any)[String(type).replace(/_operation$/, '')]
    payload = value
  } else {
    throw new Error('An NFT action is [tag, payload], [name, payload] or {type, value}')
  }
  if (!Number.isInteger(tag) || tag < 0 || tag >= NFT_ACTION_NAMES.length) {
    throw new Error(`Unknown NFT action: ${JSON.stringify(Array.isArray(action) ? action[0] : (action as any).type)}`)
  }
  if (!payload || typeof payload !== 'object') {
    throw new Error(`${NFT_ACTION_NAMES[tag]}: the action has no payload`)
  }
  return [tag, payload] as NftAction
}

/** Name of the action with this tag ("nft_mint" for 0, …). */
export const nftActionName = (tag: number): NftActionName => {
  const name = NFT_ACTION_NAMES[tag]
  if (name === undefined) {
    throw new Error(`Unknown NFT action tag: ${tag}`)
  }
  return name
}

/** Payload types by action, for helpers that build actions. */
export interface NftActionPayloads {
  nft_mint: NftMint
  nft_list: NftList
  nft_unlist: NftUnlist
  nft_buy: NftBuy
  nft_transfer: NftTransfer
}
