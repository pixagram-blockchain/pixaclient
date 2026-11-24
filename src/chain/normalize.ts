/**
 * @file Puts operations in the form the node reads before they are signed and sent.
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
import { NFT_LATEST_EXPIRATION, NFT_NEVER_EXPIRES, toNftAction } from './nft'
import type { Operation } from './operation'
import type { Transaction } from './transaction'

/*
 * A signature covers the binary form of a transaction, which the node rebuilds from the JSON it
 * receives. Both have to say the same thing, or the node computes another digest and rejects the
 * signature as a missing authority. Three things can make them differ:
 *
 *  - Field names. The node reads Hive's names for a few fields (percent_hbd, reward_hive, ...)
 *    and skips names it does not know, leaving its default in their place. dpixa has always
 *    accepted the Pixa names (percent_pxs, reward_pixa, ...). normalizeOperation writes such a
 *    value under both names, so whichever names the API node reads, it reads what was signed.
 *  - The NFT action. condenser_api reads it as [tag, payload] (or [name, payload]); the
 *    {type, value} form that database_api writes is refused there. It is rewritten as
 *    [tag, payload], with `extensions: []`.
 *  - Times. The node parses JSON times only up to 2038-01-19T03:14:07, its own "never" of
 *    2106-02-07T06:28:15 included. An offer that never expires is sent without expiration (the
 *    node's default is that maximum, so the binary is the same); a later expiration is refused.
 *
 * Normalizing never changes the binary form, and so never changes a digest or a transaction id.
 */

/** [node name, Pixa name] of the fields both names are written for, by operation. */
const FIELD_ALIASES: { [operation: string]: [string, string][] } = {
  claim_reward_balance: [['reward_hive', 'reward_pixa'], ['reward_hbd', 'reward_pxs']],
  comment_options: [['percent_hbd', 'percent_pxs']],
  escrow_release: [['hbd_amount', 'pxs_amount'], ['hive_amount', 'pixa_amount']],
  escrow_transfer: [['hbd_amount', 'pxs_amount'], ['hive_amount', 'pixa_amount']]
}

/** Same, for the chain properties of witness_update. */
const CHAIN_PROPERTY_ALIASES: [string, string][] = [['hbd_interest_rate', 'pxs_interest_rate']]

/** Text form of a value, to tell whether two names hold the same one. */
const sameValue = (a: any, b: any): boolean => {
  if (a instanceof Asset || b instanceof Asset || (typeof a === 'string' && typeof b === 'string')) {
    try {
      const x = Asset.from(a)
      const y = Asset.from(b)
      return x.toString() === y.toString()
    } catch (_error) {
      return String(a) === String(b)
    }
  }
  return String(a) === String(b)
}

/**
 * Copy of `data` in which each value given under one of its two names is under both.
 * Throws when the two names hold different values.
 */
const withBothNames = (operation: string, data: { [key: string]: any }, aliases: [string, string][]) => {
  let result = data
  for (const [nodeName, pixaName] of aliases) {
    const nodeValue = result[nodeName]
    const pixaValue = result[pixaName]
    if (nodeValue === undefined && pixaValue === undefined) {
      continue
    }
    if (nodeValue !== undefined && pixaValue !== undefined) {
      if (!sameValue(nodeValue, pixaValue)) {
        throw new Error(`${operation}: ${nodeName} and ${pixaName} are the same field and hold different values`)
      }
      continue
    }
    if (result === data) {
      result = { ...data }
    }
    if (nodeValue === undefined) {
      result[nodeName] = pixaValue
    } else {
      result[pixaName] = nodeValue
    }
  }
  return result
}

/** Seconds since 1970 of a time written like the node's, e.g. 2027-02-01T00:00:00. */
const seconds = (time: string) => Date.parse(time.endsWith('Z') ? time : time + 'Z') / 1000

/**
 * The nft operation with its action as [tag, payload] and `extensions` written out. An offer that
 * never expires is sent without `expiration`, which the node then sets to its maximum: the node
 * refuses any JSON time after 2038-01-19T03:14:07, its own maximum included, so an offer with a
 * later expiration could never be broadcast and is refused here.
 */
const normalizeNft = (data: { [key: string]: any }) => {
  const [tag, payload] = toNftAction(data.action)
  const action: { [key: string]: any } = { ...payload }
  if (action.extensions === undefined) {
    action.extensions = []
  }
  if (tag === 1 && action.expiration !== undefined) {
    const time = typeof action.expiration === 'string' ? seconds(action.expiration) : NaN
    if (time === seconds(NFT_NEVER_EXPIRES)) {
      delete action.expiration
    } else if (time > seconds(NFT_LATEST_EXPIRATION)) {
      throw new Error(`nft_list.expiration: the node reads times up to ${NFT_LATEST_EXPIRATION}; `
        + 'leave expiration out for an offer that never expires')
    }
  }
  return {
    ...data,
    action: [tag, action],
    extensions: data.extensions === undefined ? [] : data.extensions
  }
}

/**
 * The operation in the form the node reads: see the notes at the top of this file. Returns the
 * operation itself when nothing changes, a copy otherwise.
 */
export const normalizeOperation = (operation: Operation): Operation => {
  if (!Array.isArray(operation) || !operation[1] || typeof operation[1] !== 'object') {
    return operation
  }
  const [name, data] = operation
  let result = data
  if (name === 'nft') {
    result = normalizeNft(data)
  } else if (FIELD_ALIASES[name]) {
    result = withBothNames(name, data, FIELD_ALIASES[name])
  } else if (name === 'witness_update' && data.props && typeof data.props === 'object') {
    const props = withBothNames('witness_update.props', data.props, CHAIN_PROPERTY_ALIASES)
    if (props !== data.props) {
      result = { ...data, props }
    }
  }
  return result === data ? operation : ([name, result] as Operation)
}

/** The transaction with every operation in the form the node reads (a copy when one changes). */
export const normalizeTransaction = <T extends Transaction>(transaction: T): T => {
  if (!transaction || !Array.isArray(transaction.operations)) {
    return transaction
  }
  let changed = false
  const operations = transaction.operations.map(operation => {
    const normalized = normalizeOperation(operation)
    changed = changed || normalized !== operation
    return normalized
  })
  return changed ? { ...transaction, operations } : transaction
}
