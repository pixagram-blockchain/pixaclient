/**
 * Pixamind database query wrapper
 */

import { Account } from '../chain/account'
import { Discussion } from '../chain/comment'
import { formatNftId, NFT_FIND_LIMIT } from '../chain/nft'
import {
    CommunityDetail,
    ContentMetadata,
    Notifications,
    PixamindNft,
    PixamindNftEdition,
    PixamindNftEvent,
    PixamindNftLicense,
    PixamindOwnedNft,
    PixamindPage,
    PostHistory,
    Promotions
} from '../chain/pixamind'
import { Client } from '../client'

export interface PostsQuery {
    /**
     * Number of posts to fetch
     */
    limit?: number
    /**
     * Sorting posts
     */
    sort: 'trending' | 'hot' | 'created' | 'promoted' | 'payout' | 'payout_comments' | 'muted'
    /**
     * Tag, community (`portal-…`), or `my` with an observer: the communities the observer
     * subscribes to (`promoted` too)
     */
    tag?: string[] | string
    /**
     * Observer account
     */
    observer?: string
    /**
     * Paginating last post author
     */
    start_author?: string
    /**
     * Paginating last post permlink
     */
    start_permlink?: string
    /**
     * Mute reasons to leave out (bridge's muted_reasons_filter)
     */
    muted_reasons_filter?: number[]
}

/** Query of the promoted feed: the posts query without `sort`. */
export type PromotedPostsQuery = Omit<PostsQuery, 'sort'>

/** Query of `pixamind_nft.list_editions`. */
export interface NftEditionsQuery {
    /** The NFT, `@author/permlink/0` (any copy number names it). */
    nft: string
    /**
     * `number`: every copy in order, those of the reserve with `reserve: true`. `price`: what can
     * be bought now, cheapest first, the offered reserve as one entry (copy 0).
     */
    sort?: 'number' | 'price'
    /** Keep one account's copies. */
    owner?: string
    /** 1 to 100. */
    limit?: number
    /** `next_start` of the previous page. */
    start?: string
}

/** Query of `pixamind_nft.list_market`. */
export interface NftMarketQuery {
    /** `recent`: latest offers first (the default). `price`: cheapest first. */
    sort?: 'recent' | 'price'
    /** Keep one creator's NFTs. */
    creator?: string
    limit?: number
    start?: string
}

/** Query of `pixamind_nft.get_history`: one NFT (`…/0`, every copy) or copy (`…/N`), or one account. */
export type NftHistoryQuery = ({ nft: string } | { account: string }) & { limit?: number, start?: string }

/**
 * Omitting sort extended from BridgeParam
 */
export interface AccountPostsQuery extends Omit<PostsQuery, 'sort'> {
    account: string
    sort: 'posts'
}

export interface CommunityQuery {
    name: string
    observer: string
}

export interface AccountNotifsQuery {
    account: Account['name']
    limit: number
    type?: 'new_community' | 'pin_post'
}

export interface ListCommunitiesQuery {
    /**
     * Paginating last
     */
    last?: string
    /**
     * Number of communities to fetch
     */
    limit: number
    /**
     * To be developed, not ready yet. Currently always a string; typed as
     * `any` to allow richer query objects in future without a breaking change.
     */
    query?: any
    /**
     * Observer account
     */
    observer?: Account['name']
}

export class PixamindAPI {
    constructor(readonly client: Client) { }

    /**
     * Convenience of calling pixamind api
     * @param method
     * @param params
     */
    public call(method: string, params?: any) {
        return this.client.call('bridge', method, params)
    }

    /**
     * Get trending, hot, recent community posts from Pixamind
     * @param options
     */
    public getRankedPosts(options: PostsQuery): Promise<Discussion[]> {
        return this.call('get_ranked_posts', options)
    }

    /**
     * Get posts by particular account from Pixamind
     * @param options
     */
    public getAccountPosts(options: AccountPostsQuery): Promise<Discussion[]> {
        return this.call('get_account_posts', options)
    }

    /**
     * Get community details such as who are the admin,
     * moderators, how many subscribers, etc..
     * @param options
     */
    public getCommunity(options: CommunityQuery): Promise<CommunityDetail[]> {
        return this.call('get_community', options)
    }

    /**
     * List all subscriptions by particular account
     * @param account the account you want to query
     * @returns {Array} return role, what community the account joined
     */
    public listAllSubscriptions(account: Account['name'] | object): Promise<Discussion[]> {
        return this.call('list_all_subscriptions', account)
    }

    /**
     * Get particular account notifications feed
     * @param options
     */
    public getAccountNotifications(options?: AccountNotifsQuery): Promise<Notifications[]> {
        return this.call('account_notifications', options)
    }

    /**
     * List all available communities on pixamind
     * @param options
     */
    public listCommunities(options: ListCommunitiesQuery): Promise<CommunityDetail[]> {
        return this.call('list_communities', options)
    }

    /**
     * Call a method of another Pixamind namespace: `pixamind_api`, `pixamind_content`,
     * `pixamind_feed`, `pixamind_graph` or `pixamind_nft`.
     */
    public callNamespace(namespace: string, method: string, params: any = {}) {
        return this.client.call(namespace, method, params)
    }

    /**
     * What the Pixamind node is: version, indexed block, enabled features (`nfts`, `promotions`,
     * `post_history`, …) and namespaces.
     */
    public getInfo(): Promise<{ [key: string]: any }> {
        return this.callNamespace('pixamind_api', 'get_info', {})
    }

    /**
     * One post with its bridge fields, `nft_minted` and `promoted` included.
     */
    public getPost(author: string, permlink: string, observer?: string): Promise<Discussion> {
        return this.call('get_post', observer ? { author, permlink, observer } : { author, permlink })
    }

    // ------------------------------------------------------------- promotion

    /**
     * The promoted feed: root posts awaiting payout that PXS was burned for, highest total first
     * (newest first on a tie), each with `promoted`. `tag` can be a tag, a community or `my` with
     * an observer. To promote a post: {@link BroadcastAPI.promote}.
     */
    public getPromotedPosts(query: PromotedPostsQuery = {}): Promise<Discussion[]> {
        return this.call('get_ranked_posts', { ...query, sort: 'promoted' })
    }

    /**
     * The payments behind a post, newest first, with its total.
     * @param limit 1 to 1000, default 100.
     */
    public getPromotions(author: string, permlink: string, limit?: number): Promise<Promotions> {
        const params = limit === undefined ? { author, permlink } : { author, limit, permlink }
        return this.callNamespace('pixamind_feed', 'get_promotions', params)
    }

    /**
     * What an account burned to promote posts, newest first, with its total.
     * @param limit 1 to 1000, default 100.
     */
    public getPromotionsBySender(sender: string, limit?: number): Promise<Promotions> {
        const params = limit === undefined ? { sender } : { limit, sender }
        return this.callNamespace('pixamind_feed', 'get_promotions', params)
    }

    // --------------------------------------------------------------- content

    /**
     * Metadata of a post: format, tags, license, picture size, and when they apply `promoted`,
     * `versions` (recorded edits) and `nft` (terms and market summary of a minted post).
     * Throws when the post does not exist.
     */
    public getContentMetadata(author: string, permlink: string): Promise<ContentMetadata> {
        return this.callNamespace('pixamind_content', 'get_content_metadata', { author, permlink })
    }

    /**
     * Metadata of up to 100 posts in one call, in the order asked; `null` for a post that does not exist.
     */
    public getContentMetadataBatch(
        posts: [string, string][] | { author: string, permlink: string }[]
    ): Promise<(ContentMetadata | null)[]> {
        if (posts.length > 100) {
            return Promise.reject(new Error('At most 100 posts per call'))
        }
        return this.callNamespace('pixamind_content', 'get_content_metadata', { posts })
    }

    /**
     * Every recorded version of a post or comment, oldest first: the creation, then each edit, with
     * the fields it changed. `bodies: false` leaves the bodies out.
     * @param options `start` (version number, from 1), `limit` (1 to 100, default 20), `bodies` (default true)
     */
    public getPostHistory(
        author: string,
        permlink: string,
        options: { start?: number, limit?: number, bodies?: boolean } = {}
    ): Promise<PostHistory> {
        return this.callNamespace('pixamind_content', 'get_post_history', { author, permlink, ...options })
    }

    // ------------------------------------------------------------------ NFTs

    /**
     * NFTs and copies by id, at most 100: for `@author/permlink/0` the NFT with its terms and
     * market summary (copies, for_sale, floor, reserve, reserve_offer, …), for `@author/permlink/N`
     * copy N with the terms of its NFT under `nft`. Ids that name nothing are left out, so an empty
     * answer means "not minted".
     */
    public async getNfts(ids: string | string[]): Promise<(PixamindNft | PixamindNftEdition)[]> {
        const list = Array.isArray(ids) ? ids : [ids]
        if (list.length > NFT_FIND_LIMIT) {
            throw new Error(`At most ${NFT_FIND_LIMIT} NFT ids per call`)
        }
        return (await this.callNamespace('pixamind_nft', 'get_nfts', { nfts: list })).nfts
    }

    /**
     * One NFT with its terms and market summary; undefined when the post is not minted.
     */
    public async getNft(author: string, permlink: string): Promise<PixamindNft | undefined> {
        const [nft] = await this.getNfts(formatNftId(author, permlink, 0))
        return nft as PixamindNft | undefined
    }

    /**
     * The copies of one NFT, page by page: by number (every copy, reserve included) or by price
     * (what can be bought now, cheapest first, the offered reserve as copy 0).
     */
    public listNftEditions(
        query: NftEditionsQuery
    ): Promise<PixamindPage & { nft_id: string, sort: string, editions: PixamindNftEdition[] }> {
        return this.callNamespace('pixamind_nft', 'list_editions', query)
    }

    /**
     * NFTs an account minted, newest first, each with its summary, and their `total`.
     */
    public listCreatedNfts(
        account: string,
        options: { limit?: number, start?: string } = {}
    ): Promise<PixamindPage & { account: string, total: number, nfts: PixamindNft[] }> {
        return this.callNamespace('pixamind_nft', 'list_created', { account, ...options })
    }

    /**
     * NFTs an account holds copies of, latest acquisition first: the terms, how many it holds and
     * how many of those are for sale. A creator holds the copies it never parted with;
     * `acquired_only` leaves those out.
     */
    public listOwnedNfts(
        account: string,
        options: { acquired_only?: boolean, limit?: number, start?: string } = {}
    ): Promise<PixamindPage & { account: string, nfts: PixamindOwnedNft[] }> {
        return this.callNamespace('pixamind_nft', 'list_owned', { account, ...options })
    }

    /**
     * What can be bought now across all NFTs, each with the terms of its NFT: copies offered on their
     * own, and offered reserves as one entry each (copy 0, `reserve: true`, `copies`, `next`).
     */
    public listNftMarket(
        query: NftMarketQuery = {}
    ): Promise<PixamindPage & { sort: string, editions: PixamindNftEdition[] }> {
        return this.callNamespace('pixamind_nft', 'list_market', query)
    }

    /**
     * History of an NFT (`…/0`: every copy), of one copy (`…/N`: that copy and the mint), or of an
     * account, newest first: mints, offers, sales, gifts and burns. `limit` up to 1,000.
     */
    public getNftHistory(query: NftHistoryQuery): Promise<PixamindPage & { history: PixamindNftEvent[] }> {
        return this.callNamespace('pixamind_nft', 'get_history', query)
    }

    /**
     * The full license text of an NFT (any copy id names it), with its size and SHA-256; undefined
     * when the post is not minted. Compare `license_sha256` with the chain's
     * ({@link NftAPI.getNft}) to check the text is the one minted.
     */
    public async getNftLicense(id: string): Promise<PixamindNftLicense | undefined> {
        const result = await this.callNamespace('pixamind_nft', 'get_license', { nft: id })
        return result && result.license !== undefined ? result : undefined
    }
}

