declare module 'dpixa/src/assert' {
	/**
	 * @file Minimal assertion helpers.
	 *
	 * Replaces Node's `assert` module. Browser bundlers had to polyfill it with
	 * the `assert` package, which drags in `util`, `object.assign`, `is-nan`,
	 * `call-bind`, … Only the three forms dpixa uses are implemented. Failures
	 * still throw an error named `AssertionError` with Node's `ERR_ASSERTION`
	 * code and the same messages as before.
	 */
	export class AssertionError extends Error {
	    readonly code = "ERR_ASSERTION";
	    constructor(message: string);
	}
	interface Assert {
	    /** Throw an AssertionError unless `value` is truthy. */
	    (value: unknown, message?: string): asserts value;
	    /** Loose (`==`) equality, like Node's `assert.equal`. */
	    equal(actual: unknown, expected: unknown, message?: string): void;
	    /**
	     * Element-wise equality of two byte arrays (Uint8Array, BBuffer, number[]).
	     * dpixa only ever deep-compares checksums and network ids.
	     */
	    deepEqual(actual: ArrayLike<number>, expected: ArrayLike<number>, message?: string): void;
	} const assert: Assert;
	export default assert;

}
declare module 'dpixa/src/bbuffer' {
	/**
	 * @file Node-Buffer shim (`BBuffer`) and byte/string encoding helpers.
	 *
	 * Split out of bytebuffer.ts so the fetch-only "lite" build can use `BBuffer`
	 * (chain ids, HexBuffer, ref_block_prefix) without also pulling in the
	 * stream-style `ByteBuffer` serializer, which only the crypto side needs.
	 *
	 * No Node `Buffer` is used anywhere: everything is a plain Uint8Array.
	 */
	export function bytesToHex(bytes: Uint8Array, start?: number, end?: number): string;
	export function hexToBytes(hex: string): Uint8Array;
	/** "binary" encoding: one-byte-per-char Latin-1, matching Node's legacy mode. */
	export function binaryToBytes(str: string): Uint8Array;
	export function bytesToBinary(bytes: Uint8Array, start?: number, end?: number): string;
	export function utf8ToBytes(str: string): Uint8Array;
	export function bytesToUtf8(bytes: Uint8Array, start?: number, end?: number): string;
	export type Encoding = 'hex' | 'binary' | 'utf-8' | 'utf8' | 'latin1';
	export function encodeString(str: string, encoding: Encoding): Uint8Array;
	export function decodeBytes(bytes: Uint8Array, encoding: Encoding, start?: number, end?: number): string;
	export class BBuffer extends Uint8Array {
	    /**
	     * Allocate a new zero-filled buffer of the given size.
	     * The optional `fill` argument is a byte value (0-255) to pre-fill with.
	     */
	    static alloc(size: number, fill?: number): BBuffer;
	    /**
	     * Build a buffer from an array-like of bytes, a string (with encoding),
	     * another Uint8Array, or an ArrayBuffer. Always produces an *independent*
	     * allocation — slicing the result cannot alias the input.
	     *
	     * Signature is declared as overloads so this override is assignable to
	     * `Uint8Array.from` (which has two- and three-arg shapes with `mapfn`).
	     */
	    static from(value: string, encoding?: Encoding): BBuffer;
	    static from(value: ArrayBuffer | Uint8Array | BBuffer | ArrayLike<number>): BBuffer;
	    /** Concatenate a list of Uint8Arrays / BBuffers into a single new buffer. */
	    static concat(list: (Uint8Array | BBuffer)[], totalLength?: number): BBuffer;
	    /** Internal helper: wrap a Uint8Array in a BBuffer with its own memory. */
	    private static fromUint8Array;
	    /**
	     * Return a string in the given encoding. Defaults to utf-8 so that calls
	     * like `buf.toString()` behave like Node.js `Buffer`.
	     */
	    toString(encoding?: Encoding, start?: number, end?: number): string;
	    /**
	     * Return an *independent* copy of the sub-range. Node's `Buffer.slice`
	     * returns a view that aliases the original; that aliasing is one of the
	     * classes of bug this module is meant to prevent, so we always copy.
	     */
	    slice(begin?: number, end?: number): BBuffer;
	    /** Read a single unsigned byte. */
	    readUInt8(offset?: number): number;
	    /** Write a single unsigned byte. Returns new offset like Node. */
	    writeUInt8(value: number, offset?: number): number;
	    /**
	     * Read an unsigned little-endian 16/32-bit integer at `offset`.
	     * Matches Node.js `Buffer.prototype.readUInt{16,32}LE`.
	     */
	    readUInt16LE(offset?: number): number;
	    readUInt32LE(offset?: number): number;
	    /** Big-endian variants, for completeness. */
	    readUInt16BE(offset?: number): number;
	    readUInt32BE(offset?: number): number;
	    /**
	     * Copy bytes from this buffer into `target`, starting at `targetStart`,
	     * reading `[sourceStart, sourceEnd)` of this buffer. Mirrors Node's
	     * `Buffer.prototype.copy` return value (number of bytes copied).
	     */
	    copy(target: Uint8Array, targetStart?: number, sourceStart?: number, sourceEnd?: number): number;
	}

}
declare module 'dpixa/src/base58' {
	/** Encode a Buffer (or Uint8Array / array-like of bytes) to a base58 string. */
	export function encode(source: any): string;
	/** Decode a base58 string to a Buffer. Throws on invalid characters. */
	export function decode(source: string): any;

}
declare module 'dpixa/src/bytebuffer' {
	/**
	 * @file Stream-style ByteBuffer (serializer backend) and a minimal Long.
	 *
	 * Replaces `@ecency/bytebuffer`. The previous library suffered from copy /
	 * allocation bugs (affecting `memo.ts` and `crypto.ts` in particular) because
	 * it shared underlying ArrayBuffers between views in surprising ways. This
	 * implementation is allocation-explicit: every `copy()`, `slice()`, and
	 * `toBuffer()` produces an independent buffer.
	 *
	 * Exports:
	 *   - ByteBuffer    Stream-style writer/reader (writeVString, flip, …)
	 *   - Long          Minimal 64-bit integer helper (only methods used by aes.ts)
	 *   - BBuffer       Re-exported from ./bbuffer (Node-Buffer shim)
	 *
	 * The module default export mirrors the historical `require("@ecency/bytebuffer")`
	 * call-site shape: calling `new ByteBuffer(cap, le)` builds a stream buffer,
	 * and static helpers like `ByteBuffer.DEFAULT_CAPACITY`, `ByteBuffer.LITTLE_ENDIAN`,
	 * `ByteBuffer.fromBinary`, and `ByteBuffer.Long` are all available.
	 */
	import { BBuffer, Encoding } from 'dpixa/src/bbuffer';
	export { BBuffer };
	export class Long {
	    static isLong(value: unknown): value is Long;
	    static fromNumber(n: number): Long;
	    static fromString(s: string, _unsigned?: boolean, radix?: number): Long;
	    /** Always stored masked to 64 unsigned bits. */
	    private readonly value;
	    constructor(value: bigint);
	    shiftLeft(n: number): Long;
	    or(other: Long): Long;
	    toString(radix?: number): string;
	    /** Low/high 32-bit halves, for little-endian serialisation. */
	    getLow32(): number;
	    getHigh32(): number;
	    toBigInt(): bigint;
	}
	export class ByteBuffer {
	    static readonly DEFAULT_CAPACITY = 64;
	    static readonly LITTLE_ENDIAN = 1;
	    static readonly BIG_ENDIAN = 0;
	    static readonly Long: typeof Long;
	    /**
	     * Build a ByteBuffer whose contents are the bytes of a "binary" (Latin-1)
	     * string. Call-sites use either (binary, endian) or (binary, capacity, endian);
	     * we accept both.
	     */
	    static fromBinary(binary: string, capacityOrEndian?: number, _endian?: number): ByteBuffer;
	    private data;
	    private view;
	    private _offset;
	    private _limit;
	    private writeOffset;
	    private markedOffset;
	    constructor(capacity?: number, _endian?: number);
	    /** Current read/write cursor. The legacy API exposed this as `.offset`. */
	    get offset(): number;
	    set offset(v: number);
	    /** Total capacity of the underlying storage. */
	    capacity(): number;
	    private ensure;
	    writeByte(value: number): ByteBuffer;
	    writeInt8(value: number): ByteBuffer;
	    writeUint8(value: number): ByteBuffer;
	    writeInt16(value: number): ByteBuffer;
	    writeUint16(value: number): ByteBuffer;
	    writeInt32(value: number): ByteBuffer;
	    writeUint32(value: number): ByteBuffer;
	    /** Accepts Long, bigint, number, or decimal string. Always little-endian. */
	    writeInt64(value: Long | bigint | number | string): ByteBuffer;
	    writeUint64(value: Long | bigint | number | string): ByteBuffer;
	    /** Varint-32, protobuf-style (7 bits per byte, MSB = continuation). */
	    writeVarint32(value: number): ByteBuffer;
	    /**
	     * Write a length-prefixed UTF-8 string: varint32 length followed by bytes.
	     * Matches @ecency/bytebuffer's writeVString.
	     */
	    writeVString(value: string): ByteBuffer;
	    /**
	     * Append raw bytes or a string at the current offset. When `data` is a
	     * string and `encoding` is 'binary', each char is treated as a single byte.
	     */
	    append(data: Uint8Array | ArrayBuffer | string | {
	        buffer: Uint8Array;
	    } | number[], encoding?: Encoding): ByteBuffer;
	    readUint8(): number;
	    readInt8(): number;
	    readUint16(): number;
	    readInt16(): number;
	    readUint32(): number;
	    readInt32(): number;
	    /** Returns a Long (decimal-string-printable) for call-site compatibility. */
	    readUint64(): Long;
	    readInt64(): Long;
	    readVarint32(): number;
	    readVString(): string;
	    skip(n: number): ByteBuffer;
	    mark(offset?: number): ByteBuffer;
	    reset(): ByteBuffer;
	    /**
	     * Flip from "write" to "read" mode: limit = current offset, offset = 0.
	     * Matches @ecency/bytebuffer semantics.
	     */
	    flip(): ByteBuffer;
	    /**
	     * Return a new ByteBuffer containing an independent copy of bytes
	     * `[start, end)`. The new buffer is in read mode: offset = 0,
	     * limit = end - start. This is a deep copy — the caller cannot alias
	     * this buffer's memory through the returned one.
	     */
	    copy(start?: number, end?: number): ByteBuffer;
	    /**
	     * Return an independent Uint8Array containing the meaningful bytes.
	     * After flip(): bytes [0, limit). Otherwise: bytes [0, offset).
	     */
	    toBuffer(): Uint8Array;
	    /** Same bytes as toBuffer(), but wrapped as a BBuffer (Node-Buffer shim). */
	    toBBuffer(): BBuffer;
	    /** "binary" (Latin-1) string of the meaningful bytes. */
	    toBinary(): string;
	    /**
	     * Encode the meaningful bytes. Default is hex (the most common call-site
	     * in utils.ts). Accepts 'hex', 'binary', 'utf-8'.
	     */
	    toString(encoding?: Encoding): string;
	    private checkReadable;
	}
	export default ByteBuffer;

}
declare module 'dpixa/src/errors' {
	/**
	 * @file Minimal stand-in for the `verror` package.
	 *
	 * dpixa only used `new VError({ name, cause?, info? }, message)`. This class
	 * keeps the fields callers inspect — `name`, `message`, `jse_shortmsg`,
	 * `jse_info`, `jse_cause` and the `cause()` method — so code that checks
	 * `error.name === 'RPCError'` or reads `error.jse_info` (or passes the error
	 * to `VError.info()` from the real package) keeps working, without verror's
	 * dependency tree (`extsprintf`, `assert-plus`, `core-util-is`, Node `util`).
	 *
	 * One deliberate difference: the message is used verbatim instead of being
	 * run through printf. With verror, an RPC error message such as
	 * "50% done" made the constructor itself throw "too few args to sprintf",
	 * hiding the real node error.
	 */
	export interface VErrorOptions {
	    /** Error name, e.g. `RPCError` or `SerializationError`. */
	    name?: string;
	    /** Underlying error; its message is appended after a colon. */
	    cause?: Error;
	    /** Extra data, copied (shallowly) to `jse_info`. */
	    info?: {
	        [key: string]: any;
	    };
	}
	export class VError extends Error {
	    /** The message as given, without the cause's message appended. */
	    jse_shortmsg: string;
	    /** The underlying error, when one was given. */
	    jse_cause?: Error;
	    /** Extra data attached to the error (e.g. the RPC error `data`). */
	    jse_info: {
	        [key: string]: any;
	    };
	    constructor(options: VErrorOptions, message: string);
	    /**
	     * Return the underlying error, if any (same as verror's `cause()`).
	     */
	    cause(): Error | undefined;
	}

}
declare module 'dpixa/src/version' {
	 const _default: string;
	export default _default;

}
declare module 'dpixa/src/parameters' {
	export const MAINNET_HEX_CHAIN_ID = "706978616772616d000000000000000000000000000000000000000000000000";
	export const TESTNET_HEX_CHAIN_ID = "18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e";
	export const PREFIX_MAINNET_ADDRESS = "PIX";
	export const PREFIX_TESTNET_ADDRESS = "TST";
	export const MAIN_MAINNET_NODE_URL = "https://api.pixagram.com";
	export const MAIN_TESTNET_NODE_URL = "https://api.pixagram.com";
	export const NETWORK_ID_INT = 128;

}
declare module 'dpixa/src/chain/asset' {
	/**
	 * @file Hive/Pixa asset type definitions and helpers.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	export interface SMTAsset {
	    amount: string | number;
	    precision: number;
	    nai: string;
	}
	/**
	 * Asset symbol string.
	 */
	export type AssetSymbol = 'HIVE' | 'PXA' | 'PIXA' | 'TESTS' | 'PXP' | 'VESTS' | 'PXS' | 'TBD' | 'STEEM' | 'TPS' | 'SBD' | 'HBD';
	/** Mainnet symbol of a core asset NAI (`@@000000013` is PXS), or undefined. */
	export const symbolOfNai: (nai: string) => AssetSymbol | undefined;
	/**
	 * Class representing a pixa asset, e.g. `1.000 PIXA` or `12.112233 VESTS`.
	 */
	export class Asset {
	    readonly amount: number;
	    readonly symbol: AssetSymbol;
	    constructor(amount: number, symbol: AssetSymbol);
	    /**
	     * Create a new Asset instance from a string, e.g. `42.000 PIXA`.
	     */
	    static fromString(string: string, expectedSymbol?: AssetSymbol): Asset;
	    /**
	     * Create an Asset from the form database_api (and HAF) use for amounts,
	     * `{ amount: "5000", precision: 3, nai: "@@000000013" }`: `@@000000021` is PIXA, `@@000000013`
	     * PXS and `@@000000037` VESTS (on a testnet, pass `TESTS` or `TBD` as `symbol`).
	     */
	    static fromNai(value: SMTAsset, symbol?: AssetSymbol): Asset;
	    /**
	     * Convenience to create new Asset.
	     * @param value  An Asset, a string such as `"42.000 PIXA"`, a number, or an amount in the
	     *               database_api form `{ amount, precision, nai }` (see {@link Asset.fromNai}).
	     * @param symbol Symbol to use when created from number. Will also be used to validate
	     *               the asset, throws if the passed value has a different symbol than this.
	     */
	    static from(value: string | Asset | number | SMTAsset, symbol?: AssetSymbol): Asset;
	    /**
	     * Return the smaller of the two assets.
	     */
	    static min(a: Asset, b: Asset): Asset;
	    /**
	     * Return the larger of the two assets.
	     */
	    static max(a: Asset, b: Asset): Asset;
	    /**
	     * Return asset precision.
	     */
	    getPrecision(): number;
	    /**
	     * returns a representation of this asset using only STEEM SBD for
	     * legacy purposes
	     */
	    steem_symbols(): Asset;
	    /**
	     * Return a string representation of this asset, e.g. `42.000 PIXA`.
	     */
	    toString(): string;
	    /**
	     * Return a new Asset instance with amount added.
	     */
	    add(amount: Asset | string | number): Asset;
	    /**
	     * Return a new Asset instance with amount subtracted.
	     */
	    subtract(amount: Asset | string | number): Asset;
	    /**
	     * Return a new Asset with the amount multiplied by factor.
	     */
	    multiply(factor: Asset | string | number): Asset;
	    /**
	     * Return a new Asset with the amount divided.
	     */
	    divide(divisor: Asset | string | number): Asset;
	    /**
	     * For JSON serialization, same as toString().
	     */
	    toJSON(): string;
	}
	export type PriceType = Price | {
	    base: Asset | string;
	    quote: Asset | string;
	};
	/**
	 * Represents quotation of the relative value of asset against another asset.
	 * Similar to 'currency pair' used to determine value of currencies.
	 *
	 *  For example:
	 *  1 EUR / 1.25 USD where:
	 *  1 EUR is an asset specified as a base
	 *  1.25 USD us an asset specified as a qute
	 *
	 *  can determine value of EUR against USD.
	 */
	export class Price {
	    readonly base: Asset;
	    readonly quote: Asset;
	    /**
	     * @param base  - represents a value of the price object to be expressed relatively to quote
	     *                asset. Cannot have amount == 0 if you want to build valid price.
	     * @param quote - represents an relative asset. Cannot have amount == 0, otherwise
	     *                asertion fail.
	     *
	     * Both base and quote shall have different symbol defined.
	     */
	    constructor(base: Asset, quote: Asset);
	    /**
	     * Convenience to create new Price.
	     */
	    static from(value: PriceType): Price;
	    /**
	     * Return a string representation of this price pair.
	     */
	    toString(): string;
	    /**
	     * Return a new Asset with the price converted between the symbols in the pair.
	     * Throws if passed asset symbol is not base or quote.
	     */
	    convert(asset: Asset): Asset;
	}

}
declare module 'dpixa/src/chain/nft' {
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
	import { Asset } from 'dpixa/src/chain/asset';
	import type { NftAction, NftActionInput, NftBuy, NftList, NftMint, NftTransfer, NftUnlist } from 'dpixa/src/chain/operation';
	/** Most copies an NFT can have (`PIXA_NFT_EDITIONS_LIMIT`). */
	export const NFT_MAX_EDITIONS = 10000;
	/** Highest royalty, in basis points: 2500 is 25% (`PIXA_NFT_MAX_ROYALTY`). */
	export const NFT_MAX_ROYALTY = 2500;
	/** Longest license text, in UTF-8 bytes: 72 KiB (`PIXA_NFT_MAX_LICENSE_LENGTH`). */
	export const NFT_MAX_LICENSE_BYTES: number;
	/** Mint fee per copy, burned (`PIXA_NFT_MINT_FEE_PER_EDITION`). */
	export const NFT_MINT_FEE_PER_EDITION = "1.000 PXS";
	/** The edition number that stands for the author's reserve in nft_list, nft_unlist and nft_buy. */
	export const NFT_RESERVE = 0;
	/**
	 * Expiration of an offer that never expires (`time_point_sec::maximum()`), as the node writes it
	 * in what it returns. To make such an offer, leave `expiration` out: the node cannot read this
	 * time back from JSON (see {@link NFT_LATEST_EXPIRATION}), and dpixa does not send it.
	 */
	export const NFT_NEVER_EXPIRES = "2106-02-07T06:28:15";
	/**
	 * Latest expiration an offer can be given: the node reads JSON times up to 2^31 - 1 seconds after
	 * 1970 and refuses later ones ("Datetime overflow"), the never-expiring value included.
	 */
	export const NFT_LATEST_EXPIRATION = "2038-01-19T03:14:07";
	/** The account a copy is given to in order to burn it. */
	export const NFT_BURN_ACCOUNT = "null";
	/** Most ids per `database_api.find_nfts` or `pixamind_nft.get_nfts` call. */
	export const NFT_FIND_LIMIT = 100;
	/** Binary tag of each nft_operation action, its position in the node's `nft_action` variant. */
	export const NFT_ACTION_TAGS: {
	    readonly nft_mint: 0;
	    readonly nft_list: 1;
	    readonly nft_unlist: 2;
	    readonly nft_buy: 3;
	    readonly nft_transfer: 4;
	};
	/** Name of an nft_operation action. */
	export type NftActionName = keyof typeof NFT_ACTION_TAGS;
	/** What an NFT id names: copy `edition` of the NFT (author, permlink), or the NFT itself for 0. */
	export interface NftIdParts {
	    author: string;
	    permlink: string;
	    /** 0 for the NFT (or its reserve, in list, unlist and buy), 1 to 10,000 for a copy. */
	    edition: number;
	}
	/**
	 * Read an NFT id, "@author/permlink/N", with the node's rules: the author runs to the first '/'
	 * and N follows the last one, so a permlink that holds a '/' still reads correctly; N is written
	 * without leading zeros and is at most 10,000. Throws on anything else.
	 */
	export const parseNftId: (id: string) => NftIdParts;
	/** Whether `id` is a well-formed NFT id ("@author/permlink/N"). */
	export const isNftId: (id: string) => boolean;
	/**
	 * Write an NFT id: "@author/permlink/0" for the NFT (the default), "@author/permlink/N" for copy N.
	 */
	export const formatNftId: (author: string, permlink: string, edition?: number) => string;
	/** Number of bytes of `text` in UTF-8, the unit of the license limit. */
	export const utf8ByteLength: (text: string) => number;
	/**
	 * The mint fee nft_mint has to carry: `editions` times 1.000 PXS, which the chain burns.
	 * @param perEdition The fee per copy; `database_api.get_nft_params` returns the one in force.
	 */
	export const nftMintFee: (editions: number, perEdition?: Asset | string) => Asset;
	/**
	 * What the creator receives from a sale: `price * royalty / 10000`, rounded down to 0.001, as the
	 * node computes it. A sale by the creator pays no royalty; use {@link nftSaleSplit} for that case.
	 * @param royalty Basis points (1000 is 10%).
	 */
	export const nftRoyalty: (price: Asset | string, royalty: number) => Asset;
	/**
	 * How a sale price is shared: the creator gets the royalty unless the seller is the creator
	 * (a first sale, or a copy the creator got back), and the seller gets the rest.
	 */
	export const nftSaleSplit: (price: Asset | string, royalty: number, sellerIsCreator?: boolean) => {
	    royalty: Asset;
	    seller: Asset;
	};
	/**
	 * Check an nft_mint the way the node will (format and consensus limits), so a user is told before
	 * signing. Returns the list of problems, empty when the mint would be accepted on these points;
	 * the chain also checks that the post is a root post of the minter, not minted before, and that the
	 * minter holds the fee in liquid PXS.
	 */
	export const checkNftMint: (mint: Partial<NftMint>) => string[];
	/** Tag and payload of an action, whatever form it was given in. */
	export const toNftAction: (action: NftActionInput) => NftAction;
	/** Name of the action with this tag ("nft_mint" for 0, …). */
	export const nftActionName: (tag: number) => NftActionName;
	/** Payload types by action, for helpers that build actions. */
	export interface NftActionPayloads {
	    nft_mint: NftMint;
	    nft_list: NftList;
	    nft_unlist: NftUnlist;
	    nft_buy: NftBuy;
	    nft_transfer: NftTransfer;
	}

}
declare module 'dpixa/src/chain/transaction' {
	/**
	 * @file Hive/Pixa transaction type definitions.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	import { Operation } from 'dpixa/src/chain/operation';
	export interface Transaction {
	    ref_block_num: number;
	    ref_block_prefix: number;
	    expiration: string;
	    operations: Operation[];
	    extensions: any[];
	}
	export interface SignedTransaction extends Transaction {
	    signatures: string[];
	}
	/**
	 * What a broadcast returns. dpixa broadcasts with `condenser_api.broadcast_transaction`, which
	 * answers once the node has accepted the transaction, before it is in a block: `id` is set, and
	 * `client.transaction.findTransaction(id)` tells when the transaction is in a block. The other
	 * fields come only from `broadcast_transaction_synchronous`, called directly.
	 */
	export interface TransactionConfirmation {
	    id: string;
	    block_num?: number;
	    trx_num?: number;
	    expired?: boolean;
	}

}
declare module 'dpixa/src/chain/normalize' {
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
	import type { Operation } from 'dpixa/src/chain/operation';
	import type { Transaction } from 'dpixa/src/chain/transaction';
	/**
	 * The operation in the form the node reads: see the notes at the top of this file. Returns the
	 * operation itself when nothing changes, a copy otherwise.
	 */
	export const normalizeOperation: (operation: Operation) => Operation;
	/** The transaction with every operation in the form the node reads (a copy when one changes). */
	export const normalizeTransaction: <T extends Transaction>(transaction: T) => T;

}
declare module 'dpixa/src/witness' {
	/**
	 * @file witness_set_properties builder.
	 *
	 * Moved here from utils.ts: it needs the binary serializer (and therefore
	 * secp256k1 for public keys), so it belongs to the crypto side of the
	 * library. `utils.buildWitnessUpdateOp` forwards to it.
	 */
	import type { Asset, PriceType } from 'dpixa/src/chain/asset';
	import type { WitnessSetPropertiesOperation } from 'dpixa/src/chain/operation';
	import type { PublicKey } from 'dpixa/src/crypto';
	export interface WitnessProps {
	    account_creation_fee?: string | Asset;
	    account_subsidy_budget?: number;
	    account_subsidy_decay?: number;
	    key: PublicKey | string;
	    maximum_block_size?: number;
	    new_signing_key?: PublicKey | string | null;
	    /** PXS price feed: PXS per PIXA. Written as the node's `hbd_exchange_rate` property. */
	    pxs_exchange_rate?: PriceType;
	    /** Fixed at 0 on Pixa. Written as the node's `hbd_interest_rate` property. */
	    pxs_interest_rate?: number;
	    /** Same as `pxs_exchange_rate`, under the node's name. */
	    hbd_exchange_rate?: PriceType;
	    /** Same as `pxs_interest_rate`, under the node's name. */
	    hbd_interest_rate?: number;
	    url?: string;
	}
	export const buildWitnessUpdateOp: (owner: string, props: WitnessProps) => WitnessSetPropertiesOperation;

}
declare module 'dpixa/src/crypto-registry' {
	/**
	 * @file Late binding between the fetch-only client and the crypto module.
	 *
	 * The lite entry point (Client, BroadcastAPI, utils, Authority, …) must not
	 * import secp256k1, the hash functions or AES, or bundlers would pull them
	 * into the first download. The few lite features that need crypto — signing
	 * and broadcasting, `utils.buildWitnessUpdateOp`, `Authority.from(PublicKey)`
	 * — look the implementation up here instead. `./crypto` registers itself as
	 * soon as it is evaluated, so loading `@pixagram/dpixa/crypto` (or the full
	 * `@pixagram/dpixa`) anywhere in the app is enough to enable them.
	 */
	import type { cryptoUtils, PrivateKey, PublicKey } from 'dpixa/src/crypto';
	import type { buildWitnessUpdateOp } from 'dpixa/src/witness';
	export interface CryptoProvider {
	    PrivateKey: typeof PrivateKey;
	    PublicKey: typeof PublicKey;
	    signTransaction: typeof cryptoUtils.signTransaction;
	    generateTrxId: typeof cryptoUtils.generateTrxId;
	    buildWitnessUpdateOp: typeof buildWitnessUpdateOp;
	}
	/**
	 * Called by ./crypto when it is loaded.
	 */
	export const registerCrypto: (implementation: CryptoProvider) => void;
	/**
	 * The crypto implementation, or undefined if it has not been loaded.
	 */
	export const peekCrypto: () => CryptoProvider | undefined;
	/**
	 * The crypto implementation; throws a descriptive error if it has not been
	 * loaded yet.
	 * @param feature What the caller was trying to do, for the error message.
	 */
	export const requireCrypto: (feature: string) => CryptoProvider;

}
declare module 'dpixa/src/chain/account' {
	/**
	 * @file Hive/Pixa account type definitions.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	import type { PublicKey } from 'dpixa/src/crypto';
	import { Asset } from 'dpixa/src/chain/asset';
	export interface AuthorityType {
	    weight_threshold: number;
	    account_auths: [string, number][];
	    key_auths: [string | PublicKey, number][];
	}
	export class Authority implements AuthorityType {
	    weight_threshold: number;
	    account_auths: [string, number][];
	    key_auths: [string | PublicKey, number][];
	    constructor({ weight_threshold, account_auths, key_auths }: AuthorityType);
	    /**
	     * Convenience to create a new instance from PublicKey or authority object.
	     */
	    static from(value: string | PublicKey | AuthorityType): Authority;
	}
	export interface Account {
	    id: number;
	    name: string;
	    owner: Authority;
	    active: Authority;
	    posting: Authority;
	    memo_key: string;
	    json_metadata: string;
	    posting_json_metadata: string;
	    proxy: string;
	    last_owner_update: string;
	    last_account_update: string;
	    created: string;
	    mined: boolean;
	    owner_challenged: boolean;
	    active_challenged: boolean;
	    last_owner_proved: string;
	    last_active_proved: string;
	    recovery_account: string;
	    reset_account: string;
	    last_account_recovery: string;
	    comment_count: number;
	    lifetime_vote_count: number;
	    post_count: number;
	    can_vote: boolean;
	    voting_power: number;
	    last_vote_time: string;
	    voting_manabar: {
	        current_mana: string | number;
	        last_update_time: number;
	    };
	    /** The downvote bar; see `RCAPI.calculateDownvoteMana`. */
	    downvote_manabar?: {
	        current_mana: string | number;
	        last_update_time: number;
	    };
	    balance: string | Asset;
	    savings_balance: string | Asset;
	    pxs_balance: string | Asset;
	    pxs_seconds: string;
	    pxs_seconds_last_update: string;
	    pxs_last_interest_payment: string;
	    savings_pxs_balance: string | Asset;
	    savings_pxs_seconds: string;
	    savings_pxs_seconds_last_update: string;
	    savings_pxs_last_interest_payment: string;
	    savings_withdraw_requests: number;
	    reward_pxs_balance: string | Asset;
	    reward_pixa_balance: string | Asset;
	    reward_vesting_balance: string | Asset;
	    reward_vesting_pixa: string | Asset;
	    curation_rewards: number | string;
	    posting_rewards: number | string;
	    vesting_shares: string | Asset;
	    delegated_vesting_shares: string | Asset;
	    received_vesting_shares: string | Asset;
	    vesting_withdraw_rate: string | Asset;
	    next_vesting_withdrawal: string;
	    withdrawn: number | string;
	    to_withdraw: number | string;
	    withdraw_routes: number;
	    proxied_vsf_votes: number[];
	    witnesses_voted_for: number;
	    average_bandwidth: number | string;
	    lifetime_bandwidth: number | string;
	    last_bandwidth_update: string;
	    average_market_bandwidth: number | string;
	    lifetime_market_bandwidth: number | string;
	    last_market_bandwidth_update: string;
	    last_post: string;
	    last_root_post: string;
	    /**
	     * Names the node uses for balances dpixa names after PIXA and PXS: an API node returns one set
	     * or the other.
	     */
	    hbd_balance?: string | Asset;
	    savings_hbd_balance?: string | Asset;
	    reward_hbd_balance?: string | Asset;
	    reward_hive_balance?: string | Asset;
	    reward_vesting_hive?: string | Asset;
	}
	export interface ExtendedAccount extends Account {
	    /**
	     * Convert vesting_shares to vesting pixa.
	     */
	    vesting_balance: string | Asset;
	    reputation: string | number;
	    /**
	     * Transfer to/from vesting.
	     */
	    transfer_history: any[];
	    /**
	     * Limit order / cancel / fill.
	     */
	    market_history: any[];
	    post_history: any[];
	    vote_history: any[];
	    other_history: any[];
	    witness_votes: string[];
	    tags_usage: string[];
	    guest_bloggers: string[];
	    open_orders?: any[];
	    comments?: any[];
	    blog?: any[];
	    feed?: any[];
	    recent_replies?: any[];
	    recommended?: any[];
	}

}
declare module 'dpixa/src/chain/misc' {
	import { Account } from 'dpixa/src/chain/account';
	import { Asset, Price } from 'dpixa/src/chain/asset';
	/**
	 * Large number that may be unsafe to represent natively in JavaScript.
	 */
	export type Bignum = string;
	/**
	 * Buffer wrapper that serializes to a hex-encoded string.
	 */
	export class HexBuffer {
	    buffer: any;
	    constructor(buffer: any);
	    /**
	     * Convenience to create a new HexBuffer, does not copy data if value passed is already a buffer.
	     *
	     * Accepts any Uint8Array-backed buffer, which includes the bundled BBuffer,
	     * Node's native Buffer, and plain Uint8Array. Previously the parameter was
	     * typed as just `Buffer` (= BBuffer in this file) which rejected Node
	     * Buffers even though they work identically at runtime — broke the
	     * operations test suite under strict TS.
	     */
	    static from(value: Uint8Array | HexBuffer | number[] | string): HexBuffer;
	    toString(encoding?: 'hex' | 'binary' | 'utf-8' | 'utf8' | 'latin1'): string;
	    toJSON(): string;
	}
	/**
	 * Chain roperties that are decided by the witnesses.
	 */
	export interface ChainProperties {
	    /**
	     * This fee, paid in PIXA, is converted into VESTING SHARES for the new account. Accounts
	     * without vesting shares cannot earn usage rations and therefore are powerless. This minimum
	     * fee requires all accounts to have some kind of commitment to the network that includes the
	     * ability to vote and make transactions.
	     *
	     * @remarks This has to be multiplied by STEEMIT ? `CREATE_ACCOUNT_WITH_PIXA_MODIFIER`
	     * (defined as 30 on the main chain) to get the minimum fee needed to create an account.
	     *
	     */
	    account_creation_fee: string | Asset;
	    /**
	     * This witnesses vote for the maximum_block_size which is used by the network
	     * to tune rate limiting and capacity.
	     */
	    maximum_block_size: number;
	    /**
	     * The PXS interest percentage rate decided by witnesses, expressed 0 to 10000 (fixed at 0
	     * on Pixa). The node names it `hbd_interest_rate`; dpixa accepts either name in
	     * `witness_update` and writes both when it signs.
	     */
	    pxs_interest_rate?: number;
	    /** Same as `pxs_interest_rate`, under the name the node uses. */
	    hbd_interest_rate?: number;
	}
	export interface VestingDelegation {
	    /**
	     * Delegation id.
	     */
	    id: number;
	    /**
	     * Account that is delegating vests to delegatee.
	     */
	    delegator: string;
	    /**
	     * Account that is receiving vests from delegator.
	     */
	    delegatee: string;
	    /**
	     * Amount of VESTS delegated.
	     */
	    vesting_shares: Asset | string;
	    /**
	     * Earliest date delegation can be removed.
	     */
	    min_delegation_time: string;
	}
	/**
	 * Node state.
	 */
	export interface DynamicGlobalProperties {
	    id: number;
	    /**
	     * Current block height.
	     */
	    head_block_number: number;
	    head_block_id: string;
	    /**
	     * UTC Server time, e.g. 2020-01-15T00:42:00
	     */
	    time: string;
	    /**
	     * Currently elected witness.
	     */
	    current_witness: string;
	    /**
	     * The total POW accumulated, aka the sum of num_pow_witness at the time
	     * new POW is added.
	     */
	    total_pow: number;
	    /**
	     * The current count of how many pending POW witnesses there are, determines
	     * the difficulty of doing pow.
	     */
	    num_pow_witnesses: number;
	    virtual_supply: Asset | string;
	    current_supply: Asset | string;
	    /**
	     * Total asset held in confidential balances.
	     */
	    confidential_supply: Asset | string;
	    current_pxs_supply: Asset | string;
	    /**
	     * Total asset held in confidential balances.
	     */
	    confidential_pxs_supply: Asset | string;
	    total_vesting_fund_pixa: Asset | string;
	    total_vesting_shares: Asset | string;
	    total_reward_fund_pixa: Asset | string;
	    /**
	     * The running total of REWARD^2.
	     */
	    total_reward_shares2: string;
	    pending_rewarded_vesting_shares: Asset | string;
	    pending_rewarded_vesting_pixa: Asset | string;
	    /**
	     * This property defines the interest rate that PXS deposits receive.
	     */
	    pxs_interest_rate: number;
	    pxs_print_rate: number;
	    /**
	     * Average block size is updated every block to be:
	     *
	     * average_block_size = (99 * average_block_size + new_block_size) / 100
	     *
	     * This property is used to update the current_reserve_ratio to maintain
	     * approximately 50% or less utilization of network capacity.
	     */
	    average_block_size: number;
	    /**
	     * Maximum block size is decided by the set of active witnesses which change every round.
	     * Each witness posts what they think the maximum size should be as part of their witness
	     * properties, the median size is chosen to be the maximum block size for the round.
	     *
	     * @remarks the minimum value for maximum_block_size is defined by the protocol to prevent the
	     * network from getting stuck by witnesses attempting to set this too low.
	     */
	    maximum_block_size: number;
	    /**
	     * The current absolute slot number. Equal to the total
	     * number of slots since genesis. Also equal to the total
	     * number of missed slots plus head_block_number.
	     */
	    current_aslot: number;
	    /**
	     * Used to compute witness participation.
	     */
	    recent_slots_filled: Bignum;
	    participation_count: number;
	    last_irreversible_block_num: number;
	    /**
	     * The maximum bandwidth the blockchain can support is:
	     *
	     * max_bandwidth = maximum_block_size * BANDWIDTH_AVERAGE_WINDOW_SECONDS / BLOCK_INTERVAL
	     *
	     * The maximum virtual bandwidth is:
	     *
	     * max_bandwidth * current_reserve_ratio
	     */
	    max_virtual_bandwidth: Bignum;
	    /**
	     * Any time average_block_size <= 50% maximum_block_size this value grows by 1 until it
	     * reaches MAX_RESERVE_RATIO.  Any time average_block_size is greater than
	     * 50% it falls by 1%.  Upward adjustments happen once per round, downward adjustments
	     * happen every block.
	     */
	    current_reserve_ratio: number;
	    /**
	     * Full votes a full voting bar holds, per day of refill: a 100% vote costs
	     * `86400 / (vote_power_reserve_rate * voting_mana_regeneration_seconds)` of the bar.
	     * 10 before hardfork 32 (2% per full vote), 5 from it (3%).
	     */
	    vote_power_reserve_rate: number;
	    /**
	     * Seconds an empty voting bar takes to refill (the downvote bar too). A global property from
	     * hardfork 32: 576,000 (6 days 16 hours, 15% a day); older nodes leave it out, and the
	     * refill time was then 432,000 (5 days, 20% a day).
	     */
	    voting_mana_regeneration_seconds?: number;
	    /**
	     * Seconds before vesting shares taken back from a delegation can be delegated again:
	     * 604,800 (7 days) from hardfork 32, 432,000 (5 days) before.
	     */
	    delegation_return_period?: number;
	    /** Size of the downvote bar, in basis points of the voting bar. */
	    downvote_pool_percent?: number;
	    /**
	     * Names the node uses for fields that dpixa names after PIXA and PXS: an API node returns one
	     * set or the other. {@link getVestingSharePrice} reads either.
	     */
	    total_vesting_fund_hive?: Asset | string;
	    current_hbd_supply?: Asset | string;
	    hbd_interest_rate?: number;
	    hbd_print_rate?: number;
	    pending_rewarded_vesting_hive?: Asset | string;
	}
	/** Refill time of the voting bar before hardfork 32, in seconds (5 days). */
	export const VOTING_MANA_REGENERATION_SECONDS_PRE_HF32 = 432000;
	/**
	 * Refill time of the voting bar that `props` describes: `voting_mana_regeneration_seconds`, or
	 * 432,000 (5 days) when the node predates hardfork 32 and leaves it out.
	 */
	export function getVotingManaRegenerationSeconds(props?: Partial<DynamicGlobalProperties>): number;
	/**
	 * Return the vesting share price.
	 */
	export function getVestingSharePrice(props: DynamicGlobalProperties): Price;
	/**
	 * Returns the vests of specified account. Default: Subtract delegated & add received
	 */
	export function getVests(account: Account, subtract_delegated?: boolean, add_received?: boolean): number;

}
declare module 'dpixa/src/chain/serializer' {
	/**
	 * @file Hive/Pixa protocol serialization.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	import { BBuffer as Buffer } from 'dpixa/src/bytebuffer';
	import { PublicKey } from 'dpixa/src/crypto';
	import { Asset } from 'dpixa/src/chain/asset';
	import { HexBuffer } from 'dpixa/src/chain/misc';
	import { NftActionInput, Operation } from 'dpixa/src/chain/operation';
	export type Serializer = (buffer: any, data: any) => void;
	/** A field of an object serializer: name, serializer and, optionally, a second name. */
	export type FieldDefinition = [string, Serializer] | [string, Serializer, string];
	export const Types: {
	    Array: (itemSerializer: Serializer) => (buffer: any, data: any[]) => void;
	    Asset: (buffer: any, data: Asset | string | number) => void;
	    Authority: (buffer: any, data: {
	        [key: string]: any;
	    }) => void;
	    Binary: (size?: number) => (buffer: any, data: Buffer | HexBuffer) => void;
	    Boolean: (buffer: any, data: boolean) => void;
	    Date: (buffer: any, data: string) => void;
	    EncryptedMemo: (buffer: any, data: {
	        [key: string]: any;
	    }) => void;
	    FlatMap: (keySerializer: Serializer, valueSerializer: Serializer) => (buffer: any, data: [any, any][]) => void;
	    Int16: (buffer: any, data: number) => void;
	    Int32: (buffer: any, data: number) => void;
	    Int64: (buffer: any, data: number) => void;
	    Int8: (buffer: any, data: number) => void;
	    NftAction: (buffer: any, data: NftActionInput) => void;
	    Object: (keySerializers: FieldDefinition[]) => (buffer: any, data: {
	        [key: string]: any;
	    }) => void;
	    Operation: (buffer: any, operation: Operation) => void;
	    Optional: (valueSerializer: Serializer) => (buffer: any, data: any) => void;
	    Price: (buffer: any, data: {
	        [key: string]: any;
	    }) => void;
	    PublicKey: (buffer: any, data: PublicKey | string | null) => void;
	    StaticVariant: (itemSerializers: Serializer[]) => (buffer: any, data: [number, any]) => void;
	    String: (buffer: any, data: string) => void;
	    Transaction: (buffer: any, data: {
	        [key: string]: any;
	    }) => void;
	    UInt16: (buffer: any, data: number) => void;
	    UInt32: (buffer: any, data: number) => void;
	    UInt64: (buffer: any, data: number) => void;
	    UInt8: (buffer: any, data: number) => void;
	    Void: (_buffer: any) => never;
	};

}
declare module 'dpixa/src/crypto' {
	/**
	 * @file Hive crypto helpers.
	 * @author Johan Nordberg <code@johan-nordberg.com>
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
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
	import { BBuffer as Buffer } from 'dpixa/src/bbuffer';
	import ByteBuffer from 'dpixa/src/bytebuffer';
	import { SignedTransaction, Transaction } from 'dpixa/src/chain/transaction'; function ripemd160(input: Uint8Array | Buffer | string): Buffer; function sha256(input: Uint8Array | Buffer | string): Buffer; function doubleSha256(input: Uint8Array | Buffer | string): Buffer;
	/**
	 * Network id used in WIF-encoding.
	 */
	export const NETWORK_ID: Buffer; function encodePublic(key: Buffer, prefix: string): string; function encodePrivate(key: Buffer): string; function decodePrivate(encodedKey: string): Buffer; function isCanonicalSignature(signature: Uint8Array | Buffer | ArrayLike<number>): boolean; function isWif(privWif: string | Buffer): boolean;
	/**
	 * ECDSA (secp256k1) public key.
	 */
	export class PublicKey {
	    readonly key: any;
	    readonly prefix: string;
	    readonly uncompressed: Buffer;
	    constructor(key: any, prefix?: string);
	    static fromBuffer(key: ByteBuffer): {
	        key: ByteBuffer;
	    };
	    /**
	     * Create a new instance from a WIF-encoded key.
	     */
	    static fromString(wif: string): PublicKey;
	    /**
	     * Create a new instance.
	     */
	    static from(value: string | PublicKey): PublicKey;
	    /**
	     * Verify a 32-byte signature.
	     * @param message 32-byte message to verify.
	     * @param signature Signature to verify.
	     */
	    verify(message: Buffer, signature: Signature): boolean;
	    /**
	     * Return a WIF-encoded representation of the key.
	     */
	    toString(): string;
	    /**
	     * Return JSON representation of this key, same as toString().
	     */
	    toJSON(): string;
	    /**
	     * Used by `utils.inspect` and `console.log` in node.js.
	     */
	    inspect(): string;
	}
	export type KeyRole = 'owner' | 'active' | 'posting' | 'memo';
	/**
	 * ECDSA (secp256k1) private key.
	 */
	export class PrivateKey {
	    private key;
	    secret: Buffer;
	    constructor(key: Buffer);
	    /**
	     * Convenience to create a new instance from WIF string or buffer.
	     */
	    static from(value: string | Buffer): PrivateKey;
	    /**
	     * Create a new instance from a WIF-encoded key.
	     */
	    static fromString(wif: string): PrivateKey;
	    /**
	     * Create a new instance from a seed.
	     */
	    static fromSeed(seed: string): PrivateKey;
	    /**
	     * Create key from username and password.
	     */
	    static fromLogin(username: string, password: string, role?: KeyRole): PrivateKey;
	    /**
	     * Multiply a public key by this private key's scalar. Equivalent to the old
	     * secp256k1-node `publicKeyTweakMul(pub, secret, compressed=false)`.
	     *
	     * Implemented via noble's Point math: convert pub bytes to a Point, convert
	     * this.key (big-endian 32-byte scalar) to a bigint, multiply, and re-encode
	     * as uncompressed (matching the old `false` compressed flag).
	     */
	    multiply(pub: any): Buffer;
	    /**
	     * Sign message.
	     * @param message 32-byte message (typically a sha256 digest).
	     *
	     * Noble's sync `sign` is deterministic RFC6979 with `lowS` enforced, BUT
	     * "lowS" only constrains `s <= n/2`. The Hive/Pixa wire format additionally
	     * requires both `r` and `s` to have their high byte bit clear (see
	     * `isCanonicalSignature`) — a stricter predicate than lowS. Roughly a
	     * quarter of RFC6979 signatures fail it, so we reproduce the original
	     * secp256k1-node retry loop: perturb the RFC6979 nonce via `extraEntropy`
	     * until the resulting signature passes `isCanonicalSignature`.
	     *
	     * Important: `extraEntropy` only mixes into nonce derivation — it does NOT
	     * change the message being signed. The returned signature still verifies
	     * (and recovers) against the original `message`.
	     *
	     * `prehash: false` because `message` is already a digest; noble would
	     * otherwise sha256 it a second time.
	     */
	    sign(message: Buffer): Signature;
	    /**
	     * Derive the public key for this private key.
	     */
	    createPublic(prefix?: string): PublicKey;
	    /**
	     * Return a WIF-encoded representation of the key.
	     */
	    toString(): string;
	    /**
	     * Used by `utils.inspect` and `console.log` in node.js. Does not show the full key
	     * to get the full encoded key you need to explicitly call {@link toString}.
	     */
	    inspect(): string;
	    /**
	     * Get shared secret for memo cryptography.
	     *
	     * The Hive/Pixa memo protocol is: multiply peer's pubkey point by our
	     * private scalar, take the 32-byte x-coordinate, sha512 it. `getSharedSecret`
	     * returns the compressed-encoded shared point (33 bytes: parity byte + x);
	     * slicing off byte 0 gives us exactly the x-coordinate the protocol wants.
	     *
	     * This replaces the previous bigi + ecurve point multiplication. Verified
	     * that both paths produce byte-for-byte identical output.
	     */
	    get_shared_secret(public_key: PublicKey): Buffer;
	}
	/**
	 * ECDSA (secp256k1) signature.
	 */
	export class Signature {
	    data: Buffer;
	    recovery: number;
	    constructor(data: Uint8Array | Buffer | ArrayLike<number>, recovery: number);
	    static fromBuffer(buffer: Buffer): Signature;
	    static fromString(string: string): Signature;
	    /**
	     * Recover public key from signature by providing original signed message.
	     * @param message 32-byte message that was used to create the signature.
	     *
	     * `@noble/secp256k1` v3's `recoverPublicKey` takes the "recovered" format:
	     * a 65-byte Uint8Array laid out as [recovery_byte(1) || r(32) || s(32)].
	     * Note that's *recovery first*, unlike our internal wire format
	     * (`toBuffer` below) which puts `recovery + 31` first then the 64-byte
	     * compact sig. Same shape, different byte values — we just rebuild it.
	     *
	     * `prehash: false` because the message is already a sha256 digest.
	     */
	    recover(message: Buffer, prefix?: string): PublicKey;
	    toBuffer(): Buffer;
	    toString(): string;
	} function transactionDigest(transaction: Transaction | SignedTransaction, chainId?: Buffer): Buffer; function signTransaction(transaction: Transaction, keys: PrivateKey | PrivateKey[], chainId?: Buffer): SignedTransaction; function generateTrxId(transaction: Transaction): string;
	/** Misc crypto utility functions. */
	export const cryptoUtils: {
	    decodePrivate: typeof decodePrivate;
	    doubleSha256: typeof doubleSha256;
	    encodePrivate: typeof encodePrivate;
	    encodePublic: typeof encodePublic;
	    generateTrxId: typeof generateTrxId;
	    isCanonicalSignature: typeof isCanonicalSignature;
	    isWif: typeof isWif;
	    ripemd160: typeof ripemd160;
	    sha256: typeof sha256;
	    signTransaction: typeof signTransaction;
	    transactionDigest: typeof transactionDigest;
	};
	export {};

}
declare module 'dpixa/src/chain/block' {
	/**
	 * @file Hive/Pixa block type definitions.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	import { Transaction } from 'dpixa/src/chain/transaction';
	/**
	 * Unsigned block header.
	 */
	export interface BlockHeader {
	    previous: string;
	    timestamp: string;
	    witness: string;
	    transaction_merkle_root: string;
	    extensions: any[];
	}
	/**
	 * Signed block header.
	 */
	export interface SignedBlockHeader extends BlockHeader {
	    witness_signature: string;
	}
	/**
	 * Full signed block.
	 */
	export interface SignedBlock extends SignedBlockHeader {
	    block_id: string;
	    signing_key: string;
	    transaction_ids: string[];
	    transactions: Transaction[];
	}

}
declare module 'dpixa/src/chain/comment' {
	/**
	 * @file Hive/Pixa type definitions related to comments and posting.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	import { Asset } from 'dpixa/src/chain/asset';
	export interface Comment {
	    id: number;
	    category: string;
	    parent_author: string;
	    parent_permlink: string;
	    author: string;
	    permlink: string;
	    title: string;
	    body: string;
	    json_metadata: string;
	    last_update: string;
	    created: string;
	    active: string;
	    last_payout: string;
	    depth: number;
	    children: number;
	    net_rshares: string;
	    abs_rshares: string;
	    vote_rshares: string;
	    children_abs_rshares: string;
	    cashout_time: string;
	    max_cashout_time: string;
	    total_vote_weight: number;
	    reward_weight: number;
	    total_payout_value: Asset | string;
	    curator_payout_value: Asset | string;
	    author_rewards: string;
	    net_votes: number;
	    root_comment: number;
	    max_accepted_payout: string;
	    /** Share of the payout paid in PXS, basis points. An API node writes it `percent_pxs` or `percent_hbd`. */
	    percent_pxs?: number;
	    percent_hbd?: number;
	    allow_replies: boolean;
	    allow_votes: boolean;
	    allow_curation_rewards: boolean;
	    beneficiaries: BeneficiaryRoute[];
	}
	/**
	 * Discussion a.k.a. Post.
	 */
	export interface Discussion extends Comment {
	    url: string;
	    root_title: string;
	    pending_payout_value: Asset | string;
	    total_pending_payout_value: Asset | string;
	    active_votes: any[];
	    replies: string[];
	    author_reputation: number;
	    /**
	     * PXS burned to promote the post, `"0.000 PXS"` when none (Pixamind); see
	     * `PixamindAPI.getPromotedPosts` and `BroadcastAPI.promote`.
	     */
	    promoted: Asset | string;
	    /**
	     * True when the post is minted as an NFT (hardfork 32); every post Pixamind returns carries it.
	     * A minted post can no longer be edited or deleted. Its NFT: `client.nft.getNft(author, permlink)`
	     * or `client.pixamind.getNft(author, permlink)`.
	     */
	    nft_minted?: boolean;
	    body_length: string;
	    reblogged_by: any[];
	    first_reblogged_by?: any;
	    first_reblogged_on?: any;
	}
	export interface BeneficiaryRoute {
	    account: string;
	    weight: number;
	}

}
declare module 'dpixa/src/chain/operation' {
	/**
	 * @file Hive/Pixa operation type definitions.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	import type { PublicKey } from 'dpixa/src/crypto';
	import { AuthorityType } from 'dpixa/src/chain/account';
	import { Asset, PriceType } from 'dpixa/src/chain/asset';
	import { SignedBlockHeader } from 'dpixa/src/chain/block';
	import { BeneficiaryRoute } from 'dpixa/src/chain/comment';
	import { ChainProperties, HexBuffer } from 'dpixa/src/chain/misc';
	/**
	 * Operation name.
	 * Ref: libraries/protocol/include/hive/protocol/operations.hpp in
	 * https://github.com/pixagram-blockchain/pixagram
	 */
	export type OperationName = 'vote' | 'comment' | 'transfer' | 'transfer_to_vesting' | 'withdraw_vesting' | 'limit_order_create' | 'limit_order_cancel' | 'feed_publish' | 'convert' | 'account_create' | 'account_update' | 'witness_update' | 'account_witness_vote' | 'account_witness_proxy' | 'pow' | 'custom' | 'report_over_production' | 'delete_comment' | 'custom_json' | 'comment_options' | 'set_withdraw_vesting_route' | 'limit_order_create2' | 'claim_account' | 'create_claimed_account' | 'request_account_recovery' | 'recover_account' | 'change_recovery_account' | 'escrow_transfer' | 'escrow_dispute' | 'escrow_release' | 'pow2' | 'escrow_approve' | 'transfer_to_savings' | 'transfer_from_savings' | 'cancel_transfer_from_savings' | 'custom_binary' | 'decline_voting_rights' | 'nft' | 'set_reset_account' | 'claim_reward_balance' | 'delegate_vesting_shares' | 'account_create_with_delegation' | 'witness_set_properties' | 'account_update2' | 'create_proposal' | 'update_proposal_votes' | 'remove_proposal' | 'update_proposal' | 'collateralized_convert' | 'recurrent_transfer';
	/**
	 * Virtual operation name. The last regular operation is recurrent_transfer (49), so
	 * `last_regular + 1` is 50; {@link utils.operationOrders} has every number.
	 *
	 * Four operations have two names here: the node writes `dhf_funding`, `hardfork_hive`,
	 * `hardfork_hive_restore` and `dhf_conversion`; `sps_fund`, `hardfork_pixa`,
	 * `hardfork_pixa_restore` and `sps_convert` are the names earlier dpixa versions used.
	 */
	export type VirtualOperationName = 'fill_convert_request' | 'author_reward' | 'curation_reward' | 'comment_reward' | 'liquidity_reward' | 'interest' | 'fill_vesting_withdraw' | 'fill_order' | 'shutdown_witness' | 'fill_transfer_from_savings' | 'hardfork' | 'comment_payout_update' | 'return_vesting_delegation' | 'comment_benefactor_reward' | 'producer_reward' | 'clear_null_account_balance' | 'proposal_pay' | 'dhf_funding' | 'sps_fund' | 'hardfork_hive' | 'hardfork_pixa' | 'hardfork_hive_restore' | 'hardfork_pixa_restore' | 'delayed_voting' | 'consolidate_treasury_balance' | 'effective_comment_vote' | 'ineffective_delete_comment' | 'dhf_conversion' | 'sps_convert' | 'expired_account_notification' | 'changed_recovery_account' | 'transfer_to_vesting_completed' | 'pow_reward' | 'vesting_shares_split' | 'account_created' | 'fill_collateralized_convert_request' | 'system_warning' | 'fill_recurrent_transfer' | 'failed_recurrent_transfer' | 'limit_order_cancelled' | 'producer_missed' | 'proposal_fee' | 'collateralized_convert_immediate_conversion' | 'escrow_approved' | 'escrow_rejected' | 'proxy_cleared' | 'declined_voting_rights' | 'nft_sold' | 'nft_royalty';
	/**
	 * Generic operation.
	 */
	export interface Operation {
	    0: OperationName | VirtualOperationName;
	    1: {
	        [key: string]: any;
	    };
	}
	export interface AppliedOperation {
	    trx_id: string;
	    block: number;
	    trx_in_block: number;
	    op_in_trx: number;
	    virtual_op: number;
	    timestamp: string;
	    op: Operation;
	}
	export interface AccountCreateOperation extends Operation {
	    0: 'account_create';
	    1: {
	        fee: string | Asset;
	        creator: string;
	        new_account_name: string;
	        owner: AuthorityType;
	        active: AuthorityType;
	        posting: AuthorityType;
	        memo_key: string | PublicKey;
	        json_metadata: string;
	    };
	}
	export interface AccountCreateWithDelegationOperation extends Operation {
	    0: 'account_create_with_delegation';
	    1: {
	        fee: string | Asset;
	        delegation: string | Asset;
	        creator: string;
	        new_account_name: string;
	        owner: AuthorityType;
	        active: AuthorityType;
	        posting: AuthorityType;
	        memo_key: string | PublicKey;
	        json_metadata: string;
	        /**
	         * Extensions. Not currently used.
	         */
	        extensions: any[];
	    };
	}
	export interface AccountUpdateOperation extends Operation {
	    0: 'account_update';
	    1: {
	        account: string;
	        owner?: AuthorityType;
	        active?: AuthorityType;
	        posting?: AuthorityType;
	        memo_key: string | PublicKey;
	        json_metadata: string;
	    };
	}
	export interface AccountWitnessProxyOperation extends Operation {
	    0: 'account_witness_proxy';
	    1: {
	        account: string;
	        proxy: string;
	    };
	}
	export interface AccountWitnessVoteOperation extends Operation {
	    0: 'account_witness_vote';
	    1: {
	        account: string;
	        witness: string;
	        approve: boolean;
	    };
	}
	export interface CancelTransferFromSavingsOperation extends Operation {
	    0: 'cancel_transfer_from_savings';
	    1: {
	        from: string;
	        request_id: number;
	    };
	}
	/**
	 * Each account lists another account as their recovery account.
	 * The recovery account has the ability to create account_recovery_requests
	 * for the account to recover. An account can change their recovery account
	 * at any time with a 30 day delay. This delay is to prevent
	 * an attacker from changing the recovery account to a malicious account
	 * during an attack. These 30 days match the 30 days that an
	 * owner authority is valid for recovery purposes.
	 *
	 * On account creation the recovery account is set either to the creator of
	 * the account (The account that pays the creation fee and is a signer on the transaction)
	 * or to the empty string if the account was mined. An account with no recovery
	 * has the top voted witness as a recovery account, at the time the recover
	 * request is created. Note: This does mean the effective recovery account
	 * of an account with no listed recovery account can change at any time as
	 * witness vote weights. The top voted witness is explicitly the most trusted
	 * witness according to stake.
	 */
	export interface ChangeRecoveryAccountOperation extends Operation {
	    0: 'change_recovery_account';
	    1: {
	        /**
	         * The account that would be recovered in case of compromise.
	         */
	        account_to_recover: string;
	        /**
	         * The account that creates the recover request.
	         */
	        new_recovery_account: string;
	        /**
	         * Extensions. Not currently used.
	         */
	        extensions: any[];
	    };
	}
	/**
	 * Moves pending rewards to the account's balances. Signed with the posting key.
	 *
	 * The node names the first two fields `reward_hive` and `reward_hbd`; dpixa also accepts
	 * `reward_pixa` and `reward_pxs`, and writes both names when it signs, so the node reads the
	 * amounts that were signed. Give each amount under one of its names.
	 */
	export interface ClaimRewardBalanceOperation extends Operation {
	    0: 'claim_reward_balance';
	    1: {
	        account: string;
	        /** PIXA to claim (node name: `reward_hive`). */
	        reward_pixa?: string | Asset;
	        /** PXS to claim (node name: `reward_hbd`). */
	        reward_pxs?: string | Asset;
	        reward_hive?: string | Asset;
	        reward_hbd?: string | Asset;
	        reward_vests: string | Asset;
	    };
	}
	export interface ClaimAccountOperation extends Operation {
	    0: 'claim_account';
	    1: {
	        creator: string;
	        fee: string | Asset;
	        /**
	         * Extensions. Not currently used.
	         */
	        extensions: any[];
	    };
	}
	export interface CommentOperation extends Operation {
	    0: 'comment';
	    1: {
	        parent_author: string;
	        parent_permlink: string;
	        author: string;
	        permlink: string;
	        title: string;
	        body: string;
	        json_metadata: string;
	    };
	}
	/**
	 * Payout options of a post or comment, set before its first vote.
	 *
	 * The node names the PXS share `percent_hbd`; dpixa also accepts `percent_pxs` and writes both
	 * names when it signs, so the node reads the value that was signed. Give it under one name.
	 */
	export interface CommentOptionsOperation extends Operation {
	    0: 'comment_options';
	    1: {
	        author: string;
	        permlink: string;
	        /** PXS value of the maximum payout this post will receive. */
	        max_accepted_payout: Asset | string;
	        /**
	         * Share of the payout paid in PXS, in basis points (10000 = 100%); the rest is paid as
	         * Pixa Power. Node name: `percent_hbd`.
	         */
	        percent_pxs?: number;
	        /** Same as `percent_pxs`, under the name the node uses. */
	        percent_hbd?: number;
	        /** Whether to allow post to receive votes. */
	        allow_votes: boolean;
	        /** Whether to allow post to recieve curation rewards. */
	        allow_curation_rewards: boolean;
	        extensions: [0, {
	            beneficiaries: BeneficiaryRoute[];
	        }][];
	    };
	}
	export interface ConvertOperation extends Operation {
	    0: 'convert';
	    1: {
	        owner: string;
	        requestid: number;
	        amount: Asset | string;
	    };
	}
	export interface CreateClaimedAccountOperation extends Operation {
	    0: 'create_claimed_account';
	    1: {
	        creator: string;
	        new_account_name: string;
	        owner: AuthorityType;
	        active: AuthorityType;
	        posting: AuthorityType;
	        memo_key: string | PublicKey;
	        json_metadata: string;
	        /**
	         * Extensions. Not currently used.
	         */
	        extensions: any[];
	    };
	}
	export interface CustomOperation extends Operation {
	    0: 'custom';
	    1: {
	        required_auths: string[];
	        id: number;
	        data: Buffer | HexBuffer | number[];
	    };
	}
	export interface CustomBinaryOperation extends Operation {
	    0: 'custom_binary';
	    1: {
	        required_owner_auths: string[];
	        required_active_auths: string[];
	        required_posting_auths: string[];
	        required_auths: AuthorityType[];
	        /**
	         * ID string, must be less than 32 characters long.
	         */
	        id: string;
	        data: Buffer | HexBuffer | number[];
	    };
	}
	export interface CustomJsonOperation extends Operation {
	    0: 'custom_json';
	    1: {
	        required_auths: string[];
	        required_posting_auths: string[];
	        /**
	         * ID string, must be less than 32 characters long.
	         */
	        id: string;
	        /**
	         * JSON encoded string, must be valid JSON.
	         */
	        json: string;
	    };
	}
	export interface DeclineVotingRightsOperation extends Operation {
	    0: 'decline_voting_rights';
	    1: {
	        account: string;
	        decline: boolean;
	    };
	}
	export interface DelegateVestingSharesOperation extends Operation {
	    0: 'delegate_vesting_shares';
	    1: {
	        /**
	         * The account delegating vesting shares.
	         */
	        delegator: string;
	        /**
	         * The account receiving vesting shares.
	         */
	        delegatee: string;
	        /**
	         * The amount of vesting shares delegated.
	         */
	        vesting_shares: string | Asset;
	    };
	}
	export interface DeleteCommentOperation extends Operation {
	    0: 'delete_comment';
	    1: {
	        author: string;
	        permlink: string;
	    };
	}
	/**
	 * The agent and to accounts must approve an escrow transaction for it to be valid on
	 * the blockchain. Once a part approves the escrow, the cannot revoke their approval.
	 * Subsequent escrow approve operations, regardless of the approval, will be rejected.
	 */
	export interface EscrowApproveOperation extends Operation {
	    0: 'escrow_approve';
	    1: {
	        from: string;
	        to: string;
	        agent: string;
	        /**
	         * Either to or agent.
	         */
	        who: string;
	        escrow_id: number;
	        approve: boolean;
	    };
	}
	/**
	 * If either the sender or receiver of an escrow payment has an issue, they can
	 * raise it for dispute. Once a payment is in dispute, the agent has authority over
	 * who gets what.
	 */
	export interface EscrowDisputeOperation extends Operation {
	    0: 'escrow_dispute';
	    1: {
	        from: string;
	        to: string;
	        agent: string;
	        who: string;
	        escrow_id: number;
	    };
	}
	/**
	 * This operation can be used by anyone associated with the escrow transfer to
	 * release funds if they have permission.
	 *
	 * The permission scheme is as follows:
	 * If there is no dispute and escrow has not expired, either party can release funds to the other.
	 * If escrow expires and there is no dispute, either party can release funds to either party.
	 * If there is a dispute regardless of expiration, the agent can release funds to either party
	 *    following whichever agreement was in place between the parties.
	 */
	export interface EscrowReleaseOperation extends Operation {
	    0: 'escrow_release';
	    1: {
	        from: string;
	        /**
	         * The original 'to'.
	         */
	        to: string;
	        agent: string;
	        /**
	         * The account that is attempting to release the funds, determines valid 'receiver'.
	         */
	        who: string;
	        /**
	         * The account that should receive funds (might be from, might be to).
	         */
	        receiver: string;
	        escrow_id: number;
	        /**
	         * The amount of PXS to release (node name: `hbd_amount`).
	         */
	        pxs_amount?: Asset | string;
	        /**
	         * The amount of PIXA to release (node name: `hive_amount`).
	         */
	        pixa_amount?: Asset | string;
	        hbd_amount?: Asset | string;
	        hive_amount?: Asset | string;
	    };
	}
	/**
	 * The purpose of this operation is to enable someone to send money contingently to
	 * another individual. The funds leave the *from* account and go into a temporary balance
	 * where they are held until *from* releases it to *to* or *to* refunds it to *from*.
	 *
	 * In the event of a dispute the *agent* can divide the funds between the to/from account.
	 * Disputes can be raised any time before or on the dispute deadline time, after the escrow
	 * has been approved by all parties.
	 *
	 * This operation only creates a proposed escrow transfer. Both the *agent* and *to* must
	 * agree to the terms of the arrangement by approving the escrow.
	 *
	 * The escrow agent is paid the fee on approval of all parties. It is up to the escrow agent
	 * to determine the fee.
	 *
	 * Escrow transactions are uniquely identified by 'from' and 'escrow_id', the 'escrow_id' is defined
	 * by the sender.
	 *
	 * The node names the amounts `hbd_amount` and `hive_amount`; dpixa also accepts `pxs_amount` and
	 * `pixa_amount` and writes both names when it signs. Give each amount under one of its names.
	 */
	export interface EscrowTransferOperation extends Operation {
	    0: 'escrow_transfer';
	    1: {
	        from: string;
	        to: string;
	        agent: string;
	        escrow_id: number;
	        /** PXS held in escrow (node name: `hbd_amount`). */
	        pxs_amount?: Asset | string;
	        /** PIXA held in escrow (node name: `hive_amount`). */
	        pixa_amount?: Asset | string;
	        hbd_amount?: Asset | string;
	        hive_amount?: Asset | string;
	        fee: Asset | string;
	        ratification_deadline: string;
	        escrow_expiration: string;
	        json_meta: string;
	    };
	}
	export interface FeedPublishOperation extends Operation {
	    0: 'feed_publish';
	    1: {
	        publisher: string;
	        exchange_rate: PriceType;
	    };
	}
	/**
	 * Cancels an order and returns the balance to owner.
	 */
	export interface LimitOrderCancelOperation extends Operation {
	    0: 'limit_order_cancel';
	    1: {
	        owner: string;
	        orderid: number;
	    };
	}
	/**
	 * This operation creates a limit order and matches it against existing open orders.
	 */
	export interface LimitOrderCreateOperation extends Operation {
	    0: 'limit_order_create';
	    1: {
	        owner: string;
	        orderid: number;
	        amount_to_sell: Asset | string;
	        min_to_receive: Asset | string;
	        fill_or_kill: boolean;
	        expiration: string;
	    };
	}
	/**
	 * This operation is identical to limit_order_create except it serializes the price rather
	 * than calculating it from other fields.
	 */
	export interface LimitOrderCreate2Operation extends Operation {
	    0: 'limit_order_create2';
	    1: {
	        owner: string;
	        orderid: number;
	        amount_to_sell: Asset | string;
	        exchange_rate: PriceType;
	        fill_or_kill: boolean;
	        expiration: string;
	    };
	}
	/**
	 * Legacy proof of work operation.
	 */
	export interface PowOperation extends Operation {
	    0: 'pow';
	    1: {
	        worker_account: string;
	        block_id: any;
	        nonce: number;
	        work: any;
	        props: any;
	    };
	}
	/**
	 * Legacy equihash proof of work operation.
	 */
	export interface Pow2Operation extends Operation {
	    0: 'pow2';
	    1: {
	        work: any;
	        new_owner_key?: string | PublicKey;
	        props: any;
	    };
	}
	/**
	 * Recover an account to a new authority using a previous authority and verification
	 * of the recovery account as proof of identity. This operation can only succeed
	 * if there was a recovery request sent by the account's recover account.
	 *
	 * In order to recover the account, the account holder must provide proof
	 * of past ownership and proof of identity to the recovery account. Being able
	 * to satisfy an owner authority that was used in the past 30 days is sufficient
	 * to prove past ownership. The get_owner_history function in the database API
	 * returns past owner authorities that are valid for account recovery.
	 *
	 * Proving identity is an off chain contract between the account holder and
	 * the recovery account. The recovery request contains a new authority which
	 * must be satisfied by the account holder to regain control. The actual process
	 * of verifying authority may become complicated, but that is an application
	 * level concern, not a blockchain concern.
	 *
	 * This operation requires both the past and future owner authorities in the
	 * operation because neither of them can be derived from the current chain state.
	 * The operation must be signed by keys that satisfy both the new owner authority
	 * and the recent owner authority. Failing either fails the operation entirely.
	 *
	 * If a recovery request was made inadvertantly, the account holder should
	 * contact the recovery account to have the request deleted.
	 *
	 * The two setp combination of the account recovery request and recover is
	 * safe because the recovery account never has access to secrets of the account
	 * to recover. They simply act as an on chain endorsement of off chain identity.
	 * In other systems, a fork would be required to enforce such off chain state.
	 * Additionally, an account cannot be permanently recovered to the wrong account.
	 * While any owner authority from the past 30 days can be used, including a compromised
	 * authority, the account can be continually recovered until the recovery account
	 * is confident a combination of uncompromised authorities were used to
	 * recover the account. The actual process of verifying authority may become
	 * complicated, but that is an application level concern, not the blockchain's
	 * concern.
	 */
	export interface RecoverAccountOperation extends Operation {
	    0: 'recover_account';
	    1: {
	        /**
	         * The account to be recovered.
	         */
	        account_to_recover: string;
	        /**
	         * The new owner authority as specified in the request account recovery operation.
	         */
	        new_owner_authority: AuthorityType;
	        /**
	         * A previous owner authority that the account holder will use to prove
	         * past ownership of the account to be recovered.
	         */
	        recent_owner_authority: AuthorityType;
	        /**
	         * Extensions. Not currently used.
	         */
	        extensions: any[];
	    };
	}
	/**
	 * This operation is used to report a miner who signs two blocks
	 * at the same time. To be valid, the violation must be reported within
	 * MAX_WITNESSES blocks of the head block (1 round) and the
	 * producer must be in the ACTIVE witness set.
	 *
	 * Users not in the ACTIVE witness set should not have to worry about their
	 * key getting compromised and being used to produced multiple blocks so
	 * the attacker can report it and steel their vesting pixa.
	 *
	 * The result of the operation is to transfer the full VESTING PIXA balance
	 * of the block producer to the reporter.
	 */
	export interface ReportOverProductionOperation extends Operation {
	    0: 'report_over_production';
	    1: {
	        reporter: string;
	        first_block: SignedBlockHeader;
	        second_block: SignedBlockHeader;
	    };
	}
	/**
	 * All account recovery requests come from a listed recovery account. This
	 * is secure based on the assumption that only a trusted account should be
	 * a recovery account. It is the responsibility of the recovery account to
	 * verify the identity of the account holder of the account to recover by
	 * whichever means they have agreed upon. The blockchain assumes identity
	 * has been verified when this operation is broadcast.
	 *
	 * This operation creates an account recovery request which the account to
	 * recover has 24 hours to respond to before the request expires and is
	 * invalidated.
	 *
	 * There can only be one active recovery request per account at any one time.
	 * Pushing this operation for an account to recover when it already has
	 * an active request will either update the request to a new new owner authority
	 * and extend the request expiration to 24 hours from the current head block
	 * time or it will delete the request. To cancel a request, simply set the
	 * weight threshold of the new owner authority to 0, making it an open authority.
	 *
	 * Additionally, the new owner authority must be satisfiable. In other words,
	 * the sum of the key weights must be greater than or equal to the weight
	 * threshold.
	 *
	 * This operation only needs to be signed by the the recovery account.
	 * The account to recover confirms its identity to the blockchain in
	 * the recover account operation.
	 */
	export interface RequestAccountRecoveryOperation extends Operation {
	    0: 'request_account_recovery';
	    1: {
	        /**
	         * The recovery account is listed as the recovery account on the account to recover.
	         */
	        recovery_account: string;
	        /**
	         * The account to recover. This is likely due to a compromised owner authority.
	         */
	        account_to_recover: string;
	        /**
	         * The new owner authority the account to recover wishes to have. This is secret
	         * known by the account to recover and will be confirmed in a recover_account_operation.
	         */
	        new_owner_authority: AuthorityType;
	        /**
	         * Extensions. Not currently used.
	         */
	        extensions: any[];
	    };
	}
	/**
	 * This operation allows 'account' owner to control which account has the power
	 * to execute the 'reset_account_operation' after 60 days.
	 */
	export interface SetResetAccountOperation extends Operation {
	    0: 'set_reset_account';
	    1: {
	        account: string;
	        current_reset_account: string;
	        reset_account: string;
	    };
	}
	/**
	 * Allows an account to setup a vesting withdraw but with the additional
	 * request for the funds to be transferred directly to another account's
	 * balance rather than the withdrawing account. In addition, those funds
	 * can be immediately vested again, circumventing the conversion from
	 * vests to pixa and back, guaranteeing they maintain their value.
	 */
	export interface SetWithdrawVestingRouteOperation extends Operation {
	    0: 'set_withdraw_vesting_route';
	    1: {
	        from_account: string;
	        to_account: string;
	        percent: number;
	        auto_vest: boolean;
	    };
	}
	/**
	 * Transfers asset from one account to another.
	 */
	export interface TransferOperation extends Operation {
	    0: 'transfer';
	    1: {
	        /**
	         * Sending account name.
	         */
	        from: string;
	        /**
	         * Receiving account name.
	         */
	        to: string;
	        /**
	         * Amount of PIXA or PXS to send.
	         */
	        amount: string | Asset;
	        /**
	         * Plain-text note attached to transaction.
	         */
	        memo: string;
	    };
	}
	export interface TransferFromSavingsOperation extends Operation {
	    0: 'transfer_from_savings';
	    1: {
	        from: string;
	        request_id: number;
	        to: string;
	        amount: string | Asset;
	        memo: string;
	    };
	}
	export interface TransferToSavingsOperation extends Operation {
	    0: 'transfer_to_savings';
	    1: {
	        amount: string | Asset;
	        from: string;
	        memo: string;
	        request_id: number;
	        to: string;
	    };
	}
	/**
	 * This operation converts PIXA into VFS (Vesting Fund Shares) at
	 * the current exchange rate. With this operation it is possible to
	 * give another account vesting shares so that faucets can
	 * pre-fund new accounts with vesting shares.
	 * (A.k.a. Powering Up)
	 */
	export interface TransferToVestingOperation extends Operation {
	    0: 'transfer_to_vesting';
	    1: {
	        from: string;
	        to: string;
	        /**
	         * Amount to power up, must be PIXA
	         */
	        amount: string | Asset;
	    };
	}
	export interface VoteOperation extends Operation {
	    0: 'vote';
	    1: {
	        voter: string;
	        author: string;
	        permlink: string;
	        /**
	         * Voting weight, 100% = 10000 (100_PERCENT).
	         */
	        weight: number;
	    };
	}
	/**
	 * At any given point in time an account can be withdrawing from their
	 * vesting shares. A user may change the number of shares they wish to
	 * cash out at any time between 0 and their total vesting stake.
	 *
	 * After applying this operation, vesting_shares will be withdrawn
	 * at a rate of vesting_shares/104 per week for two years starting
	 * one week after this operation is included in the blockchain.
	 *
	 * This operation is not valid if the user has no vesting shares.
	 * (A.k.a. Powering Down)
	 */
	export interface WithdrawVestingOperation extends Operation {
	    0: 'withdraw_vesting';
	    1: {
	        account: string;
	        /**
	         * Amount to power down, must be VESTS.
	         */
	        vesting_shares: string | Asset;
	    };
	}
	/**
	 * Users who wish to become a witness must pay a fee acceptable to
	 * the current witnesses to apply for the position and allow voting
	 * to begin.
	 *
	 * If the owner isn't a witness they will become a witness.  Witnesses
	 * are charged a fee equal to 1 weeks worth of witness pay which in
	 * turn is derived from the current share supply.  The fee is
	 * only applied if the owner is not already a witness.
	 *
	 * If the block_signing_key is null then the witness is removed from
	 * contention.  The network will pick the top 21 witnesses for
	 * producing blocks.
	 */
	export interface WitnessUpdateOperation extends Operation {
	    0: 'witness_update';
	    1: {
	        owner: string;
	        /**
	         * URL for witness, usually a link to a post in the witness-category tag.
	         */
	        url: string;
	        block_signing_key: string | PublicKey | null;
	        props: ChainProperties;
	        /**
	         * The fee paid to register a new witness, should be 10x current block production pay.
	         */
	        fee: string | Asset;
	    };
	}
	export interface WitnessSetPropertiesOperation extends Operation {
	    0: 'witness_set_properties';
	    1: {
	        owner: string;
	        props: [string, string][];
	        extensions: any[];
	    };
	}
	export interface AccountUpdate2Operation extends Operation {
	    0: 'account_update2';
	    1: {
	        account: string;
	        owner?: AuthorityType;
	        active?: AuthorityType;
	        posting?: AuthorityType;
	        memo_key?: string | PublicKey;
	        json_metadata: string;
	        posting_json_metadata: string;
	        extensions: any[];
	    };
	}
	export interface CreateProposalOperation extends Operation {
	    0: 'create_proposal';
	    1: {
	        creator: string;
	        receiver: string;
	        start_date: string;
	        end_date: string;
	        daily_pay: Asset | string;
	        subject: string;
	        permlink: string;
	        extensions: any[];
	    };
	}
	export interface UpdateProposalVotesOperation extends Operation {
	    0: 'update_proposal_votes';
	    1: {
	        voter: string;
	        proposal_ids: number[];
	        approve: boolean;
	        extensions: any[];
	    };
	}
	export interface RemoveProposalOperation extends Operation {
	    0: 'remove_proposal';
	    1: {
	        proposal_owner: string;
	        proposal_ids: number[];
	        extensions: any[];
	    };
	}
	export interface UpdateProposalOperation extends Operation {
	    0: 'update_proposal';
	    1: {
	        proposal_id: number;
	        creator: string;
	        daily_pay: Asset | string;
	        subject: string;
	        permlink: string;
	        extensions: any[];
	    };
	}
	export interface CollateralizedConvertOperation extends Operation {
	    0: 'collateralized_convert';
	    1: {
	        owner: string;
	        requestid: number;
	        amount: Asset | string;
	    };
	}
	export interface RecurrentTransferOperation extends Operation {
	    0: 'recurrent_transfer';
	    1: {
	        from: string;
	        to: string;
	        amount: Asset | string;
	        memo: string;
	        recurrence: number;
	        executions: number;
	        extensions: any[];
	    };
	}
	/**
	 * nft_mint, action 0 of {@link NftOperation}: mints a root post of the actor.
	 * All copies start with the author. Royalty and license are fixed for the life of the NFT, and the
	 * post can no longer be edited or deleted. See {@link checkNftMint} and {@link nftMintFee}.
	 */
	export interface NftMint {
	    /** Permlink of a root post of the actor (the minter is the author). */
	    permlink: string;
	    /** Number of copies, 1 to 10,000. */
	    editions: number;
	    /** Basis points of each later sale price paid to the author: 0 to 2500 (25%). */
	    royalty: number;
	    /** Full text of the license terms, UTF-8, at most 72 KiB. The chain keeps its SHA-256. */
	    license: string;
	    /** `editions` x 1.000 PXS, exactly; burned. */
	    fee: Asset | string;
	    /** Not used; `[]` when omitted. */
	    extensions?: any[];
	}
	/**
	 * nft_list, action 1: offers a copy at a fixed price in PXS, or replaces its offer. Only the owner
	 * can. Edition 0 offers the author's reserve: every copy that never left the author and has no
	 * offer of its own, at one price, each buyer getting the lowest-numbered copy still in it.
	 */
	export interface NftList {
	    /** Author of the minted post. */
	    author: string;
	    permlink: string;
	    /** The copy, 1 to the number of copies; 0 for the reserve. */
	    edition: number;
	    /** Asking price, in PXS. */
	    price: Asset | string;
	    /**
	     * The offer cannot be taken at or after this time. Leave it out for an offer that never expires.
	     * At most 2038-01-19T03:14:07: the node refuses later times in JSON.
	     */
	    expiration?: string;
	    /** Not used; `[]` when omitted. */
	    extensions?: any[];
	}
	/**
	 * nft_unlist, action 2: withdraws an offer. Edition 0 withdraws the reserve offer. A copy that never
	 * left its author goes back to the reserve.
	 */
	export interface NftUnlist {
	    author: string;
	    permlink: string;
	    /** The copy, 1 to the number of copies; 0 for the reserve. */
	    edition: number;
	    /** Not used; `[]` when omitted. */
	    extensions?: any[];
	}
	/**
	 * nft_buy, action 3: takes an offer. `price` has to equal the asking price exactly, so a buyer never
	 * pays a price changed after signing. The author receives the royalty unless he is the seller, the
	 * seller the rest. Edition 0 buys the next copy of the reserve, all of the price going to the author.
	 */
	export interface NftBuy {
	    author: string;
	    permlink: string;
	    /** The copy, 1 to the number of copies; 0 for the next copy of the reserve. */
	    edition: number;
	    /** The asking price, in PXS. */
	    price: Asset | string;
	    /** Not used; `[]` when omitted. */
	    extensions?: any[];
	}
	/**
	 * nft_transfer, action 4: gives a copy away, without payment and so without royalty. Only the
	 * owner can. Ends any offer of the copy. Giving it to `null` burns it.
	 */
	export interface NftTransfer {
	    author: string;
	    permlink: string;
	    /** The copy, 1 to the number of copies (the reserve cannot be given as a whole). */
	    edition: number;
	    /** The new owner; `null` burns the copy. */
	    to: string;
	    /** Not used; `[]` when omitted. */
	    extensions?: any[];
	}
	/**
	 * An nft_operation action as the node writes it in condenser_api JSON: `[tag, payload]`, the tag
	 * being the action's position (0 mint, 1 list, 2 unlist, 3 buy, 4 transfer).
	 */
	export type NftAction = [0, NftMint] | [1, NftList] | [2, NftUnlist] | [3, NftBuy] | [4, NftTransfer];
	/**
	 * The forms an action can be given in: `[tag, payload]`, `[name, payload]`, or `{type, value}` as
	 * database_api and HAF write it. dpixa signs and sends the `[tag, payload]` form.
	 */
	export type NftActionInput = NftAction | ['nft_mint', NftMint] | ['nft_list', NftList] | ['nft_unlist', NftUnlist] | ['nft_buy', NftBuy] | ['nft_transfer', NftTransfer] | {
	    type: 'nft_mint';
	    value: NftMint;
	} | {
	    type: 'nft_list';
	    value: NftList;
	} | {
	    type: 'nft_unlist';
	    value: NftUnlist;
	} | {
	    type: 'nft_buy';
	    value: NftBuy;
	} | {
	    type: 'nft_transfer';
	    value: NftTransfer;
	};
	/**
	 * The operation of native NFTs (hardfork 32). It carries one action; `account` is its actor (the
	 * minter, the owner who lists, unlists or gives a copy, or the buyer) and signs with the active key.
	 *
	 * An NFT is written `@author/permlink/0` and its copy N `@author/permlink/N`. Prices, royalties and
	 * the mint fee are in PXS. A purchase produces the virtual operations `nft_sold` (93) and, when a
	 * royalty is paid, `nft_royalty` (94).
	 */
	export interface NftOperation extends Operation {
	    0: 'nft';
	    1: {
	        /** The actor of the action. */
	        account: string;
	        action: NftActionInput;
	        /** Not used; `[]` when omitted. */
	        extensions?: any[];
	    };
	}
	/**
	 * Virtual operation 93: a listed copy was bought. For a purchase from the reserve (edition 0),
	 * `edition` is the copy the buyer got.
	 */
	export interface NftSoldOperation extends Operation {
	    0: 'nft_sold';
	    1: {
	        /** Previous owner; received the price minus the royalty. */
	        seller: string;
	        /** New owner; paid the price. */
	        buyer: string;
	        /** Creator of the NFT. */
	        author: string;
	        permlink: string;
	        edition: number;
	        price: Asset | string;
	        /** Part of the price paid to the creator; zero when the creator sold. */
	        royalty: Asset | string;
	    };
	}
	/** Virtual operation 94: the royalty of a sale, produced next to nft_sold when it is not zero. */
	export interface NftRoyaltyOperation extends Operation {
	    0: 'nft_royalty';
	    1: {
	        /** Creator of the NFT, who received the royalty. */
	        creator: string;
	        seller: string;
	        buyer: string;
	        permlink: string;
	        edition: number;
	        royalty: Asset | string;
	    };
	}

}
declare module 'dpixa/src/iterator-stream' {
	/**
	 * @file Small object-mode readable stream for environments without Node's
	 * `stream` module (browsers, web workers).
	 *
	 * `utils.iteratorStream()` returns a real `stream.PassThrough` under Node.
	 * Elsewhere it used to need the `stream-browserify` polyfill, which brings
	 * readable-stream, events, buffer, process, util and string_decoder into the
	 * bundle. This class covers what callers of the block/operation streams use:
	 *
	 *   - on / addListener / once / off / removeListener / removeAllListeners / emit
	 *   - 'data', 'end', 'error' and 'close' events
	 *   - pause() / resume() / isPaused()
	 *   - pipe(destination) with backpressure (waits for 'drain' when write()
	 *     returns false) and destroy()
	 *   - async iteration (`for await (const item of stream)`)
	 *
	 * Like a Node Readable it starts paused and begins pulling from the iterator
	 * once a 'data' listener is added, or on resume() / pipe().
	 */
	type Listener = (...args: any[]) => void;
	/** What pipe() needs from a destination (a Node Writable fits). */
	interface PipeDestination {
	    write(chunk: any): boolean | void;
	    end?(): void;
	    once?(event: string, listener: Listener): unknown;
	}
	export class IteratorStream<T = any> {
	    private readonly iterator;
	    readable: boolean;
	    destroyed: boolean;
	    private readonly listeners;
	    private flowing;
	    private pausedByUser;
	    private started;
	    private wake;
	    constructor(iterator: AsyncIterator<T>);
	    on(event: string | symbol, listener: Listener): this;
	    addListener(event: string | symbol, listener: Listener): this;
	    once(event: string | symbol, listener: Listener): this;
	    off(event: string | symbol, listener: Listener): this;
	    removeListener(event: string | symbol, listener: Listener): this;
	    removeAllListeners(event?: string | symbol): this;
	    listenerCount(event: string | symbol): number;
	    emit(event: string | symbol, ...args: any[]): boolean;
	    pause(): this;
	    resume(): this;
	    isPaused(): boolean;
	    pipe<W extends PipeDestination>(destination: W, options?: {
	        end?: boolean;
	    }): W;
	    destroy(error?: Error): this;
	    [Symbol.asyncIterator](): AsyncIterator<T>;
	    private signal;
	    private waitUntilFlowing;
	    private pump;
	}
	export {};

}
declare module 'dpixa/src/utils' {
	/**
	 * @file Misc utility functions.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	import type { WitnessSetPropertiesOperation } from 'dpixa/src/chain/operation';
	import type { WitnessProps } from 'dpixa/src/witness';
	export type { WitnessProps } from 'dpixa/src/witness';
	/**
	 * Anything with an EventEmitter-style `once()`.
	 */
	export interface EventEmitterLike {
	    once(eventName: string | symbol, listener: (...args: any[]) => void): unknown;
	}
	/**
	 * Return a promise that will resove when a specific event is emitted.
	 */
	export function waitForEvent<T>(emitter: EventEmitterLike, eventName: string | symbol): Promise<T>;
	/**
	 * Sleep for N milliseconds.
	 */
	export function sleep(ms: number): Promise<void>;
	/**
	 * Return a stream that emits iterator values.
	 *
	 * Under Node.js this is an object-mode `stream.PassThrough`, as before. In
	 * browsers it is a lightweight `IteratorStream` (src/iterator-stream.ts) with the same
	 * on('data' | 'end' | 'error') / pipe() / pause() / resume() surface; for
	 * new browser code prefer the async iterators (`getBlocks()` etc.) directly.
	 */
	export function iteratorStream<T>(iterator: AsyncIterableIterator<T>): NodeJS.ReadableStream;
	/**
	 * Return a deep copy of a JSON-serializable object.
	 */
	export function copy<T>(object: T): T;
	/**
	 * Fetch API wrapper that retries until timeout is reached.
	 *
	 * Uses the platform `fetch` (browsers, Node.js, workers) — no
	 * cross-fetch / node-fetch / whatwg-fetch polyfills.
	 */
	export function retryingFetch(currentAddress: string, allAddresses: string | string[], opts: any, timeout: number, failoverThreshold: number, consoleOnFailover: boolean, backoff: (attempt: number) => number, fetchTimeout?: (attempt: number) => number): Promise<{
	    response: any;
	    currentAddress: string;
	}>;
	/**
	 * Build a `witness_set_properties` operation with hex-serialized props.
	 *
	 * Needs the serializer, so it lives with the crypto code (see witness.ts);
	 * this wrapper keeps it on `utils` for the lite entry point and works as soon
	 * as `@pixagram/dpixa/crypto` (or the full build) has been loaded.
	 */
	export const buildWitnessUpdateOp: (owner: string, props: WitnessProps) => WitnessSetPropertiesOperation;
	export const operationOrders: {
	    vote: number;
	    comment: number;
	    transfer: number;
	    transfer_to_vesting: number;
	    withdraw_vesting: number;
	    limit_order_create: number;
	    limit_order_cancel: number;
	    feed_publish: number;
	    convert: number;
	    account_create: number;
	    account_update: number;
	    witness_update: number;
	    account_witness_vote: number;
	    account_witness_proxy: number;
	    pow: number;
	    custom: number;
	    report_over_production: number;
	    delete_comment: number;
	    custom_json: number;
	    comment_options: number;
	    set_withdraw_vesting_route: number;
	    limit_order_create2: number;
	    claim_account: number;
	    create_claimed_account: number;
	    request_account_recovery: number;
	    recover_account: number;
	    change_recovery_account: number;
	    escrow_transfer: number;
	    escrow_dispute: number;
	    escrow_release: number;
	    pow2: number;
	    escrow_approve: number;
	    transfer_to_savings: number;
	    transfer_from_savings: number;
	    cancel_transfer_from_savings: number;
	    custom_binary: number;
	    decline_voting_rights: number;
	    nft: number;
	    set_reset_account: number;
	    claim_reward_balance: number;
	    delegate_vesting_shares: number;
	    account_create_with_delegation: number;
	    witness_set_properties: number;
	    account_update2: number;
	    create_proposal: number;
	    update_proposal_votes: number;
	    remove_proposal: number;
	    update_proposal: number;
	    collateralized_convert: number;
	    recurrent_transfer: number;
	    fill_convert_request: number;
	    author_reward: number;
	    curation_reward: number;
	    comment_reward: number;
	    liquidity_reward: number;
	    interest: number;
	    fill_vesting_withdraw: number;
	    fill_order: number;
	    shutdown_witness: number;
	    fill_transfer_from_savings: number;
	    hardfork: number;
	    comment_payout_update: number;
	    return_vesting_delegation: number;
	    comment_benefactor_reward: number;
	    producer_reward: number;
	    clear_null_account_balance: number;
	    proposal_pay: number;
	    dhf_funding: number;
	    sps_fund: number;
	    hardfork_hive: number;
	    hardfork_pixa: number;
	    hardfork_hive_restore: number;
	    hardfork_pixa_restore: number;
	    delayed_voting: number;
	    consolidate_treasury_balance: number;
	    effective_comment_vote: number;
	    ineffective_delete_comment: number;
	    dhf_conversion: number;
	    sps_convert: number;
	    expired_account_notification: number;
	    changed_recovery_account: number;
	    transfer_to_vesting_completed: number;
	    pow_reward: number;
	    vesting_shares_split: number;
	    account_created: number;
	    fill_collateralized_convert_request: number;
	    system_warning: number;
	    fill_recurrent_transfer: number;
	    failed_recurrent_transfer: number;
	    limit_order_cancelled: number;
	    producer_missed: number;
	    proposal_fee: number;
	    collateralized_convert_immediate_conversion: number;
	    escrow_approved: number;
	    escrow_rejected: number;
	    proxy_cleared: number;
	    declined_voting_rights: number;
	    nft_sold: number;
	    nft_royalty: number;
	};
	/**
	 * Make bitmask filter to be used with getAccountHistory call
	 * @param allowedOperations Array of operations index numbers
	 */
	export function makeBitMaskFilter(allowedOperations: number[]): (string | null)[];

}
declare module 'dpixa/src/helpers/blockchain' {
	/**
	 * @file Hive/Pixa blockchain helpers.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	import { Client } from 'dpixa/src/client';
	export enum BlockchainMode {
	    /**
	     * Only get irreversible blocks.
	     */
	    Irreversible = 0,
	    /**
	     * Get all blocks.
	     */
	    Latest = 1
	}
	export interface BlockchainStreamOptions {
	    /**
	     * Start block number, inclusive. If omitted generation will start from current block height.
	     */
	    from?: number;
	    /**
	     * End block number, inclusive. If omitted stream will continue indefinitely.
	     */
	    to?: number;
	    /**
	     * Streaming mode, if set to `Latest` may include blocks that are not applied to the final chain.
	     * Defaults to `Irreversible`.
	     */
	    mode?: BlockchainMode;
	}
	export class Blockchain {
	    readonly client: Client;
	    constructor(client: Client);
	    /**
	     * Get latest block number.
	     */
	    getCurrentBlockNum(mode?: BlockchainMode): Promise<number>;
	    /**
	     * Get latest block header.
	     */
	    getCurrentBlockHeader(mode?: BlockchainMode): Promise<import("..").BlockHeader>;
	    /**
	     * Get latest block.
	     */
	    getCurrentBlock(mode?: BlockchainMode): Promise<import("..").SignedBlock>;
	    /**
	     * Return a asynchronous block number iterator.
	     * @param options Feed options, can also be a block number to start from.
	     */
	    getBlockNumbers(options?: BlockchainStreamOptions | number): AsyncGenerator<number, void, unknown>;
	    /**
	     * Return a stream of block numbers, accepts same parameters as {@link getBlockNumbers}.
	     */
	    getBlockNumberStream(options?: BlockchainStreamOptions | number): NodeJS.ReadableStream;
	    /**
	     * Return a asynchronous block iterator, accepts same parameters as {@link getBlockNumbers}.
	     */
	    getBlocks(options?: BlockchainStreamOptions | number): AsyncGenerator<import("..").SignedBlock, void, unknown>;
	    /**
	     * Return a stream of blocks, accepts same parameters as {@link getBlockNumbers}.
	     */
	    getBlockStream(options?: BlockchainStreamOptions | number): NodeJS.ReadableStream;
	    /**
	     * Return a asynchronous operation iterator, accepts same parameters as {@link getBlockNumbers}.
	     */
	    getOperations(options?: BlockchainStreamOptions | number): AsyncGenerator<import("..").AppliedOperation, void, unknown>;
	    /**
	     * Return a stream of operations, accepts same parameters as {@link getBlockNumbers}.
	     */
	    getOperationsStream(options?: BlockchainStreamOptions | number): NodeJS.ReadableStream;
	}

}
declare module 'dpixa/src/helpers/broadcast' {
	/**
	 * @file Broadcast API helpers.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	import { AuthorityType } from 'dpixa/src/chain/account';
	import { Asset } from 'dpixa/src/chain/asset';
	import { AccountUpdateOperation, ClaimRewardBalanceOperation, CommentOperation, CommentOptionsOperation, CustomJsonOperation, DelegateVestingSharesOperation, NftOperation, Operation, TransferOperation, VoteOperation } from 'dpixa/src/chain/operation';
	import { SignedTransaction, Transaction, TransactionConfirmation } from 'dpixa/src/chain/transaction';
	import type { Client } from 'dpixa/src/client';
	import type { PrivateKey, PublicKey } from 'dpixa/src/crypto';
	export interface CreateAccountOptions {
	    /**
	     * Username for the new account.
	     */
	    username: string;
	    /**
	     * Password for the new account, if set, all keys will be derived from this.
	     */
	    password?: string;
	    /**
	     * Account authorities, used to manually set account keys.
	     * Can not be used together with the password option.
	     */
	    auths?: {
	        owner: AuthorityType | string | PublicKey;
	        active: AuthorityType | string | PublicKey;
	        posting: AuthorityType | string | PublicKey;
	        memoKey: PublicKey | string;
	    };
	    /**
	     * Creator account, fee will be deducted from this and the key to sign
	     * the transaction must be the creators active key.
	     */
	    creator: string;
	    /**
	     * Account creation fee. If omitted fee will be set to lowest possible.
	     */
	    fee?: string | Asset | number;
	    /**
	     * Account delegation, amount of VESTS to delegate to the new account.
	     * If omitted the delegation amount will be the lowest possible based
	     * on the fee. Can be set to zero to disable delegation.
	     */
	    delegation?: string | Asset | number;
	    /**
	     * Optional account meta-data.
	     */
	    metadata?: {
	        [key: string]: any;
	    };
	}
	/**
	 * Broadcast API helper.
	 *
	 * Part of the lite (fetch-only) client: the signing it needs comes from the
	 * crypto module through crypto-registry.ts, so `client.broadcast` exists even
	 * before `@pixagram/dpixa/crypto` has been loaded. Methods that sign or
	 * compute transaction ids throw a descriptive error until it is.
	 */
	export class BroadcastAPI {
	    readonly client: Client;
	    /**
	     * How many milliseconds in the future to set the expiry time to when
	     * broadcasting a transaction, defaults to 1 minute.
	     */
	    expireTime: number;
	    constructor(client: Client);
	    /**
	     * Broadcast a comment, also used to create a new top level post.
	     * @param comment The comment/post.
	     * @param key Private posting key of comment author.
	     */
	    comment(comment: CommentOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
	    /**
	     * Broadcast a comment and set the options.
	     * @param comment The comment/post.
	     * @param options The comment/post options.
	     * @param key Private posting key of comment author.
	     */
	    commentWithOptions(comment: CommentOperation[1], options: CommentOptionsOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
	    /**
	     * Broadcast a vote.
	     * @param vote The vote to send.
	     * @param key Private posting key of the voter.
	     */
	    vote(vote: VoteOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
	    /**
	     * Broadcast a transfer.
	     * @param data The transfer operation payload.
	     * @param key Private active key of sender.
	     */
	    transfer(data: TransferOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
	    /**
	     * Broadcast custom JSON.
	     * @param data The custom_json operation payload.
	     * @param key Private posting or active key.
	     */
	    json(data: CustomJsonOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
	    /**
	     * Claim pending rewards into the account's balances.
	     * @param data The amounts to claim, as `getAccounts` shows them pending; PIXA as `reward_pixa`
	     *             (or `reward_hive`), PXS as `reward_pxs` (or `reward_hbd`), and `reward_vests`.
	     * @param key Private posting key of the account.
	     */
	    claimRewardBalance(data: ClaimRewardBalanceOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
	    /**
	     * Broadcast an nft_operation (hardfork 32): mint, offer, withdraw an offer, buy or give away a
	     * copy. {@link NftAPI} (`client.nft`) builds each action and checks it first.
	     * @param data `account` (the actor) and `action`, e.g. `[0, { permlink, editions, royalty, license, fee }]`.
	     * @param key Private active key of `account`.
	     */
	    nft(data: NftOperation[1], key: PrivateKey | PrivateKey[]): Promise<TransactionConfirmation>;
	    /**
	     * Promote a post: burn PXS for it by sending it to `null` with the memo `@author/permlink`.
	     * Pixamind adds the amount to the post's promoted total, which ranks the promoted feed while
	     * the post awaits its payout. Only a root post can be promoted, only PXS counts, and the PXS is
	     * burned whatever happens to the post.
	     * @param data `from` pays, `author`/`permlink` name the post, `amount` in PXS (from 0.001).
	     * @param key Private active key of `from`.
	     */
	    promote(data: {
	        from: string;
	        author: string;
	        permlink: string;
	        amount: string | Asset;
	    }, key: PrivateKey | PrivateKey[]): Promise<TransactionConfirmation>;
	    /**
	     * Create a new account on testnet.
	     * @param options New account options.
	     * @param key Private active key of account creator.
	     */
	    createTestAccount(options: CreateAccountOptions, key: PrivateKey): Promise<TransactionConfirmation>;
	    /**
	     * Update account.
	     * @param data The account_update payload.
	     * @param key The private key of the account affected, should be the corresponding
	     *            key level or higher for updating account authorities.
	     */
	    updateAccount(data: AccountUpdateOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
	    /**
	     * Delegate vesting shares from one account to the other. The vesting shares are still owned
	     * by the original account, but content voting rights and bandwidth allocation are transferred
	     * to the receiving account. This sets the delegation to `vesting_shares`, increasing it or
	     * decreasing it as needed. (i.e. a delegation of 0 removes the delegation)
	     *
	     * When a delegation is removed the shares are placed in limbo for a week to prevent a satoshi
	     * of VESTS from voting on the same content twice.
	     *
	     * @param options Delegation options.
	     * @param key Private active key of the delegator.
	     */
	    delegateVestingShares(options: DelegateVestingSharesOperation[1], key: PrivateKey): Promise<TransactionConfirmation>;
	    /**
	     * Sign and broadcast transaction with operations to the network. Throws if the transaction expires.
	     * @param operations List of operations to send.
	     * @param key Private key(s) used to sign transaction.
	     */
	    sendOperations(operations: Operation[], key: PrivateKey | PrivateKey[]): Promise<TransactionConfirmation>;
	    /**
	     * Sign a transaction with key(s).
	     */
	    sign(transaction: Transaction, key: PrivateKey | PrivateKey[]): SignedTransaction;
	    /**
	     * Broadcast a signed transaction to the network.
	     *
	     * The operations are sent in the form the node reads (see `normalizeTransaction`), which never
	     * changes what the signatures cover. The node checks and queues the transaction; `id` is its
	     * transaction id, and `client.transaction.findTransaction(id)` tells when it is in a block.
	     */
	    send(transaction: SignedTransaction): Promise<TransactionConfirmation>;
	    /**
	     * Convenience for calling `condenser_api`.
	     */
	    call(method: string, params?: any[]): Promise<any>;
	}

}
declare module 'dpixa/src/helpers/database' {
	/**
	 * @file Database API helpers.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	import { ExtendedAccount } from 'dpixa/src/chain/account';
	import { Price } from 'dpixa/src/chain/asset';
	import { BlockHeader, SignedBlock } from 'dpixa/src/chain/block';
	import { Discussion } from 'dpixa/src/chain/comment';
	import { DynamicGlobalProperties } from 'dpixa/src/chain/misc';
	import { ChainProperties, VestingDelegation } from 'dpixa/src/chain/misc';
	import { AppliedOperation } from 'dpixa/src/chain/operation';
	import { SignedTransaction } from 'dpixa/src/chain/transaction';
	import { Client } from 'dpixa/src/client';
	/**
	 * Possible categories for `get_discussions_by_*`.
	 */
	export type DiscussionQueryCategory = 'active' | 'blog' | 'cashout' | 'children' | 'comments' | 'feed' | 'hot' | 'promoted' | 'trending' | 'votes' | 'created';
	export interface DisqussionQuery {
	    /**
	     * Name of author or tag to fetch.
	     */
	    tag?: string;
	    /**
	     * Number of results, max 100.
	     */
	    limit: number;
	    filter_tags?: string[];
	    select_authors?: string[];
	    select_tags?: string[];
	    /**
	     * Number of bytes of post body to fetch, default 0 (all)
	     */
	    truncate_body?: number;
	    /**
	     * Name of author to start from, used for paging.
	     * Should be used in conjunction with `start_permlink`.
	     */
	    start_author?: string;
	    /**
	     * Permalink of post to start from, used for paging.
	     * Should be used in conjunction with `start_author`.
	     */
	    start_permlink?: string;
	    parent_author?: string;
	    parent_permlink?: string;
	}
	export class DatabaseAPI {
	    readonly client: Client;
	    constructor(client: Client);
	    /**
	     * Convenience for calling `database_api`.
	     */
	    call(method: string, params?: any[]): Promise<any>;
	    /**
	     * Return state of server.
	     */
	    getDynamicGlobalProperties(): Promise<DynamicGlobalProperties>;
	    /**
	     * Return median chain properties decided by witness.
	     */
	    getChainProperties(): Promise<ChainProperties>;
	    /**
	     * Return all of the state required for a particular url path.
	     * @param path Path component of url conforming to condenser's scheme
	     *             e.g. `@almost-digital` or `trending/travel`
	     */
	    getState(path: string): Promise<any>;
	    /**
	     * Return median price in PXS for 1 PIXA as reported by the witnesses.
	     */
	    getCurrentMedianHistoryPrice(): Promise<Price>;
	    /**
	     * Get list of delegations made by account.
	     * @param account Account delegating
	     * @param from Delegatee start offset, used for paging.
	     * @param limit Number of results, max 1000.
	     */
	    getVestingDelegations(account: string, from?: string, limit?: number): Promise<VestingDelegation[]>;
	    /**
	     * Return server config. See:
	     * https://github.com/steemit/steem/blob/master/libraries/protocol/include/steemit/protocol/config.hpp
	     */
	    getConfig(): Promise<{
	        [name: string]: string | number | boolean;
	    }>;
	    /**
	     * Return header for *blockNum*.
	     */
	    getBlockHeader(blockNum: number): Promise<BlockHeader>;
	    /**
	     * Return block *blockNum*.
	     */
	    getBlock(blockNum: number): Promise<SignedBlock>;
	    /**
	     * Return all applied operations in *blockNum*.
	     */
	    getOperations(blockNum: number, onlyVirtual?: boolean): Promise<AppliedOperation[]>;
	    /**
	     * Return array of discussions (a.k.a. posts).
	     * @param by The type of sorting for the discussions, valid options are:
	     *           `active` `blog` `cashout` `children` `comments` `created`
	     *           `feed` `hot` `promoted` `trending` `votes`. Note that
	     *           for `blog` and `feed` the tag is set to a username.
	     */
	    getDiscussions(by: DiscussionQueryCategory, query: DisqussionQuery): Promise<Discussion[]>;
	    /**
	     * Return array of account info objects for the usernames passed.
	     * @param usernames The accounts to fetch.
	     */
	    getAccounts(usernames: string[]): Promise<ExtendedAccount[]>;
	    /**
	     * Returns the details of a transaction based on a transaction id.
	     */
	    getTransaction(txId: string): Promise<SignedTransaction>;
	    /**
	     * Returns one or more account history objects for account operations
	     *
	     * @param account The account to fetch
	     * @param from The starting index
	     * @param limit The maximum number of results to return
	     * @param operation_bitmask Generated by dpixa.utils.makeBitMaskFilter() - see example below
	     * @example
	     * const op = dpixa.utils.operationOrders
	     * const operationsBitmask = dpixa.utils.makeBitMaskFilter([
	     *   op.transfer,
	     *   op.transfer_to_vesting,
	     *   op.withdraw_vesting,
	     *   op.interest,
	     *   op.liquidity_reward,
	     *   op.transfer_to_savings,
	     *   op.transfer_from_savings,
	     *   op.escrow_transfer,
	     *   op.cancel_transfer_from_savings,
	     *   op.escrow_approve,
	     *   op.escrow_dispute,
	     *   op.escrow_release,
	     *   op.fill_convert_request,
	     *   op.fill_order,
	     *   op.claim_reward_balance,
	     * ])
	     */
	    getAccountHistory(account: string, from: number, limit: number, operation_bitmask?: [number, number]): Promise<[[number, AppliedOperation]]>;
	    /**
	     * Verify signed transaction.
	     */
	    verifyAuthority(stx: SignedTransaction): Promise<boolean>;
	    /** return rpc node version */
	    getVersion(): Promise<object>;
	}

}
declare module 'dpixa/src/helpers/nft' {
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
	import { Asset } from 'dpixa/src/chain/asset';
	import { NftMint } from 'dpixa/src/chain/operation';
	import { TransactionConfirmation } from 'dpixa/src/chain/transaction';
	import type { Client } from 'dpixa/src/client';
	import type { PrivateKey } from 'dpixa/src/crypto';
	/** The limits and mint fee nft_operation is checked against at head block (`get_nft_params`). */
	export interface NftParams {
	    /** Mint fee per copy: 1.000 PXS. nft_mint carries it times its number of copies. */
	    mint_fee_per_edition: Asset;
	    /** Copies per NFT: 10,000. */
	    max_editions: number;
	    /** Royalty ceiling in basis points: 2500 (25%). */
	    max_royalty: number;
	    /** Bytes of license text: 73,728 (72 KiB). */
	    max_license_length: number;
	    /** Assets an offer can be made in: `['PXS']`. */
	    price_symbols: string[];
	}
	/** An NFT as the chain keeps it (`database_api.find_nfts`, `list_nfts`). */
	export interface ChainNft {
	    id: number;
	    /** `@author/permlink/0` */
	    nft_id: string;
	    /** Creator of the NFT, author of the minted post. */
	    author: string;
	    permlink: string;
	    mint_time: string;
	    /** Number of copies, numbered from 1. */
	    editions: number;
	    /** Basis points of a sale price paid to the author. */
	    royalty: number;
	    /** Bytes of the license text, which the mint operation carries. */
	    license_size: number;
	    /** SHA-256 of the license text. */
	    license_sha256: string;
	    /** Copies still with the author since the mint, without an offer of their own. */
	    reserve: number;
	    /** The copy a buyer of copy 0 gets now; 0 when the reserve is empty. */
	    reserve_next: number;
	    /** True when copy 0 can be bought at head block time. */
	    reserve_listed: boolean;
	    /** The author's price for one copy of the reserve; meaningful only when `reserve_listed`. */
	    reserve_price: Asset;
	    /** The reserve offer ends at this time; meaningful only when `reserve_listed`. */
	    reserve_expiration: string;
	}
	/** One copy as the chain sees it (`find_nfts`, `list_nft_editions`). */
	export interface ChainNftEdition {
	    /** `@author/permlink/N` */
	    nft_id: string;
	    /** Id of the NFT object. */
	    nft: number;
	    author: string;
	    permlink: string;
	    edition: number;
	    /** `null` once the copy is burned. */
	    owner: string;
	    burned: boolean;
	    /** When the owner got the copy. */
	    acquired: string;
	    /** True when it can be bought at head block time. */
	    listed: boolean;
	    /** Asking price; meaningful only when `listed`. */
	    price: Asset;
	    /** The offer ends at this time; meaningful only when `listed`. */
	    expiration: string;
	}
	/** A copy, by id (`{ nft: '@alice/art/3' }`) or by its parts. */
	export type NftRef = {
	    nft: string;
	} | {
	    author: string;
	    permlink: string;
	    edition: number;
	};
	/** A post, as `[author, permlink]` or `{ author, permlink }`. */
	export type PostRef = [string, string] | {
	    author: string;
	    permlink: string;
	};
	/**
	 * Native NFTs, read from the chain (`database_api`) and acted on with `nft_operation`.
	 *
	 * Every action is signed with the active key of `account`, its actor. The market summary of an NFT
	 * page, its history and the lists by creator, owner and price come from Pixamind
	 * ({@link PixamindAPI.getNfts} and the other `…Nft…` methods); this helper is what the chain holds
	 * at head block, which is what a purchase is checked against.
	 */
	export class NftAPI {
	    readonly client: Client;
	    constructor(client: Client);
	    /** Convenience for calling `database_api`. */
	    call(method: string, params?: any): Promise<any>;
	    /** The limits and mint fee nft_operation is checked against at head block. */
	    getParams(): Promise<NftParams>;
	    /**
	     * Up to 100 NFTs or copies by id: `@author/permlink/0` for an NFT (with its reserve),
	     * `@author/permlink/N` for the NFT with its copy N. Ids that name nothing are left out, so the
	     * call also tells which posts are minted. Each NFT and each copy is answered once, in the order
	     * first asked; a copy that was never offered nor moved is answered as its creator's.
	     */
	    find(ids: string[]): Promise<{
	        nfts: ChainNft[];
	        editions: ChainNftEdition[];
	    }>;
	    /** The NFT of a post, or undefined when the post is not minted. */
	    getNft(author: string, permlink: string): Promise<ChainNft | undefined>;
	    /** One copy (`@author/permlink/N`, N >= 1), or undefined when there is no such copy. */
	    getEdition(id: string): Promise<ChainNftEdition | undefined>;
	    /** Whether each post is minted, in the order given (100 posts per request). */
	    areMinted(posts: PostRef[]): Promise<boolean[]>;
	    /**
	     * NFTs a creator minted, in permlink order.
	     * @param options `after`: the permlink to continue after (the last of the previous page);
	     *                `limit`: 1 to 1000, default 100.
	     */
	    listByCreator(creator: string, options?: {
	        after?: string;
	        limit?: number;
	    }): Promise<ChainNft[]>;
	    /**
	     * The copies of one NFT in number order, each copy once whether or not it ever moved.
	     * @param nft The NFT, `@author/permlink/0` (or any copy id).
	     * @param options `from`: first copy, default 1; `limit`: 1 to 1000, default 100.
	     */
	    listEditions(nft: string, options?: {
	        from?: number;
	        limit?: number;
	    }): Promise<ChainNftEdition[]>;
	    /**
	     * Copies an account owns that were offered or moved at least once. A creator's reserve is not
	     * listed: it is `reserve` on each NFT ({@link listByCreator}); Pixamind's
	     * {@link PixamindAPI.listOwnedNfts} counts both.
	     * @param options `after`: the copy id to continue after (the last of the previous page);
	     *                `limit`: 1 to 1000, default 100.
	     */
	    listByOwner(owner: string, options?: {
	        after?: string;
	        limit?: number;
	    }): Promise<ChainNftEdition[]>;
	    /**
	     * Mint a root post of `account` in 1 to 10,000 copies. `fee` defaults to the copies times the
	     * fee per copy in force (1.000 PXS); it is burned. Royalty and license can never change, and the
	     * post can no longer be edited or deleted. Throws before signing when {@link checkNftMint} finds
	     * a problem.
	     */
	    mint(data: {
	        account: string;
	    } & Omit<NftMint, 'fee'> & {
	        fee?: Asset | string;
	    }, key: PrivateKey | PrivateKey[]): Promise<TransactionConfirmation>;
	    /**
	     * Offer a copy at a fixed price in PXS, or change its offer. The copy stays with its owner until
	     * someone buys it. `expiration` left out: the offer never expires; otherwise at most
	     * 2038-01-19T03:14:07, the latest time the node reads.
	     */
	    list(data: {
	        account: string;
	        price: Asset | string;
	        expiration?: string;
	    } & NftRef, key: PrivateKey | PrivateKey[]): Promise<TransactionConfirmation>;
	    /** Withdraw the offer of a copy. A copy that never left its author goes back to the reserve. */
	    unlist(data: {
	        account: string;
	    } & NftRef, key: PrivateKey | PrivateKey[]): Promise<TransactionConfirmation>;
	    /**
	     * Buy a copy (or, with edition 0, the next copy of the reserve). The price has to equal the
	     * asking price; left out, it is read from the chain first, and the purchase fails if the offer
	     * changes before the transaction is included.
	     */
	    buy(data: {
	        account: string;
	        price?: Asset | string;
	    } & NftRef, key: PrivateKey | PrivateKey[]): Promise<TransactionConfirmation>;
	    /** Give a copy to another account: no payment, so no royalty. Ends any offer of the copy. */
	    transfer(data: {
	        account: string;
	        to: string;
	    } & NftRef, key: PrivateKey | PrivateKey[]): Promise<TransactionConfirmation>;
	    /** Burn a copy: give it to `null`, for good. It keeps its number and still counts among the copies. */
	    burn(data: {
	        account: string;
	    } & NftRef, key: PrivateKey | PrivateKey[]): Promise<TransactionConfirmation>;
	    /**
	     * Offer the reserve: every copy that never left the author and has no offer of its own, at one
	     * price, in one action. Each buyer gets the lowest-numbered copy still in the reserve and the
	     * author receives the whole price. The offer ends by itself when the reserve runs out.
	     */
	    offerReserve(data: {
	        account: string;
	        permlink: string;
	        price: Asset | string;
	        expiration?: string;
	    }, key: PrivateKey | PrivateKey[]): Promise<TransactionConfirmation>;
	    /** Withdraw the reserve offer. */
	    withdrawReserve(data: {
	        account: string;
	        permlink: string;
	    }, key: PrivateKey | PrivateKey[]): Promise<TransactionConfirmation>;
	    /** Buy the next copy of an author's reserve; `price` left out is read from the chain. */
	    buyFromReserve(data: {
	        account: string;
	        author: string;
	        permlink: string;
	        price?: Asset | string;
	    }, key: PrivateKey | PrivateKey[]): Promise<TransactionConfirmation>;
	    /** The price a copy (or the reserve, edition 0) can be bought at now; throws when it is not for sale. */
	    askingPrice(author: string, permlink: string, edition: number): Promise<Asset>;
	    private send;
	}

}
declare module 'dpixa/src/chain/pixamind' {
	export interface CommunityDetail {
	    id: number;
	    name: string;
	    title: string;
	    about: string;
	    lang: string;
	    type_id: number;
	    is_nsfw: false;
	    subscribers: number;
	    sum_pending: number;
	    num_pending: number;
	    num_authors: number;
	    created_at: string;
	    avatar_url: string;
	    context: object;
	    description: string;
	    flag_text: string;
	    settings: {};
	    team?: string[];
	    admins?: string[];
	}
	export interface Notifications {
	    id: number;
	    type: string;
	    score: number;
	    date: string;
	    msg: string;
	    url: string;
	}
	/**
	 * A page of a Pixamind list: pass `next_start` back as `start` to get the next page (treat it as
	 * opaque); `has_more` is false on the last page.
	 */
	export interface PixamindPage {
	    next_start?: string;
	    has_more: boolean;
	}
	/** Terms of an NFT, fixed at mint. Amounts are strings such as `"5.000 PXS"`. */
	export interface PixamindNftTerms {
	    /** `@author/permlink/0` */
	    nft_id: string;
	    author: string;
	    permlink: string;
	    /** Mint time, e.g. `2027-01-10T12:02:03`. */
	    minted: string;
	    mint_block: number;
	    editions: number;
	    /** Basis points of each later sale paid to the creator. */
	    royalty: number;
	    /** The royalty as a percentage with two decimals, e.g. `"10.00"`. */
	    royalty_percent: string;
	    mint_fee: string;
	    /** Bytes of the license text; the text itself: {@link PixamindAPI.getNftLicense}. */
	    license_size: number;
	    /** SHA-256 of the license text, as the chain keeps it. */
	    license_sha256: string;
	    /** False when the minted post was removed from Pixamind's index. */
	    post_exists: boolean;
	}
	/** One copy as Pixamind shows it. A field that does not apply is left out. */
	export interface PixamindNftEdition {
	    /** `@author/permlink/N`; `@author/permlink/0` for an offered reserve. */
	    nft_id: string;
	    author: string;
	    permlink: string;
	    /** 1 to 10,000; 0 for an offered reserve. */
	    edition: number;
	    owner: string;
	    burned?: boolean;
	    acquired?: string;
	    /** True while the copy can be bought. */
	    listed: boolean;
	    price?: string;
	    /** Only for an offer that expires. */
	    expiration?: string;
	    listed_at?: string;
	    sales?: number;
	    volume?: string;
	    royalties?: string;
	    last_sale_price?: string;
	    last_sale?: string;
	    /**
	     * The copy is in the creator's reserve (bought through copy 0 while the reserve is offered),
	     * or, with edition 0, this entry is the reserve offer itself.
	     */
	    reserve?: boolean;
	    /** Reserve offer only: how many copies it covers. */
	    copies?: number;
	    /** Reserve offer only: the copy the next buyer of copy 0 gets, `@author/permlink/N`. */
	    next?: string;
	    /** The terms of the NFT, in `get_nfts` for a copy and in market lists. */
	    nft?: PixamindNftTerms;
	}
	/** An NFT with its terms and the market summary an NFT page needs. */
	export interface PixamindNft extends PixamindNftTerms {
	    /** Number of copies (the same as `editions`). */
	    copies: number;
	    /** Copies that can be bought now: each copy offered on its own, plus the whole reserve while offered. */
	    for_sale: number;
	    /** Copies offered on their own. */
	    listed: number;
	    /** Copies in the creator's reserve: never left the creator, no offer of their own. */
	    reserve: number;
	    /** Copies given to `null`. */
	    burned: number;
	    /** Copies the creator still holds: the reserve, plus copies offered on their own or got back. */
	    held_by_creator: number;
	    sales: number;
	    volume: string;
	    royalties: string;
	    /** The reserve offer, when copy 0 can be bought now. */
	    reserve_offer?: PixamindNftEdition;
	    /**
	     * The lowest price a copy can be bought at now, how many copies sell at it, and the ids to buy
	     * them with (at most 100; `@author/permlink/0` is the reserve, which gives `reserve_offer.next`).
	     */
	    floor?: {
	        price: string;
	        copies: number;
	        nft_ids: string[];
	    };
	    /** The most recent sale of any copy. */
	    last_sale?: {
	        price: string;
	        edition: number;
	        time: string;
	    };
	}
	/** An NFT an account holds copies of (`list_owned`). */
	export interface PixamindOwnedNft {
	    nft: PixamindNftTerms;
	    /** Copies held. */
	    held: number;
	    /** Of those, how many can be bought now. */
	    listed: number;
	    /** Latest acquisition. */
	    acquired: string;
	}
	/** One event of an NFT's history (`get_history`): mint, list, unlist, sale, transfer or burn. */
	export interface PixamindNftEvent {
	    /** Event id (an operation id, as a string). */
	    id: string;
	    block_num: number;
	    timestamp: string;
	    type: 'mint' | 'list' | 'unlist' | 'sale' | 'transfer' | 'burn';
	    nft_id: string;
	    author: string;
	    permlink: string;
	    /** Absent for the mint and the reserve. */
	    edition?: number;
	    /** The actor: minter, owner, buyer, giver. */
	    account: string;
	    /** Sale: the previous owner. */
	    seller?: string;
	    /** Transfer: the receiver. */
	    to?: string;
	    price?: string;
	    /** Sale: the part paid to the creator. */
	    royalty?: string;
	    expiration?: string;
	    /** Mint only. */
	    editions?: number;
	    royalty_rate?: number;
	    license_size?: number;
	    license_sha256?: string;
	    fee?: string;
	}
	/** The full license text of an NFT (`get_license`). */
	export interface PixamindNftLicense {
	    nft_id: string;
	    license: string;
	    license_size: number;
	    license_sha256: string;
	}
	/** Metadata of a post (`pixamind_content.get_content_metadata`). A field that does not apply is left out. */
	export interface ContentMetadata {
	    author: string;
	    permlink: string;
	    depth: number;
	    category?: string;
	    community?: string;
	    created: string;
	    updated: string;
	    title?: string;
	    /** Format, app, tags, license and, for an artwork, the picture's size, read from json_metadata and the body. */
	    content?: {
	        [key: string]: any;
	    };
	    /** Total burned to promote the post, e.g. `"1.750 PXS"`; only when something was. */
	    promoted?: string;
	    /** Number of recorded versions (the creation and each edit); only when the history is recorded. */
	    versions?: number;
	    /** Terms and market summary, when the post is minted. */
	    nft?: PixamindNft;
	}
	/** One version of a post or comment (`pixamind_content.get_post_history`). */
	export interface PostVersion {
	    version: number;
	    block_num: number;
	    timestamp: string;
	    op_id: string;
	    /** True for the creation, false for an edit. */
	    created: boolean;
	    /** Fields this version changed: `title`, `body`, `json_metadata`. */
	    changed: string[];
	    title: string;
	    /** Left out with `bodies: false`. */
	    body?: string;
	    json_metadata: string;
	}
	/** The recorded versions of a post or comment, oldest first. */
	export interface PostHistory {
	    author: string;
	    permlink: string;
	    total: number;
	    /** False when the history only starts partway (the post predates the recording). */
	    complete: boolean;
	    versions: PostVersion[];
	}
	/**
	 * The promotion payments behind a post (`author`, `permlink`, `promoted`), or what an account spent
	 * on promotion (`sender`, `total`), newest first. Amounts are in PXS, e.g. `"1.750 PXS"`.
	 */
	export interface Promotions {
	    author?: string;
	    permlink?: string;
	    /** Total burned for the post. */
	    promoted?: string;
	    sender?: string;
	    /** Total the sender burned. */
	    total?: string;
	    promotions: {
	        /** Payments behind a post: who paid. */
	        sender?: string;
	        /** An account's spending: which post. */
	        author?: string;
	        permlink?: string;
	        /** An account's spending: false when the memo named no promotable post (the PXS burned anyway). */
	        post_exists?: boolean;
	        amount: string;
	        block_num: number;
	        timestamp: string;
	    }[];
	}

}
declare module 'dpixa/src/helpers/pixamind' {
	/**
	 * Pixamind database query wrapper
	 */
	import { Account } from 'dpixa/src/chain/account';
	import { Discussion } from 'dpixa/src/chain/comment';
	import { CommunityDetail, ContentMetadata, Notifications, PixamindNft, PixamindNftEdition, PixamindNftEvent, PixamindNftLicense, PixamindOwnedNft, PixamindPage, PostHistory, Promotions } from 'dpixa/src/chain/pixamind';
	import { Client } from 'dpixa/src/client';
	export interface PostsQuery {
	    /**
	     * Number of posts to fetch
	     */
	    limit?: number;
	    /**
	     * Sorting posts
	     */
	    sort: 'trending' | 'hot' | 'created' | 'promoted' | 'payout' | 'payout_comments' | 'muted';
	    /**
	     * Tag, community (`portal-…`), or `my` with an observer: the communities the observer
	     * subscribes to (`promoted` too)
	     */
	    tag?: string[] | string;
	    /**
	     * Observer account
	     */
	    observer?: string;
	    /**
	     * Paginating last post author
	     */
	    start_author?: string;
	    /**
	     * Paginating last post permlink
	     */
	    start_permlink?: string;
	    /**
	     * Mute reasons to leave out (bridge's muted_reasons_filter)
	     */
	    muted_reasons_filter?: number[];
	}
	/** Query of the promoted feed: the posts query without `sort`. */
	export type PromotedPostsQuery = Omit<PostsQuery, 'sort'>;
	/** Query of `pixamind_nft.list_editions`. */
	export interface NftEditionsQuery {
	    /** The NFT, `@author/permlink/0` (any copy number names it). */
	    nft: string;
	    /**
	     * `number`: every copy in order, those of the reserve with `reserve: true`. `price`: what can
	     * be bought now, cheapest first, the offered reserve as one entry (copy 0).
	     */
	    sort?: 'number' | 'price';
	    /** Keep one account's copies. */
	    owner?: string;
	    /** 1 to 100. */
	    limit?: number;
	    /** `next_start` of the previous page. */
	    start?: string;
	}
	/** Query of `pixamind_nft.list_market`. */
	export interface NftMarketQuery {
	    /** `recent`: latest offers first (the default). `price`: cheapest first. */
	    sort?: 'recent' | 'price';
	    /** Keep one creator's NFTs. */
	    creator?: string;
	    limit?: number;
	    start?: string;
	}
	/** Query of `pixamind_nft.get_history`: one NFT (`…/0`, every copy) or copy (`…/N`), or one account. */
	export type NftHistoryQuery = ({
	    nft: string;
	} | {
	    account: string;
	}) & {
	    limit?: number;
	    start?: string;
	};
	/**
	 * Omitting sort extended from BridgeParam
	 */
	export interface AccountPostsQuery extends Omit<PostsQuery, 'sort'> {
	    account: string;
	    sort: 'posts';
	}
	export interface CommunityQuery {
	    name: string;
	    observer: string;
	}
	export interface AccountNotifsQuery {
	    account: Account['name'];
	    limit: number;
	    type?: 'new_community' | 'pin_post';
	}
	export interface ListCommunitiesQuery {
	    /**
	     * Paginating last
	     */
	    last?: string;
	    /**
	     * Number of communities to fetch
	     */
	    limit: number;
	    /**
	     * To be developed, not ready yet. Currently always a string; typed as
	     * `any` to allow richer query objects in future without a breaking change.
	     */
	    query?: any;
	    /**
	     * Observer account
	     */
	    observer?: Account['name'];
	}
	export class PixamindAPI {
	    readonly client: Client;
	    constructor(client: Client);
	    /**
	     * Convenience of calling pixamind api
	     * @param method
	     * @param params
	     */
	    call(method: string, params?: any): Promise<any>;
	    /**
	     * Get trending, hot, recent community posts from Pixamind
	     * @param options
	     */
	    getRankedPosts(options: PostsQuery): Promise<Discussion[]>;
	    /**
	     * Get posts by particular account from Pixamind
	     * @param options
	     */
	    getAccountPosts(options: AccountPostsQuery): Promise<Discussion[]>;
	    /**
	     * Get community details such as who are the admin,
	     * moderators, how many subscribers, etc..
	     * @param options
	     */
	    getCommunity(options: CommunityQuery): Promise<CommunityDetail[]>;
	    /**
	     * List all subscriptions by particular account
	     * @param account the account you want to query
	     * @returns {Array} return role, what community the account joined
	     */
	    listAllSubscriptions(account: Account['name'] | object): Promise<Discussion[]>;
	    /**
	     * Get particular account notifications feed
	     * @param options
	     */
	    getAccountNotifications(options?: AccountNotifsQuery): Promise<Notifications[]>;
	    /**
	     * List all available communities on pixamind
	     * @param options
	     */
	    listCommunities(options: ListCommunitiesQuery): Promise<CommunityDetail[]>;
	    /**
	     * Call a method of another Pixamind namespace: `pixamind_api`, `pixamind_content`,
	     * `pixamind_feed`, `pixamind_graph` or `pixamind_nft`.
	     */
	    callNamespace(namespace: string, method: string, params?: any): Promise<any>;
	    /**
	     * What the Pixamind node is: version, indexed block, enabled features (`nfts`, `promotions`,
	     * `post_history`, …) and namespaces.
	     */
	    getInfo(): Promise<{
	        [key: string]: any;
	    }>;
	    /**
	     * One post with its bridge fields, `nft_minted` and `promoted` included.
	     */
	    getPost(author: string, permlink: string, observer?: string): Promise<Discussion>;
	    /**
	     * The promoted feed: root posts awaiting payout that PXS was burned for, highest total first
	     * (newest first on a tie), each with `promoted`. `tag` can be a tag, a community or `my` with
	     * an observer. To promote a post: {@link BroadcastAPI.promote}.
	     */
	    getPromotedPosts(query?: PromotedPostsQuery): Promise<Discussion[]>;
	    /**
	     * The payments behind a post, newest first, with its total.
	     * @param limit 1 to 1000, default 100.
	     */
	    getPromotions(author: string, permlink: string, limit?: number): Promise<Promotions>;
	    /**
	     * What an account burned to promote posts, newest first, with its total.
	     * @param limit 1 to 1000, default 100.
	     */
	    getPromotionsBySender(sender: string, limit?: number): Promise<Promotions>;
	    /**
	     * Metadata of a post: format, tags, license, picture size, and when they apply `promoted`,
	     * `versions` (recorded edits) and `nft` (terms and market summary of a minted post).
	     * Throws when the post does not exist.
	     */
	    getContentMetadata(author: string, permlink: string): Promise<ContentMetadata>;
	    /**
	     * Metadata of up to 100 posts in one call, in the order asked; `null` for a post that does not exist.
	     */
	    getContentMetadataBatch(posts: [string, string][] | {
	        author: string;
	        permlink: string;
	    }[]): Promise<(ContentMetadata | null)[]>;
	    /**
	     * Every recorded version of a post or comment, oldest first: the creation, then each edit, with
	     * the fields it changed. `bodies: false` leaves the bodies out.
	     * @param options `start` (version number, from 1), `limit` (1 to 100, default 20), `bodies` (default true)
	     */
	    getPostHistory(author: string, permlink: string, options?: {
	        start?: number;
	        limit?: number;
	        bodies?: boolean;
	    }): Promise<PostHistory>;
	    /**
	     * NFTs and copies by id, at most 100: for `@author/permlink/0` the NFT with its terms and
	     * market summary (copies, for_sale, floor, reserve, reserve_offer, …), for `@author/permlink/N`
	     * copy N with the terms of its NFT under `nft`. Ids that name nothing are left out, so an empty
	     * answer means "not minted".
	     */
	    getNfts(ids: string | string[]): Promise<(PixamindNft | PixamindNftEdition)[]>;
	    /**
	     * One NFT with its terms and market summary; undefined when the post is not minted.
	     */
	    getNft(author: string, permlink: string): Promise<PixamindNft | undefined>;
	    /**
	     * The copies of one NFT, page by page: by number (every copy, reserve included) or by price
	     * (what can be bought now, cheapest first, the offered reserve as copy 0).
	     */
	    listNftEditions(query: NftEditionsQuery): Promise<PixamindPage & {
	        nft_id: string;
	        sort: string;
	        editions: PixamindNftEdition[];
	    }>;
	    /**
	     * NFTs an account minted, newest first, each with its summary, and their `total`.
	     */
	    listCreatedNfts(account: string, options?: {
	        limit?: number;
	        start?: string;
	    }): Promise<PixamindPage & {
	        account: string;
	        total: number;
	        nfts: PixamindNft[];
	    }>;
	    /**
	     * NFTs an account holds copies of, latest acquisition first: the terms, how many it holds and
	     * how many of those are for sale. A creator holds the copies it never parted with;
	     * `acquired_only` leaves those out.
	     */
	    listOwnedNfts(account: string, options?: {
	        acquired_only?: boolean;
	        limit?: number;
	        start?: string;
	    }): Promise<PixamindPage & {
	        account: string;
	        nfts: PixamindOwnedNft[];
	    }>;
	    /**
	     * What can be bought now across all NFTs, each with the terms of its NFT: copies offered on their
	     * own, and offered reserves as one entry each (copy 0, `reserve: true`, `copies`, `next`).
	     */
	    listNftMarket(query?: NftMarketQuery): Promise<PixamindPage & {
	        sort: string;
	        editions: PixamindNftEdition[];
	    }>;
	    /**
	     * History of an NFT (`…/0`: every copy), of one copy (`…/N`: that copy and the mint), or of an
	     * account, newest first: mints, offers, sales, gifts and burns. `limit` up to 1,000.
	     */
	    getNftHistory(query: NftHistoryQuery): Promise<PixamindPage & {
	        history: PixamindNftEvent[];
	    }>;
	    /**
	     * The full license text of an NFT (any copy id names it), with its size and SHA-256; undefined
	     * when the post is not minted. Compare `license_sha256` with the chain's
	     * ({@link NftAPI.getNft}) to check the text is the one minted.
	     */
	    getNftLicense(id: string): Promise<PixamindNftLicense | undefined>;
	}

}
declare module 'dpixa/src/helpers/key' {
	/**
	 * @file Account by key API helpers.
	 * @author Bartłomiej (@engrave) Górnicki
	 */
	import type { PublicKey } from 'dpixa/src/crypto';
	import { Client } from 'dpixa/src/client';
	export interface AccountsByKey {
	    accounts: string[][];
	}
	export class AccountByKeyAPI {
	    readonly client: Client;
	    constructor(client: Client);
	    /**
	     * Convenience for calling `account_by_key_api`.
	     */
	    call(method: string, params?: any): Promise<any>;
	    /**
	     * Returns all accounts that have the key associated with their owner or active authorities.
	     */
	    getKeyReferences(keys: (PublicKey | string)[]): Promise<AccountsByKey>;
	}

}
declare module 'dpixa/src/chain/rc' {
	import { SMTAsset } from 'dpixa/src/chain/asset';
	import { Bignum } from 'dpixa/src/chain/misc';
	export interface RCParams {
	    resource_history_bytes: Resource;
	    resource_new_accounts: Resource;
	    resource_market_bytes: Resource;
	    resource_state_bytes: Resource;
	    resource_execution_time: Resource;
	}
	export interface Resource {
	    resource_dynamics_params: DynamicParam;
	    price_curve_params: PriceCurveParam;
	}
	export interface DynamicParam {
	    resource_unit: number;
	    budget_per_time_unit: number;
	    pool_eq: Bignum;
	    max_pool_size: Bignum;
	    decay_params: {
	        decay_per_time_unit: Bignum;
	        decay_per_time_unit_denom_shift: number;
	    };
	    min_decay: number;
	}
	export interface PriceCurveParam {
	    coeff_a: Bignum;
	    coeff_b: Bignum;
	    shift: number;
	}
	export interface RCPool {
	    resource_history_bytes: Pool;
	    resource_new_accounts: Pool;
	    resource_market_bytes: Pool;
	    resource_state_bytes: Pool;
	    resource_execution_time: Pool;
	}
	export interface Pool {
	    pool: Bignum;
	}
	export interface RCAccount {
	    account: string;
	    rc_manabar: {
	        current_mana: Bignum;
	        last_update_time: number;
	    };
	    max_rc_creation_adjustment: SMTAsset | string;
	    max_rc: Bignum;
	}
	export interface Manabar {
	    current_mana: number;
	    max_mana: number;
	    /** Fill of the bar in basis points: 10000 is full. */
	    percentage: number;
	}
	/** What a vote costs (`RCAPI.calculateVoteCost`). */
	export interface VoteCost {
	    /** Mana the vote uses, in millionths of VESTS (the unit of `voting_manabar`). */
	    mana: number;
	    /** That mana as a percentage of a full bar, two decimals: 3 is 3%. */
	    percentage: number;
	    /** What a 100% vote costs, as a percentage of a full bar: 3 from hardfork 32, 2 before. */
	    full_vote_percentage: number;
	}

}
declare module 'dpixa/src/helpers/rc' {
	import { Account } from 'dpixa/src/chain/account';
	import { DynamicGlobalProperties } from 'dpixa/src/chain/misc';
	import { Manabar, RCAccount, RCParams, RCPool, VoteCost } from 'dpixa/src/chain/rc';
	import { Client } from 'dpixa/src/client';
	export class RCAPI {
	    readonly client: Client;
	    constructor(client: Client);
	    /**
	     * Convenience for calling `rc_api`.
	     */
	    call(method: string, params?: any): Promise<any>;
	    /**
	     * Returns RC data for array of usernames
	     */
	    findRCAccounts(usernames: string[]): Promise<RCAccount[]>;
	    /**
	     * Returns the global resource params
	     */
	    getResourceParams(): Promise<RCParams>;
	    /**
	     * Returns the global resource pool
	     */
	    getResourcePool(): Promise<RCPool>;
	    /**
	     * Makes a API call and returns the RC mana-data for a specified username
	     */
	    getRCMana(username: string): Promise<Manabar>;
	    /**
	     * Makes API calls and returns the voting mana-data for a specified username, refilled with
	     * the refill time the chain has now.
	     */
	    getVPMana(username: string): Promise<Manabar>;
	    /**
	     * Makes API calls and returns the downvote mana-data for a specified username.
	     */
	    getDownvoteMana(username: string): Promise<Manabar>;
	    /**
	     * Makes API calls and returns what a vote of `weight` would cost `username` now.
	     */
	    getVoteCost(username: string, weight: number): Promise<VoteCost>;
	    /**
	     * Calculates the RC mana-data based on an RCAccount - findRCAccounts()
	     */
	    calculateRCMana(rc_account: RCAccount): Manabar;
	    /**
	     * Calculates the voting mana-data based on an Account - getAccounts()
	     * @param props The dynamic global properties (`getDynamicGlobalProperties()`), whose
	     *              `voting_mana_regeneration_seconds` is the refill time of the bar: 576,000 s
	     *              (15% a day) from hardfork 32. Without them, the 432,000 s (20% a day) of
	     *              earlier hardforks is used.
	     */
	    calculateVPMana(account: Account, props?: Partial<DynamicGlobalProperties>): Manabar;
	    /**
	     * Calculates the downvote mana-data based on an Account - getAccounts(). The downvote bar holds
	     * `downvote_pool_percent` of the voting bar and refills in the same time.
	     */
	    calculateDownvoteMana(account: Account, props: Partial<DynamicGlobalProperties>): Manabar;
	    /**
	     * What a vote of `weight` (-10000 to 10000) costs the voter, exactly as the node computes it
	     * since hardfork 28: `ceil(floor(effective vests * |weight| * 86400 / 10000) /
	     * (vote_power_reserve_rate * voting_mana_regeneration_seconds))`. From hardfork 32 a 100% vote
	     * costs 3% of a full bar (2% before). A downvote is paid from the downvote bar first.
	     */
	    calculateVoteCost(account: Account, weight: number, props: Partial<DynamicGlobalProperties>): VoteCost;
	    /**
	     * Internal convenience method to reduce redundant code
	     */
	    private _calculateManabar;
	    private accountAndProps;
	}

}
declare module 'dpixa/src/helpers/transaction' {
	/**
	 * @file Transaction status API helpers.
	 * @author Bartłomiej (@engrave) Górnicki
	 */
	import { Client } from 'dpixa/src/client';
	export type TransactionStatus = 'unknown' | 'within_mempool' | 'within_reversible_block' | 'within_irreversible_block' | 'expired_reversible' | 'expired_irreversible' | 'too_old';
	export class TransactionStatusAPI {
	    readonly client: Client;
	    constructor(client: Client);
	    /**
	     * Convenience for calling `transaction_status_api`.
	     */
	    call(method: string, params?: any): Promise<any>;
	    /**
	     * Returns the status of a given transaction id, with the number of its block once it is in one.
	     * Pass the transaction's `expiration` to tell an expired transaction from an unknown one.
	     */
	    findTransaction(transaction_id: string, expiration?: string): Promise<{
	        status: TransactionStatus;
	        block_num?: number;
	    }>;
	}

}
declare module 'dpixa/src/client' {
	/**
	 * @file Hive/Pixa RPC client implementation.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	import { BBuffer as Buffer } from 'dpixa/src/bbuffer';
	import { Blockchain } from 'dpixa/src/helpers/blockchain';
	import { BroadcastAPI } from 'dpixa/src/helpers/broadcast';
	import { DatabaseAPI } from 'dpixa/src/helpers/database';
	import { NftAPI } from 'dpixa/src/helpers/nft';
	import { PixamindAPI } from 'dpixa/src/helpers/pixamind';
	import { AccountByKeyAPI } from 'dpixa/src/helpers/key';
	import { RCAPI } from 'dpixa/src/helpers/rc';
	import { TransactionStatusAPI } from 'dpixa/src/helpers/transaction';
	/**
	 * Library version.
	 */
	export const VERSION: string;
	/**
	 * Main Pixa network chain id.
	 */
	export const DEFAULT_CHAIN_ID: Buffer;
	/**
	 * Main Pixa network address prefix.
	 */
	export const DEFAULT_ADDRESS_PREFIX = "PIX";
	/**
	 * RPC Client options
	 * ------------------
	 */
	export interface ClientOptions {
	    /**
	     * Pixa chain id. Defaults to main pixa network:
	     * need the new id?
	     * `18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e`
	     *
	     */
	    chainId?: string;
	    /**
	     * Pixa address prefix. Defaults to main network:
	     * `PIX`
	     */
	    addressPrefix?: string;
	    /**
	     * Send timeout, how long to wait in milliseconds before giving
	     * up on a rpc call. Note that this is not an exact timeout,
	     * no in-flight requests will be aborted, they will just not
	     * be retried any more past the timeout.
	     * Can be set to 0 to retry forever. Defaults to 60 * 1000 ms.
	     */
	    timeout?: number;
	    /**
	     * Specifies the amount of times the urls (RPC nodes) should be
	     * iterated and retried in case of timeout errors.
	     * (important) Requires url parameter to be an array (string[])!
	     * Can be set to 0 to iterate and retry forever. Defaults to 3 rounds.
	     */
	    failoverThreshold?: number;
	    /**
	     * Whether a console.log should be made when RPC failed over to another one
	     */
	    consoleOnFailover?: boolean;
	    /**
	     * Retry backoff function, returns milliseconds. Default: `min((tries * 10)^2, 10000)`.
	     */
	    backoff?: (tries: number) => number;
	    /**
	     * Node.js http(s) agent, use if you want http keep-alive.
	     * Defaults to using https.globalAgent.
	     * @see https://nodejs.org/api/http.html#http_new_agent_options.
	     */
	    agent?: any;
	    /**
	     * Deprecated - don't use
	     */
	    rebrandedApi?: boolean;
	}
	/**
	 * RPC Client
	 * ----------
	 * Can be used in both node.js and the browser. Also see {@link ClientOptions}.
	 */
	export class Client {
	    /**
	     * Client options, *read-only*.
	     */
	    readonly options: ClientOptions;
	    /**
	     * Address to Pixa RPC server.
	     * String or String[] *read-only*
	     */
	    address: string | string[];
	    /**
	     * Database API helper.
	     */
	    readonly database: DatabaseAPI;
	    /**
	     * RC API helper.
	     */
	    readonly rc: RCAPI;
	    /**
	     * Broadcast API helper.
	     */
	    readonly broadcast: BroadcastAPI;
	    /**
	     * Blockchain helper.
	     */
	    readonly blockchain: Blockchain;
	    /**
	     * Pixamind helper.
	     */
	    readonly pixamind: PixamindAPI;
	    /**
	     * Native NFTs (hardfork 32): chain queries and the actions of nft_operation.
	     */
	    readonly nft: NftAPI;
	    /**
	     * Accounts by key API helper.
	     */
	    readonly keys: AccountByKeyAPI;
	    /**
	     * Transaction status API helper.
	     */
	    readonly transaction: TransactionStatusAPI;
	    /**
	     * Chain ID for current network.
	     */
	    readonly chainId: Buffer;
	    /**
	     * Address prefix for current network.
	     */
	    readonly addressPrefix: string;
	    /**
	     * The RPC node requests go to now; changes when the client fails over to another address.
	     */
	    currentAddress: string;
	    private timeout;
	    private backoff;
	    private failoverThreshold;
	    private consoleOnFailover;
	    /**
	     * @param address The address to the Pixa RPC server,
	     * e.g. `https://api.pixagram.com`. or [`https://api.pixagram.com`, `https://another.api.com`]
	     * @param options Client options.
	     */
	    constructor(address: string | string[], options?: ClientOptions);
	    /**
	     * Create a new client instance configured for the testnet.
	     */
	    static testnet(options?: ClientOptions): Client;
	    /**
	     * Make a RPC call to the server.
	     *
	     * @param api     The API to call, e.g. `database_api`.
	     * @param method  The API method, e.g. `get_dynamic_global_properties`.
	     * @param params  Array of parameters to pass to the method, optional.
	     *
	     */
	    call(api: string, method: string, params?: any): Promise<any>;
	    updateOperations(_rebrandedApi?: boolean): void;
	}

}
declare module 'dpixa/src/index-lite' {
	/**
	 * @file dpixa lite entry point: RPC client and chain helpers, no cryptography.
	 *
	 * `import { Client } from '@pixagram/dpixa/lite'` gives the JSON-RPC client
	 * (database, rc, pixamind, blockchain, keys, transaction status), assets,
	 * prices and utils without loading secp256k1, the hash functions or AES.
	 * `client.broadcast` and `utils.buildWitnessUpdateOp` become usable as soon
	 * as `@pixagram/dpixa/crypto` is loaded (e.g. with a dynamic import when the
	 * user first needs to sign).
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	import * as utils from 'dpixa/src/utils';
	export { utils };
	export * from 'dpixa/src/helpers/blockchain';
	export * from 'dpixa/src/helpers/broadcast';
	export * from 'dpixa/src/helpers/database';
	export * from 'dpixa/src/helpers/rc';
	export * from 'dpixa/src/helpers/key';
	export * from 'dpixa/src/helpers/nft';
	export * from 'dpixa/src/helpers/pixamind';
	export * from 'dpixa/src/helpers/transaction';
	export * from 'dpixa/src/chain/account';
	export * from 'dpixa/src/chain/asset';
	export * from 'dpixa/src/chain/block';
	export * from 'dpixa/src/chain/comment';
	export * from 'dpixa/src/chain/misc';
	export * from 'dpixa/src/chain/nft';
	export * from 'dpixa/src/chain/normalize';
	export * from 'dpixa/src/chain/operation';
	export * from 'dpixa/src/chain/rc';
	export * from 'dpixa/src/chain/transaction';
	export * from 'dpixa/src/chain/pixamind';
	export * from 'dpixa/src/client';

}
declare module 'dpixa/src/chain/deserializer' {
	export type Deserializer = (buffer: any) => void;
	export const types: {
	    EncryptedMemoD: any;
	};

}
declare module 'dpixa/src/helpers/aes' {
	import { BBuffer as Buffer } from 'dpixa/src/bbuffer';
	import type { PrivateKey, PublicKey } from 'dpixa/src/crypto';
	export const encrypt: (private_key: PrivateKey, public_key: PublicKey, message: Buffer, nonce?: string) => any;
	export const decrypt: (private_key: PrivateKey, public_key: PublicKey, nonce: any, message: any, checksum: number) => any;
	/**
	 * This method does not use a checksum, the returned data must be validated some other way.
	 * @arg {string|Buffer} ciphertext - binary format
	 * @return {Buffer} the decrypted message
	 */
	export const cryptoJsDecrypt: (message: Buffer, tag: any, iv: any) => Buffer;
	/**
	 * This method does not use a checksum, the returned data must be validated some other way.
	 * @arg {string|Buffer} plaintext - binary format
	 * @return {Buffer} binary
	 */
	export const cryptoJsEncrypt: (message: Buffer, tag: any, iv: any) => Buffer;

}
declare module 'dpixa/src/memo' {
	import { PrivateKey, PublicKey } from 'dpixa/src/crypto';
	export const Memo: {
	    decode: (private_key: PrivateKey | string, memo: string) => string;
	    encode: (private_key: PrivateKey | string, public_key: PublicKey | string, memo: string, testNonce?: string) => string;
	};

}
declare module 'dpixa/src/index-crypto' {
	/**
	 * @file dpixa crypto entry point: keys, signatures, serialization, memos.
	 *
	 * `import { PrivateKey, cryptoUtils, Memo, Types } from '@pixagram/dpixa/crypto'`.
	 * Loading this module also enables signing and broadcasting on clients
	 * created from the lite entry point.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	export * from 'dpixa/src/crypto';
	export * from 'dpixa/src/memo';
	export * from 'dpixa/src/chain/serializer';

}
declare module 'dpixa' {
	/**
	 * @file dpixa exports.
	 *
	 * The full API is the union of the two halves, which can also be loaded
	 * separately to keep the first download small:
	 *   - ./index-lite   (`@pixagram/dpixa/lite`)   RPC client, no cryptography
	 *   - ./index-crypto (`@pixagram/dpixa/crypto`) keys, signing, memos
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	export * from 'dpixa/src/index-lite';
	export * from 'dpixa/src/index-crypto';

}
declare module 'dpixa/src/index-browser' {
	/**
	 * @file dpixa entry point for browsers.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	export * from 'dpixa';

}
declare module 'dpixa/src/index-node' {
	/**
	 * @file dpixa entry point for node.js.
	 * @author Johan Nordberg <code@johan-nordberg.com> / Matias Affolter
	 * @license
	 * Copyright (c) 2017 Johan Nordberg. All Rights Reserved.
	 * Copyright (c) 2025 Matias Affolter. All Rights Reserved.
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
	export * from 'dpixa';

}
