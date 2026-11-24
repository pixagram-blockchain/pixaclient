export interface CommunityDetail {
    id: number
    name: string
    title: string
    about: string
    lang: string
    type_id: number
    is_nsfw: false
    subscribers: number
    sum_pending: number
    num_pending: number
    num_authors: number
    created_at: string
    avatar_url: string
    context: object
    description: string
    flag_text: string
    settings: {}
    team?: string[]
    admins?: string[]
}

export interface Notifications {
    id: number
    type: string
    score: number
    date: string
    msg: string
    url: string
}


/**
 * A page of a Pixamind list: pass `next_start` back as `start` to get the next page (treat it as
 * opaque); `has_more` is false on the last page.
 */
export interface PixamindPage {
    next_start?: string
    has_more: boolean
}

/** Terms of an NFT, fixed at mint. Amounts are strings such as `"5.000 PXS"`. */
export interface PixamindNftTerms {
    /** `@author/permlink/0` */
    nft_id: string
    author: string
    permlink: string
    /** Mint time, e.g. `2027-01-10T12:02:03`. */
    minted: string
    mint_block: number
    editions: number
    /** Basis points of each later sale paid to the creator. */
    royalty: number
    /** The royalty as a percentage with two decimals, e.g. `"10.00"`. */
    royalty_percent: string
    mint_fee: string
    /** Bytes of the license text; the text itself: {@link PixamindAPI.getNftLicense}. */
    license_size: number
    /** SHA-256 of the license text, as the chain keeps it. */
    license_sha256: string
    /** False when the minted post was removed from Pixamind's index. */
    post_exists: boolean
}

/** One copy as Pixamind shows it. A field that does not apply is left out. */
export interface PixamindNftEdition {
    /** `@author/permlink/N`; `@author/permlink/0` for an offered reserve. */
    nft_id: string
    author: string
    permlink: string
    /** 1 to 10,000; 0 for an offered reserve. */
    edition: number
    owner: string
    burned?: boolean
    acquired?: string
    /** True while the copy can be bought. */
    listed: boolean
    price?: string
    /** Only for an offer that expires. */
    expiration?: string
    listed_at?: string
    sales?: number
    volume?: string
    royalties?: string
    last_sale_price?: string
    last_sale?: string
    /**
     * The copy is in the creator's reserve (bought through copy 0 while the reserve is offered),
     * or, with edition 0, this entry is the reserve offer itself.
     */
    reserve?: boolean
    /** Reserve offer only: how many copies it covers. */
    copies?: number
    /** Reserve offer only: the copy the next buyer of copy 0 gets, `@author/permlink/N`. */
    next?: string
    /** The terms of the NFT, in `get_nfts` for a copy and in market lists. */
    nft?: PixamindNftTerms
}

/** An NFT with its terms and the market summary an NFT page needs. */
export interface PixamindNft extends PixamindNftTerms {
    /** Number of copies (the same as `editions`). */
    copies: number
    /** Copies that can be bought now: each copy offered on its own, plus the whole reserve while offered. */
    for_sale: number
    /** Copies offered on their own. */
    listed: number
    /** Copies in the creator's reserve: never left the creator, no offer of their own. */
    reserve: number
    /** Copies given to `null`. */
    burned: number
    /** Copies the creator still holds: the reserve, plus copies offered on their own or got back. */
    held_by_creator: number
    sales: number
    volume: string
    royalties: string
    /** The reserve offer, when copy 0 can be bought now. */
    reserve_offer?: PixamindNftEdition
    /**
     * The lowest price a copy can be bought at now, how many copies sell at it, and the ids to buy
     * them with (at most 100; `@author/permlink/0` is the reserve, which gives `reserve_offer.next`).
     */
    floor?: { price: string, copies: number, nft_ids: string[] }
    /** The most recent sale of any copy. */
    last_sale?: { price: string, edition: number, time: string }
}

/** An NFT an account holds copies of (`list_owned`). */
export interface PixamindOwnedNft {
    nft: PixamindNftTerms
    /** Copies held. */
    held: number
    /** Of those, how many can be bought now. */
    listed: number
    /** Latest acquisition. */
    acquired: string
}

/** One event of an NFT's history (`get_history`): mint, list, unlist, sale, transfer or burn. */
export interface PixamindNftEvent {
    /** Event id (an operation id, as a string). */
    id: string
    block_num: number
    timestamp: string
    type: 'mint' | 'list' | 'unlist' | 'sale' | 'transfer' | 'burn'
    nft_id: string
    author: string
    permlink: string
    /** Absent for the mint and the reserve. */
    edition?: number
    /** The actor: minter, owner, buyer, giver. */
    account: string
    /** Sale: the previous owner. */
    seller?: string
    /** Transfer: the receiver. */
    to?: string
    price?: string
    /** Sale: the part paid to the creator. */
    royalty?: string
    expiration?: string
    /** Mint only. */
    editions?: number
    royalty_rate?: number
    license_size?: number
    license_sha256?: string
    fee?: string
}

/** The full license text of an NFT (`get_license`). */
export interface PixamindNftLicense {
    nft_id: string
    license: string
    license_size: number
    license_sha256: string
}

/** Metadata of a post (`pixamind_content.get_content_metadata`). A field that does not apply is left out. */
export interface ContentMetadata {
    author: string
    permlink: string
    depth: number
    category?: string
    community?: string
    created: string
    updated: string
    title?: string
    /** Format, app, tags, license and, for an artwork, the picture's size, read from json_metadata and the body. */
    content?: { [key: string]: any }
    /** Total burned to promote the post, e.g. `"1.750 PXS"`; only when something was. */
    promoted?: string
    /** Number of recorded versions (the creation and each edit); only when the history is recorded. */
    versions?: number
    /** Terms and market summary, when the post is minted. */
    nft?: PixamindNft
}

/** One version of a post or comment (`pixamind_content.get_post_history`). */
export interface PostVersion {
    version: number
    block_num: number
    timestamp: string
    op_id: string
    /** True for the creation, false for an edit. */
    created: boolean
    /** Fields this version changed: `title`, `body`, `json_metadata`. */
    changed: string[]
    title: string
    /** Left out with `bodies: false`. */
    body?: string
    json_metadata: string
}

/** The recorded versions of a post or comment, oldest first. */
export interface PostHistory {
    author: string
    permlink: string
    total: number
    /** False when the history only starts partway (the post predates the recording). */
    complete: boolean
    versions: PostVersion[]
}

/**
 * The promotion payments behind a post (`author`, `permlink`, `promoted`), or what an account spent
 * on promotion (`sender`, `total`), newest first. Amounts are in PXS, e.g. `"1.750 PXS"`.
 */
export interface Promotions {
    author?: string
    permlink?: string
    /** Total burned for the post. */
    promoted?: string
    sender?: string
    /** Total the sender burned. */
    total?: string
    promotions: {
        /** Payments behind a post: who paid. */
        sender?: string
        /** An account's spending: which post. */
        author?: string
        permlink?: string
        /** An account's spending: false when the memo named no promotable post (the PXS burned anyway). */
        post_exists?: boolean
        amount: string
        block_num: number
        timestamp: string
    }[]
}
