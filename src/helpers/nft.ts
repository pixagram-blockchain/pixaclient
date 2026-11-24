/**
 * @file Native NFTs (hardfork 32): chain queries and the actions of nft_operation.
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

import { Asset, SMTAsset, symbolOfNai } from '../chain/asset'
import {
  checkNftMint,
  formatNftId,
  NFT_BURN_ACCOUNT,
  NFT_FIND_LIMIT,
  NFT_RESERVE,
  NftIdParts,
  nftMintFee,
  parseNftId
} from '../chain/nft'
import { NftActionInput, NftMint } from '../chain/operation'
import { TransactionConfirmation } from '../chain/transaction'
import type { Client } from '../client'
import type { PrivateKey } from '../crypto'

/** The limits and mint fee nft_operation is checked against at head block (`get_nft_params`). */
export interface NftParams {
  /** Mint fee per copy: 1.000 PXS. nft_mint carries it times its number of copies. */
  mint_fee_per_edition: Asset
  /** Copies per NFT: 10,000. */
  max_editions: number
  /** Royalty ceiling in basis points: 2500 (25%). */
  max_royalty: number
  /** Bytes of license text: 73,728 (72 KiB). */
  max_license_length: number
  /** Assets an offer can be made in: `['PXS']`. */
  price_symbols: string[]
}

/** An NFT as the chain keeps it (`database_api.find_nfts`, `list_nfts`). */
export interface ChainNft {
  id: number
  /** `@author/permlink/0` */
  nft_id: string
  /** Creator of the NFT, author of the minted post. */
  author: string
  permlink: string
  mint_time: string
  /** Number of copies, numbered from 1. */
  editions: number
  /** Basis points of a sale price paid to the author. */
  royalty: number
  /** Bytes of the license text, which the mint operation carries. */
  license_size: number
  /** SHA-256 of the license text. */
  license_sha256: string
  /** Copies still with the author since the mint, without an offer of their own. */
  reserve: number
  /** The copy a buyer of copy 0 gets now; 0 when the reserve is empty. */
  reserve_next: number
  /** True when copy 0 can be bought at head block time. */
  reserve_listed: boolean
  /** The author's price for one copy of the reserve; meaningful only when `reserve_listed`. */
  reserve_price: Asset
  /** The reserve offer ends at this time; meaningful only when `reserve_listed`. */
  reserve_expiration: string
}

/** One copy as the chain sees it (`find_nfts`, `list_nft_editions`). */
export interface ChainNftEdition {
  /** `@author/permlink/N` */
  nft_id: string
  /** Id of the NFT object. */
  nft: number
  author: string
  permlink: string
  edition: number
  /** `null` once the copy is burned. */
  owner: string
  burned: boolean
  /** When the owner got the copy. */
  acquired: string
  /** True when it can be bought at head block time. */
  listed: boolean
  /** Asking price; meaningful only when `listed`. */
  price: Asset
  /** The offer ends at this time; meaningful only when `listed`. */
  expiration: string
}

/** A copy, by id (`{ nft: '@alice/art/3' }`) or by its parts. */
export type NftRef = { nft: string } | { author: string, permlink: string, edition: number }

/** A post, as `[author, permlink]` or `{ author, permlink }`. */
export type PostRef = [string, string] | { author: string, permlink: string }

const toAsset = (value: SMTAsset | string | Asset): Asset => Asset.from(value)

const toNft = (raw: any): ChainNft => ({ ...raw, reserve_price: toAsset(raw.reserve_price) })

const toEdition = (raw: any): ChainNftEdition => ({ ...raw, price: toAsset(raw.price) })

const resolve = (ref: NftRef): NftIdParts => {
  if ('nft' in ref) {
    return parseNftId(ref.nft)
  }
  return { author: ref.author, permlink: ref.permlink, edition: ref.edition }
}

/**
 * Native NFTs, read from the chain (`database_api`) and acted on with `nft_operation`.
 *
 * Every action is signed with the active key of `account`, its actor. The market summary of an NFT
 * page, its history and the lists by creator, owner and price come from Pixamind
 * ({@link PixamindAPI.getNfts} and the other `…Nft…` methods); this helper is what the chain holds
 * at head block, which is what a purchase is checked against.
 */
export class NftAPI {
  constructor(readonly client: Client) {}

  /** Convenience for calling `database_api`. */
  public call(method: string, params: any = {}) {
    return this.client.call('database_api', method, params)
  }

  // ---------------------------------------------------------------- reads

  /** The limits and mint fee nft_operation is checked against at head block. */
  public async getParams(): Promise<NftParams> {
    const raw = await this.call('get_nft_params', {})
    return {
      max_editions: raw.max_editions,
      max_license_length: raw.max_license_length,
      max_royalty: raw.max_royalty,
      mint_fee_per_edition: toAsset(raw.mint_fee_per_edition),
      price_symbols: (raw.price_symbols || []).map((symbol: any) =>
        typeof symbol === 'string' ? symbol : symbolOfNai(symbol && symbol.nai) || String(symbol && symbol.nai))
    }
  }

  /**
   * Up to 100 NFTs or copies by id: `@author/permlink/0` for an NFT (with its reserve),
   * `@author/permlink/N` for the NFT with its copy N. Ids that name nothing are left out, so the
   * call also tells which posts are minted. Each NFT and each copy is answered once, in the order
   * first asked; a copy that was never offered nor moved is answered as its creator's.
   */
  public async find(ids: string[]): Promise<{ nfts: ChainNft[], editions: ChainNftEdition[] }> {
    if (ids.length > NFT_FIND_LIMIT) {
      throw new Error(`At most ${NFT_FIND_LIMIT} NFT ids per call`)
    }
    const raw = await this.call('find_nfts', { nfts: ids })
    return { editions: (raw.editions || []).map(toEdition), nfts: (raw.nfts || []).map(toNft) }
  }

  /** The NFT of a post, or undefined when the post is not minted. */
  public async getNft(author: string, permlink: string): Promise<ChainNft | undefined> {
    const { nfts } = await this.find([formatNftId(author, permlink, 0)])
    return nfts[0]
  }

  /** One copy (`@author/permlink/N`, N >= 1), or undefined when there is no such copy. */
  public async getEdition(id: string): Promise<ChainNftEdition | undefined> {
    const { edition } = parseNftId(id)
    if (edition === NFT_RESERVE) {
      throw new Error(`${id} names an NFT; a copy is @author/permlink/N with N from 1`)
    }
    const { editions } = await this.find([id])
    return editions[0]
  }

  /** Whether each post is minted, in the order given (100 posts per request). */
  public async areMinted(posts: PostRef[]): Promise<boolean[]> {
    const ids = posts.map(post =>
      (Array.isArray(post) ? formatNftId(post[0], post[1]) : formatNftId(post.author, post.permlink)))
    const minted = new Set<string>()
    for (let i = 0; i < ids.length; i += NFT_FIND_LIMIT) {
      const { nfts } = await this.find(ids.slice(i, i + NFT_FIND_LIMIT))
      for (const nft of nfts) {
        minted.add(nft.nft_id)
      }
    }
    return ids.map(id => minted.has(id))
  }

  /**
   * NFTs a creator minted, in permlink order.
   * @param options `after`: the permlink to continue after (the last of the previous page);
   *                `limit`: 1 to 1000, default 100.
   */
  public async listByCreator(creator: string, options: { after?: string, limit?: number } = {}): Promise<ChainNft[]> {
    const limit = options.limit || 100
    const after = options.after
    const raw = await this.call('list_nfts', {
      limit: after === undefined ? limit : Math.min(limit + 1, 1000),
      order: 'by_creator',
      start: [creator, after === undefined ? '' : after]
    })
    return (raw.nfts || [])
      .filter((nft: any) => nft.author === creator && nft.permlink !== after)
      .slice(0, limit)
      .map(toNft)
  }

  /**
   * The copies of one NFT in number order, each copy once whether or not it ever moved.
   * @param nft The NFT, `@author/permlink/0` (or any copy id).
   * @param options `from`: first copy, default 1; `limit`: 1 to 1000, default 100.
   */
  public async listEditions(nft: string, options: { from?: number, limit?: number } = {}): Promise<ChainNftEdition[]> {
    const { author, permlink } = parseNftId(nft)
    const raw = await this.call('list_nft_editions', {
      limit: options.limit || 100,
      order: 'by_permlink',
      start: formatNftId(author, permlink, Math.max(options.from || 1, 1))
    })
    return (raw.editions || []).map(toEdition)
  }

  /**
   * Copies an account owns that were offered or moved at least once. A creator's reserve is not
   * listed: it is `reserve` on each NFT ({@link listByCreator}); Pixamind's
   * {@link PixamindAPI.listOwnedNfts} counts both.
   * @param options `after`: the copy id to continue after (the last of the previous page);
   *                `limit`: 1 to 1000, default 100.
   */
  public async listByOwner(
    owner: string,
    options: { after?: string, limit?: number } = {}
  ): Promise<ChainNftEdition[]> {
    const limit = options.limit || 100
    const after = options.after
    const raw = await this.call('list_nft_editions', {
      limit: after === undefined ? limit : Math.min(limit + 1, 1000),
      order: 'by_account',
      start: [owner, after === undefined ? '' : after]
    })
    return (raw.editions || [])
      .filter((copy: any) => copy.owner === owner && copy.nft_id !== after)
      .slice(0, limit)
      .map(toEdition)
  }

  // -------------------------------------------------------------- actions

  /**
   * Mint a root post of `account` in 1 to 10,000 copies. `fee` defaults to the copies times the
   * fee per copy in force (1.000 PXS); it is burned. Royalty and license can never change, and the
   * post can no longer be edited or deleted. Throws before signing when {@link checkNftMint} finds
   * a problem.
   */
  public async mint(
    data: { account: string } & Omit<NftMint, 'fee'> & { fee?: Asset | string },
    key: PrivateKey | PrivateKey[]
  ): Promise<TransactionConfirmation> {
    const { account, ...action } = data
    let fee = action.fee
    if (fee === undefined) {
      fee = nftMintFee(Number(action.editions), (await this.getParams()).mint_fee_per_edition)
    }
    const mint: NftMint = { ...action, fee }
    const problems = checkNftMint(mint)
    if (problems.length > 0) {
      throw new Error(`nft_mint: ${problems.join('; ')}`)
    }
    return this.send(account, [0, mint], key)
  }

  /**
   * Offer a copy at a fixed price in PXS, or change its offer. The copy stays with its owner until
   * someone buys it. `expiration` left out: the offer never expires; otherwise at most
   * 2038-01-19T03:14:07, the latest time the node reads.
   */
  public async list(
    data: { account: string, price: Asset | string, expiration?: string } & NftRef,
    key: PrivateKey | PrivateKey[]
  ): Promise<TransactionConfirmation> {
    const { author, permlink, edition } = resolve(data)
    const action: any = { author, edition, permlink, price: data.price }
    if (data.expiration !== undefined) {
      action.expiration = data.expiration
    }
    return this.send(data.account, [1, action], key)
  }

  /** Withdraw the offer of a copy. A copy that never left its author goes back to the reserve. */
  public async unlist(
    data: { account: string } & NftRef,
    key: PrivateKey | PrivateKey[]
  ): Promise<TransactionConfirmation> {
    const { author, permlink, edition } = resolve(data)
    return this.send(data.account, [2, { author, edition, permlink }], key)
  }

  /**
   * Buy a copy (or, with edition 0, the next copy of the reserve). The price has to equal the
   * asking price; left out, it is read from the chain first, and the purchase fails if the offer
   * changes before the transaction is included.
   */
  public async buy(
    data: { account: string, price?: Asset | string } & NftRef,
    key: PrivateKey | PrivateKey[]
  ): Promise<TransactionConfirmation> {
    const { author, permlink, edition } = resolve(data)
    const price = data.price !== undefined ? data.price : await this.askingPrice(author, permlink, edition)
    return this.send(data.account, [3, { author, edition, permlink, price }], key)
  }

  /** Give a copy to another account: no payment, so no royalty. Ends any offer of the copy. */
  public async transfer(
    data: { account: string, to: string } & NftRef,
    key: PrivateKey | PrivateKey[]
  ): Promise<TransactionConfirmation> {
    const { author, permlink, edition } = resolve(data)
    return this.send(data.account, [4, { author, edition, permlink, to: data.to }], key)
  }

  /** Burn a copy: give it to `null`, for good. It keeps its number and still counts among the copies. */
  public async burn(
    data: { account: string } & NftRef,
    key: PrivateKey | PrivateKey[]
  ): Promise<TransactionConfirmation> {
    return this.transfer({ ...data, to: NFT_BURN_ACCOUNT }, key)
  }

  /**
   * Offer the reserve: every copy that never left the author and has no offer of its own, at one
   * price, in one action. Each buyer gets the lowest-numbered copy still in the reserve and the
   * author receives the whole price. The offer ends by itself when the reserve runs out.
   */
  public async offerReserve(
    data: { account: string, permlink: string, price: Asset | string, expiration?: string },
    key: PrivateKey | PrivateKey[]
  ): Promise<TransactionConfirmation> {
    return this.list({ ...data, author: data.account, edition: NFT_RESERVE }, key)
  }

  /** Withdraw the reserve offer. */
  public async withdrawReserve(
    data: { account: string, permlink: string },
    key: PrivateKey | PrivateKey[]
  ): Promise<TransactionConfirmation> {
    return this.unlist({ ...data, author: data.account, edition: NFT_RESERVE }, key)
  }

  /** Buy the next copy of an author's reserve; `price` left out is read from the chain. */
  public async buyFromReserve(
    data: { account: string, author: string, permlink: string, price?: Asset | string },
    key: PrivateKey | PrivateKey[]
  ): Promise<TransactionConfirmation> {
    return this.buy({ ...data, edition: NFT_RESERVE }, key)
  }

  /** The price a copy (or the reserve, edition 0) can be bought at now; throws when it is not for sale. */
  public async askingPrice(author: string, permlink: string, edition: number): Promise<Asset> {
    const id = formatNftId(author, permlink, edition)
    const { nfts, editions } = await this.find([id])
    if (nfts.length === 0) {
      throw new Error(`${formatNftId(author, permlink)} is not minted`)
    }
    if (edition === NFT_RESERVE) {
      if (!nfts[0].reserve_listed) {
        throw new Error(`The reserve of ${id} is not offered`)
      }
      return nfts[0].reserve_price
    }
    if (editions.length === 0) {
      throw new Error(`${id} does not exist`)
    }
    if (!editions[0].listed) {
      throw new Error(`${id} is not offered`)
    }
    return editions[0].price
  }

  private send(account: string, action: NftActionInput, key: PrivateKey | PrivateKey[]) {
    return this.client.broadcast.nft({ account, action, extensions: [] }, key)
  }
}
