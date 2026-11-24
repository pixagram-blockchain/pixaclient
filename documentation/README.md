**@pixagram/dpixa**

***

# [dpixa](https://github.com/pixagram-blockchain/pixaclient)

JavaScript and TypeScript client for the [Pixa](https://pixa.org) blockchain: a JSON-RPC client with failover, transaction signing, keys and memo encryption, and helpers for Pixamind, Pixa's social and NFT indexer. It runs in Node.js 20.19 or later and in every browser with `BigInt`.

```bash
npm install @pixagram/dpixa
```

```js
import { Client, PrivateKey } from "@pixagram/dpixa";

const client = new Client("https://api.pixagram.com");
const [account] = await client.database.getAccounts(["pixagram"]);
```

Pixa's assets, as this library writes them:

| Symbol | What it is |
|---|---|
| `PIXA` | The chain's token (ticker PIXA; PXA is an alias) |
| `PXS` | Pixa Supra, the chain's Big Mac referenced supracoin; the witnesses' price feed gives its value in PIXA |
| `VESTS` | Staked PIXA, shown in apps as Pixa Power (PXP) |

API reference generated from the source: [HTML](https://pixagram.com/dpixa), built into `docs/`, and [Markdown](https://github.com/pixagram-blockchain/pixaclient/tree/main/documentation), built into `documentation/`. Changes by version: [CHANGELOG.md](https://github.com/pixagram-blockchain/pixaclient/blob/main/CHANGELOG.md).

## What's new in 1.7.0

Version 1.7.0 supports chain hardfork 32 and Pixamind's new methods:

- **NFTs**: the `nft` operation (37) with its five actions, checked byte for byte against the node; `client.nft` to mint, offer, buy, give and burn copies and to read them from the chain; Pixamind's NFT pages, market, history and license text in `client.pixamind`. See [NFTs](#nfts-hardfork-32).
- **The reserve**: every copy that never left its author, offered at one price in one action (`client.nft.offerReserve`, `buyFromReserve`).
- **The voting bar**: a 100% vote now costs 3% of the bar and the bar refills 15% a day. `client.rc` reads the refill time from the chain and computes what a vote costs. See [Voting bar](#voting-bar-hardfork-32).
- **Promoted posts**: `client.broadcast.promote` burns PXS for a post; `client.pixamind.getPromotedPosts` reads the promoted feed. See [Promoted posts](#promoted-posts).
- **Post metadata and history**: `client.pixamind.getContentMetadata` and `getPostHistory`.
- **New home**: dpixa lives in the [pixaclient](https://github.com/pixagram-blockchain/pixaclient) repository, with the history of `pixagram-blockchain/dpixa`. The npm package keeps its name, `@pixagram/dpixa`.
- **pixacore 1.32.0**: the node of hardfork 32 uses Pixa's names in its JSON and still reads Hive's; dpixa works with it and with earlier nodes. See [Pixa names and node names](#pixa-names-and-node-names).
- **Fixes**: operation 37 is `nft`, no longer `reset_account`. Witness properties named `pxs_*` are now written under the names the node reads. Payout and reward fields are written under both of their names, so the node always reads the value that was signed (see [Pixa names and node names](#pixa-names-and-node-names)). `client.broadcast.claimRewardBalance` exists, as this README already documented. The serializer test vectors are corrected. The lint gate (`npm test`) passes.

## Table of Contents

- [What's new in 1.7.0](#whats-new-in-170)
- [Installation](#installation)
  - [Lite and crypto entry points](#lite-and-crypto-entry-points)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
  - [Client](#client)
  - [Database API](#database-api) — `client.database`
  - [Blockchain](#blockchain) — `client.blockchain`
  - [Broadcast API](#broadcast-api) — `client.broadcast`
  - [Resource Credits API](#resource-credits-api) — `client.rc`
  - [Pixamind API](#pixamind-api) — `client.pixamind`
  - [Account By Key API](#account-by-key-api) — `client.keys`
  - [Transaction Status API](#transaction-status-api) — `client.transaction`
- [NFTs (hardfork 32)](#nfts-hardfork-32) — `client.nft`
  - [Minting](#minting)
  - [Selling and buying a copy](#selling-and-buying-a-copy)
  - [The reserve: every untouched copy at one price](#the-reserve-every-untouched-copy-at-one-price)
  - [Gifts and burns](#gifts-and-burns)
  - [Reading NFTs](#reading-nfts)
  - [NFT helpers](#nft-helpers)
  - [The nft operation](#the-nft-operation)
- [Voting bar (hardfork 32)](#voting-bar-hardfork-32)
- [Promoted posts](#promoted-posts)
- [Post metadata and history](#post-metadata-and-history)
- [Pixa names and node names](#pixa-names-and-node-names)
- [Working with Assets](#working-with-assets)
- [Cryptography](#cryptography)
- [Building Transactions](#building-transactions)
- [Operations Reference](#operations-reference)
- [Utilities](#utilities)
- [Serialization](#serialization)
- [Error Handling](#error-handling)
- [Types & Interfaces](#types--interfaces)
- [Enumerations](#enumerations)
- [Constants](#constants)
- [Advanced Usage](#advanced-usage)
- [Testing](#testing)
- [Important Notes](#important-notes)
- [License](#license)

---

## Installation

### Via npm

```bash
npm install @pixagram/dpixa
```

### Via yarn

```bash
yarn add @pixagram/dpixa
```

### Via CDN

```html
<script src="https://unpkg.com/@pixagram/dpixa@latest/dist/dpixa.js"></script>
```

### Self-hosted

Download `dist/dpixa.js` from the repository and include it in your HTML:

```html
<script src="dpixa.js"></script>
```

### Lite and crypto entry points

Reading from the chain only needs the JSON-RPC client. Keys, signatures, transaction serialization and memo encryption (secp256k1, SHA-2, RIPEMD-160, AES) are about two thirds of the library, so they live in a separate entry point that you can load when the user first needs to sign:

| Import | Contains |
| --- | --- |
| `@pixagram/dpixa/lite` | `Client` (database, rc, pixamind, nft, blockchain, keys, transaction, broadcast), `Asset`, `Price`, `Authority`, `HexBuffer`, `utils`, NFT helpers, chain types — no cryptography |
| `@pixagram/dpixa/crypto` | `PrivateKey`, `PublicKey`, `Signature`, `cryptoUtils`, `Memo`, `Types`, `NETWORK_ID` |
| `@pixagram/dpixa` | everything (lite + crypto), same API as before |

```js
import { Client } from "@pixagram/dpixa/lite";

const client = new Client("https://api.pixagram.com");
const [account] = await client.database.getAccounts(["primerz"]);

// later, e.g. when the user clicks "vote": fetch the crypto chunk on demand
const { PrivateKey } = await import("@pixagram/dpixa/crypto");
await client.broadcast.vote(
  { voter: "primerz", author: "pixagram", permlink: "hello", weight: 10000 },
  PrivateKey.fromString(wif)
);
```

Loading `@pixagram/dpixa/crypto` anywhere enables signing on every client, including ones created earlier from the lite entry point. Until then, `client.broadcast.sign/send/sendOperations/…` and `utils.buildWitnessUpdateOp` throw an error telling you to load it, before any request is sent. All three entry points share the same classes, so mixing them is safe.

Prebuilt standalone bundles (global `dpixa`, no dependencies) are in `dist/`:

| File | Size (min / gzip) |
| --- | --- |
| `dist/dpixa-lite.js` | ~38 kB / ~13 kB — lite only |
| `dist/dpixa.js` | ~91 kB / ~33 kB — full (1.5.x was ~1.1 MB / ~240 kB) |

`utils.iteratorStream()` and the `get*Stream()` methods return real Node.js streams under Node. In browsers they now return a small built-in stream (`on('data' | 'end' | 'error')`, `pipe`, `pause`/`resume`, `for await`) instead of bundling the `stream` polyfill; prefer the async iterators (`getBlocks()`, `getOperations()`, …) in new browser code.

---

## Quick Start

### Browser Usage

```html
<script src="https://unpkg.com/@pixagram/dpixa@latest/dist/dpixa.js"></script>
<script>
  const client = new dpixa.Client("https://api.pixagram.com");

  client.database
    .getDiscussions("trending", { tag: "pixelart", limit: 5 })
    .then(function(discussions) {
      discussions.forEach(post => {
        console.log(`${post.title} by @${post.author}`);
      });
    });
</script>
```

### Node.js with ES Modules

```js
import { Client } from "@pixagram/dpixa";

const client = new Client("https://api.pixagram.com");

async function main() {
  const props = await client.database.getDynamicGlobalProperties();
  console.log(`Current block: ${props.head_block_number}`);
}

main();
```

### Node.js with CommonJS

```js
const { Client, PrivateKey } = require("@pixagram/dpixa");

const client = new Client(["https://api.pixagram.com"]);

// Vote on a post
const key = PrivateKey.fromLogin("username", "password", "posting");

client.broadcast
  .vote(
    {
      voter: "username",
      author: "pixagram",
      permlink: "hello-pixa",
      weight: 10000
    },
    key
  )
  .then(result => {
    console.log(`Sent: transaction ${result.id}`);
  });
```

---

## Core Concepts

### Client

The `Client` class is your main entry point to interact with the Pixa blockchain. It manages RPC connections, provides access to various APIs, and handles failover between multiple nodes.

#### Creating a Client

```js
import { Client } from "@pixagram/dpixa";

// One node, or several for failover: requests move to the next address when one fails
const client = new Client("https://api.pixagram.com");
const withFailover = new Client(["https://api.pixagram.com", "https://your-own-node.example"]);

// With custom options
const clientWithOptions = new Client(["https://api.pixagram.com"], {
  timeout: 30000,              // Request timeout in ms (default: 60000)
  failoverThreshold: 3,        // Retry rounds before giving up
  consoleOnFailover: true,     // Log when failing over to another node
  addressPrefix: "PIX",        // Network address prefix
  chainId: "your-chain-id"    // Custom chain ID
});
```

#### Using Testnet

```js
// Create a client configured for testnet
const testClient = Client.testnet();
```

#### Making Raw RPC Calls

```js
// Direct RPC call to any API
const result = await client.call("database_api", "get_dynamic_global_properties", []);
```

<details>
<summary><strong>📋 Client Options Reference</strong></summary>

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | `number` | `60000` | Request timeout in milliseconds. Set to `0` to retry forever. |
| `failoverThreshold` | `number` | `3` | Number of retry rounds across all URLs before failing. Set to `0` for infinite retries. |
| `consoleOnFailover` | `boolean` | `false` | Log failover events to console |
| `addressPrefix` | `string` | `"PIX"` | Network address prefix for key encoding |
| `chainId` | `string` | Main chain ID | Blockchain chain ID (32-byte hex string) |
| `agent` | `http.Agent` | `https.globalAgent` | Custom HTTP agent for keep-alive connections |
| `backoff` | `(tries: number) => number` | Default backoff | Custom retry backoff function returning milliseconds |

</details>

#### Client Properties

```js
// Available API helpers
client.database   // DatabaseAPI - Query blockchain state
client.broadcast  // BroadcastAPI - Send transactions
client.blockchain // Blockchain - Stream blocks and operations
client.rc         // RCAPI - Resource credits
client.keys       // AccountByKeyAPI - Find accounts by key
client.pixamind   // PixamindAPI - Communities, NFT pages, promoted feed, post metadata
client.nft        // NftAPI - NFTs: chain reads and actions (hardfork 32)
client.transaction // TransactionStatusAPI - Check transaction status

// Network configuration (read-only)
client.chainId        // Buffer - Current chain ID
client.addressPrefix  // string - Address prefix (e.g., "PIX")
client.address        // string | string[] - Configured RPC addresses
client.options        // ClientOptions - Current options

// Mutable
client.currentAddress // string - Currently active RPC node
```

---

### Database API

The `DatabaseAPI` provides methods to query blockchain state, retrieve accounts, blocks, and content.

---

#### `getDynamicGlobalProperties()`

Returns the current state of the blockchain.

**Returns:** `Promise<`[`DynamicGlobalProperties`](#-dynamicglobalproperties-interface)`>`

```js
const props = await client.database.getDynamicGlobalProperties();
```

<details>
<summary><strong>📤 Example Response</strong></summary>

```js
{
  id: 0,
  head_block_number: 12345678,
  head_block_id: "00bc614e...",
  time: "2024-01-15T12:30:00",
  current_witness: "witness-name",
  total_pow: 514415,
  num_pow_witnesses: 172,
  virtual_supply: "400000000.000 PIXA",
  current_supply: "380000000.000 PIXA",
  current_pxs_supply: "15000000.000 PXS",
  total_vesting_fund_pixa: "150000000.000 PIXA",
  total_vesting_shares: "300000000000.000000 VESTS",
  total_reward_fund_pixa: "800000.000 PIXA",
  pending_rewarded_vesting_shares: "500000.000000 VESTS",
  pending_rewarded_vesting_pixa: "250.000 PIXA",
  pxs_interest_rate: 1000,  // 10% APR
  pxs_print_rate: 10000,
  maximum_block_size: 65536,
  current_aslot: 12500000,
  recent_slots_filled: "340282366920938463463374607431768211455",
  participation_count: 128,
  last_irreversible_block_num: 12345660,
  vote_power_reserve_rate: 10,
  current_reserve_ratio: 200000000
}
```

</details>

**Use Cases:**
- Check current block height
- Calculate VESTS to PIXA conversion
- Monitor network participation
- Get current witness schedule

```js
// Practical example: Calculate PIXA Power from VESTS
const props = await client.database.getDynamicGlobalProperties();
const totalVestingFund = Asset.fromString(props.total_vesting_fund_pixa);
const totalVestingShares = Asset.fromString(props.total_vesting_shares);

function vestsToPixa(vests) {
  return (vests * totalVestingFund.amount) / totalVestingShares.amount;
}

console.log(`1M VESTS = ${vestsToPixa(1000000).toFixed(3)} PIXA`);
```

---

#### `getChainProperties()`

Returns the median chain properties as voted by witnesses.

**Returns:** `Promise<`[`ChainProperties`](#-chainproperties-interface)`>`

```js
const chainProps = await client.database.getChainProperties();
```

<details>
<summary><strong>📤 Example Response</strong></summary>

```js
{
  account_creation_fee: "3.000 PIXA",
  maximum_block_size: 65536,
  pxs_interest_rate: 1000  // 10% APR (basis points)
}
```

</details>

**Use Cases:**
- Check minimum account creation fee
- Get current interest rate on PXS

```js
// Calculate actual account creation fee (30x the base fee)
const props = await client.database.getChainProperties();
const baseFee = Asset.fromString(props.account_creation_fee);
const actualFee = baseFee.multiply(30);
console.log(`Account creation costs: ${actualFee}`); // "90.000 PIXA"
```

---

#### `getCurrentMedianHistoryPrice()`

Returns the median PIXA/PXS price feed as reported by witnesses.

**Returns:** `Promise<`[`Price`](#price-class)`>`

```js
const price = await client.database.getCurrentMedianHistoryPrice();
```

<details>
<summary><strong>📤 Example Response</strong></summary>

```js
{
  base: "0.500 PXS",
  quote: "1.000 PIXA"
}
// This means 1 PIXA = 0.5 PXS
```

</details>

**Use Cases:**
- Value PIXA in PXS at the witnesses' median feed
- Estimate post payouts

```js
const price = await client.database.getCurrentMedianHistoryPrice();
const priceObj = Price.from(price);

// Convert PIXA to PXS value
const pixaAmount = Asset.fromString("100.000 PIXA");
const pxsValue = priceObj.convert(pixaAmount);
console.log(`100 PIXA ≈ ${pxsValue}`); // "50.000 PXS"
```

---

#### `getConfig()`

Returns the compile-time configuration of the node.

**Returns:** `Promise<{[name: string]: string | number | boolean}>`

```js
const config = await client.database.getConfig();
```

<details>
<summary><strong>📤 Example Response (partial)</strong></summary>

```js
{
  IS_TEST_NET: false,
  PIXA_BLOCKCHAIN_HARDFORK_VERSION: "1.27.0",
  PIXA_BLOCK_INTERVAL: 3,
  PIXA_BLOCKS_PER_DAY: 28800,
  PIXA_BLOCKS_PER_YEAR: 10512000,
  PIXA_CASHOUT_WINDOW_SECONDS: 604800,
  PIXA_CREATE_ACCOUNT_WITH_PIXA_MODIFIER: 30,
  PIXA_MAX_ACCOUNT_NAME_LENGTH: 16,
  PIXA_MAX_MEMO_SIZE: 2048,
  PIXA_MIN_ACCOUNT_NAME_LENGTH: 3,
  PIXA_SAVINGS_WITHDRAW_TIME: 259200,
  PIXA_VESTING_WITHDRAW_INTERVALS: 13,
  PIXA_VOTE_DUST_THRESHOLD: 50000000
  // ... many more
}
```

</details>

---

#### `getState(path)`

Returns the complete state for a URL path (legacy, use specific methods when possible).

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | URL path like `@username` or `trending/tag` |

**Returns:** `Promise<any>`

```js
// Get state for a user profile
const state = await client.database.getState("@alice");

// Get state for a tag
const tagState = await client.database.getState("trending/photography");
```

---

#### `getBlockHeader(blockNum)`

Returns the header of a specific block (without transactions).

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `blockNum` | `number` | Block number to fetch |

**Returns:** `Promise<`[`BlockHeader`](#-blockheader-interface)`>`

```js
const header = await client.database.getBlockHeader(12345678);
```

<details>
<summary><strong>📤 Example Response</strong></summary>

```js
{
  previous: "00bc614d...",
  timestamp: "2024-01-15T12:30:00",
  witness: "witness-name",
  transaction_merkle_root: "0000000000000000000000000000000000000000",
  extensions: []
}
```

</details>

---

#### `getBlock(blockNum)`

Returns a complete block including all transactions.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `blockNum` | `number` | Block number to fetch |

**Returns:** `Promise<`[`SignedBlock`](#-signedblock-interface)`>`

```js
const block = await client.database.getBlock(12345678);
```

<details>
<summary><strong>📤 Example Response</strong></summary>

```js
{
  previous: "00bc614d...",
  timestamp: "2024-01-15T12:30:00",
  witness: "witness-name",
  transaction_merkle_root: "abc123...",
  extensions: [],
  witness_signature: "1f4a2b...",
  block_id: "00bc614e...",
  signing_key: "PIX7abc...",
  transaction_ids: ["trx123...", "trx456..."],
  transactions: [
    {
      ref_block_num: 12345,
      ref_block_prefix: 987654321,
      expiration: "2024-01-15T12:31:00",
      operations: [
        ["vote", { voter: "alice", author: "bob", permlink: "post", weight: 10000 }]
      ],
      extensions: [],
      signatures: ["1f5b3c..."]
    }
  ]
}
```

</details>

**Use Cases:**
- Analyze block contents
- Process historical data
- Verify transactions

```js
// Process all transfers in a block
const block = await client.database.getBlock(12345678);

for (const tx of block.transactions) {
  for (const op of tx.operations) {
    const [opType, opData] = op;
    if (opType === "transfer") {
      console.log(`${opData.from} → ${opData.to}: ${opData.amount}`);
    }
  }
}
```

---

#### `getOperations(blockNum, onlyVirtual?)`

Returns all operations from a block, including virtual operations.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `blockNum` | `number` | - | Block number |
| `onlyVirtual` | `boolean` | `false` | Return only virtual operations |

**Returns:** `Promise<`[`AppliedOperation[]`](#-appliedoperation-interface)`>`

```js
// Get all operations
const allOps = await client.database.getOperations(12345678);

// Get only virtual operations (rewards, etc.)
const virtualOps = await client.database.getOperations(12345678, true);
```

<details>
<summary><strong>📤 Example Response</strong></summary>

```js
[
  {
    trx_id: "abc123...",
    block: 12345678,
    trx_in_block: 0,
    op_in_trx: 0,
    virtual_op: 0,
    timestamp: "2024-01-15T12:30:00",
    op: ["vote", { voter: "alice", author: "bob", permlink: "post", weight: 10000 }]
  },
  {
    trx_id: "0000000000000000000000000000000000000000",
    block: 12345678,
    trx_in_block: 65535,
    op_in_trx: 0,
    virtual_op: 1,
    timestamp: "2024-01-15T12:30:00",
    op: ["curation_reward", { curator: "alice", reward: "1.234567 VESTS", ... }]
  }
]
```

</details>

---

#### `getAccounts(usernames)`

Returns detailed information for multiple accounts.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `usernames` | `string[]` | Array of account names (max 1000) |

**Returns:** `Promise<`[`ExtendedAccount[]`](#-account-interface)`>`

```js
const accounts = await client.database.getAccounts(["alice", "bob", "charlie"]);
```

<details>
<summary><strong>📤 Example Response (single account)</strong></summary>

```js
[
  {
    id: 12345,
    name: "alice",
    owner: {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [["PIX7abc...", 1]]
    },
    active: { /* similar structure */ },
    posting: { /* similar structure */ },
    memo_key: "PIX7xyz...",
    json_metadata: "{\"profile\":{\"name\":\"Alice\"}}",
    posting_json_metadata: "{\"profile\":{\"about\":\"Hello!\"}}",
    proxy: "",
    
    balance: "100.000 PIXA",
    savings_balance: "50.000 PIXA",
    pxs_balance: "25.000 PXS",
    savings_pxs_balance: "10.000 PXS",
    
    vesting_shares: "1000000.000000 VESTS",
    delegated_vesting_shares: "100000.000000 VESTS",
    received_vesting_shares: "50000.000000 VESTS",
    vesting_withdraw_rate: "0.000000 VESTS",
    
    reward_pixa_balance: "1.000 PIXA",
    reward_pxs_balance: "0.500 PXS",
    reward_vesting_balance: "100.000000 VESTS",
    reward_vesting_pixa: "0.050 PIXA",
    
    voting_power: 9800,  // 98%
    voting_manabar: {
      current_mana: "950000000000",
      last_update_time: 1705320600
    },
    
    post_count: 150,
    created: "2020-01-01T00:00:00",
    last_post: "2024-01-14T10:00:00",
    last_vote_time: "2024-01-15T12:00:00",
    
    curation_rewards: 50000,
    posting_rewards: 100000,
    
    witnesses_voted_for: 30
  }
]
```

</details>

**Use Cases:**
- Display user profiles
- Check balances
- Verify account authority

```js
// Get account and display formatted info
const [account] = await client.database.getAccounts(["alice"]);

if (account) {
  console.log(`@${account.name}`);
  console.log(`Balance: ${account.balance}`);
  console.log(`Pixa Power: ${account.vesting_shares}`);
  console.log(`Voting Power: ${(account.voting_power / 100).toFixed(2)}%`);
  console.log(`Posts: ${account.post_count}`);
  
  // Parse profile metadata
  try {
    const meta = JSON.parse(account.posting_json_metadata || account.json_metadata);
    if (meta.profile) {
      console.log(`Name: ${meta.profile.name || 'N/A'}`);
      console.log(`About: ${meta.profile.about || 'N/A'}`);
    }
  } catch (e) {
    // Invalid JSON metadata
  }
} else {
  console.log("Account not found");
}
```

---

#### `getDiscussions(by, query)`

Returns an array of posts/discussions based on sorting method.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `by` | `DiscussionQueryCategory` | Sorting method |
| `query` | `DisqussionQuery` | Query parameters |

**Returns:** `Promise<`[`Discussion[]`](#-discussion-interface)`>`

**Query Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tag` | `string` | No | Tag name, or username for `blog`/`feed` |
| `limit` | `number` | Yes | Results to return (max 100) |
| `filter_tags` | `string[]` | No | Tags to exclude |
| `select_authors` | `string[]` | No | Only include these authors |
| `select_tags` | `string[]` | No | Only include these tags |
| `truncate_body` | `number` | No | Truncate body to N bytes (0 = all) |
| `start_author` | `string` | No | Pagination: start from this author |
| `start_permlink` | `string` | No | Pagination: start from this permlink |
| `parent_author` | `string` | No | Filter by parent author |
| `parent_permlink` | `string` | No | Filter by parent permlink |

```js
// Get trending posts in a tag
const trending = await client.database.getDiscussions("trending", {
  tag: "photography",
  limit: 20
});

// Get posts from a user's blog
const blog = await client.database.getDiscussions("blog", {
  tag: "alice",  // For 'blog', tag = username
  limit: 10
});

// Get a user's feed (posts from people they follow)
const feed = await client.database.getDiscussions("feed", {
  tag: "alice",
  limit: 10
});

// Pagination
const page1 = await client.database.getDiscussions("trending", {
  tag: "art",
  limit: 20
});

const page2 = await client.database.getDiscussions("trending", {
  tag: "art",
  limit: 20,
  start_author: page1[page1.length - 1].author,
  start_permlink: page1[page1.length - 1].permlink
});
```

<details>
<summary><strong>📋 <a id="discussion-query-categories"></a>Discussion Query Categories</strong></summary>

| Category | Description | Tag Usage |
|----------|-------------|-----------|
| `trending` | Posts sorted by trending algorithm | Tag name |
| `hot` | Hot posts (recent + popular) | Tag name |
| `created` | Newest posts first | Tag name |
| `promoted` | Promoted posts (by spent PXS) | Tag name |
| `active` | Recently active (new comments) | Tag name |
| `blog` | Posts from user's blog | Username |
| `feed` | Posts from followed accounts | Username |
| `comments` | Comments by an author | Username |
| `votes` | Posts sorted by vote count | Tag name |
| `children` | Posts sorted by comment count | Tag name |
| `cashout` | Posts approaching payout | Tag name |

</details>

<details>
<summary><strong>📤 Example Response (single discussion)</strong></summary>

```js
[
  {
    id: 123456,
    author: "alice",
    permlink: "my-awesome-post",
    category: "photography",
    parent_author: "",
    parent_permlink: "photography",
    
    title: "My Awesome Photography Post",
    body: "Here is my post content with **markdown**...",
    json_metadata: "{\"tags\":[\"photography\",\"nature\"],\"image\":[\"https://...\"]}",
    
    created: "2024-01-14T10:00:00",
    last_update: "2024-01-14T10:00:00",
    depth: 0,
    children: 15,
    
    net_rshares: "50000000000000",
    net_votes: 42,
    
    total_payout_value: "0.000 PXS",
    curator_payout_value: "0.000 PXS",
    pending_payout_value: "12.500 PXS",
    
    active_votes: [
      { voter: "bob", weight: 10000, rshares: "1000000000", time: "2024-01-14T10:05:00" }
    ],
    
    author_reputation: 65000000000000,
    
    url: "/photography/@alice/my-awesome-post",
    root_title: "My Awesome Photography Post",
    
    beneficiaries: [],
    max_accepted_payout: "1000000.000 PXS",
    percent_pxs: 10000,
    allow_votes: true,
    allow_curation_rewards: true
  }
]
```

</details>

---

#### `getTransaction(txId)`

Returns a transaction by its ID.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `txId` | `string` | Transaction ID (40-char hex string) |

**Returns:** `Promise<`[`SignedTransaction`](#-transaction-interface)`>`

```js
const tx = await client.database.getTransaction("abc123def456...");
```

<details>
<summary><strong>📤 Example Response</strong></summary>

```js
{
  ref_block_num: 12345,
  ref_block_prefix: 987654321,
  expiration: "2024-01-15T12:31:00",
  operations: [
    ["transfer", {
      from: "alice",
      to: "bob",
      amount: "10.000 PIXA",
      memo: "Payment"
    }]
  ],
  extensions: [],
  signatures: ["1f4a2b3c..."]
}
```

</details>

---

#### `getAccountHistory(account, from, limit, operation_bitmask?)`

Returns account operation history.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `account` | `string` | Account name |
| `from` | `number` | Start index (-1 for most recent) |
| `limit` | `number` | Number of operations (max 1000) |
| `operation_bitmask` | `[number, number]` | Optional: filter by operation types |

**Returns:** `Promise<[[number,` [`AppliedOperation`](#-appliedoperation-interface)`]]>`

```js
// Get last 100 operations
const history = await client.database.getAccountHistory("alice", -1, 100);

// Process results (returns [index, operation] pairs)
for (const [index, op] of history) {
  console.log(`#${index}: ${op.op[0]} at block ${op.block}`);
}
```

**Filtering by Operation Type:**

```js
import { utils } from "@pixagram/dpixa";

const op = utils.operationOrders;

// Create filter for transfer-related operations
const transferFilter = utils.makeBitMaskFilter([
  op.transfer,
  op.transfer_to_vesting,
  op.transfer_to_savings,
  op.transfer_from_savings,
  op.claim_reward_balance
]);

const transfers = await client.database.getAccountHistory(
  "alice",
  -1,
  100,
  transferFilter
);

// Process only transfer operations
for (const [index, operation] of transfers) {
  const [opType, opData] = operation.op;
  console.log(`${opType}: ${JSON.stringify(opData)}`);
}
```

<details>
<summary><strong>📤 Example Response</strong></summary>

```js
[
  [
    12345,  // Operation index
    {
      trx_id: "abc123...",
      block: 12345678,
      trx_in_block: 5,
      op_in_trx: 0,
      virtual_op: 0,
      timestamp: "2024-01-15T12:30:00",
      op: ["transfer", {
        from: "alice",
        to: "bob",
        amount: "10.000 PIXA",
        memo: "Payment"
      }]
    }
  ]
]
```

</details>

---

#### `getVestingDelegations(account, from?, limit?)`

Returns vesting delegations made by an account.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `account` | `string` | - | Delegator account name |
| `from` | `string` | `""` | Start from delegatee (for pagination) |
| `limit` | `number` | `1000` | Max results (max 1000) |

**Returns:** `Promise<`[`VestingDelegation[]`](#-vestingdelegation-interface)`>`

```js
const delegations = await client.database.getVestingDelegations("alice", "", 100);

for (const d of delegations) {
  console.log(`Delegating ${d.vesting_shares} to @${d.delegatee}`);
}
```

<details>
<summary><strong>📤 Example Response</strong></summary>

```js
[
  {
    id: 12345,
    delegator: "alice",
    delegatee: "bob",
    vesting_shares: "100000.000000 VESTS",
    min_delegation_time: "2024-01-20T12:00:00"
  },
  {
    id: 12346,
    delegator: "alice",
    delegatee: "charlie",
    vesting_shares: "50000.000000 VESTS",
    min_delegation_time: "2024-01-22T08:00:00"
  }
]
```

</details>

---

#### `verifyAuthority(signedTransaction)`

Verifies that a signed transaction has valid signatures.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `signedTransaction` | `SignedTransaction` | Transaction with signatures |

**Returns:** `Promise<boolean>`

```js
const isValid = await client.database.verifyAuthority(signedTx);
console.log(`Transaction is ${isValid ? "valid" : "invalid"}`);
```

---

#### `getVersion()`

Returns the version information of the RPC node.

**Returns:** `Promise<{blockchain_version: string, pixa_revision: string, fc_revision: string}>`

```js
const version = await client.database.getVersion();
console.log(`Node version: ${version.blockchain_version}`);
```

---

### Blockchain

The `Blockchain` helper provides streaming capabilities for real-time blockchain data.

---

#### `getCurrentBlockNum(mode?)`

Returns the current block number.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `mode` | `BlockchainMode` | `Irreversible` | Block finality mode |

**Returns:** `Promise<number>`

```js
import { BlockchainMode } from "@pixagram/dpixa";

// Get last irreversible block (confirmed, won't change)
const irreversible = await client.blockchain.getCurrentBlockNum();

// Get head block (may be reversed in case of fork)
const head = await client.blockchain.getCurrentBlockNum(BlockchainMode.Latest);

console.log(`Irreversible: ${irreversible}, Head: ${head}`);
```

---

#### `getCurrentBlockHeader(mode?)`

Returns the current block header.

**Returns:** `Promise<`[`BlockHeader`](#-blockheader-interface)`>`

```js
const header = await client.blockchain.getCurrentBlockHeader();
console.log(`Current witness: ${header.witness}`);
```

---

#### `getCurrentBlock(mode?)`

Returns the current full block.

**Returns:** `Promise<`[`SignedBlock`](#-signedblock-interface)`>`

```js
const block = await client.blockchain.getCurrentBlock();
console.log(`Block has ${block.transactions.length} transactions`);
```

---

#### `getBlockNumbers(options?)`

Returns an async iterator of block numbers.

**Parameters:**

| Option | Type | Description |
|--------|------|-------------|
| `from` | `number` | Starting block (default: current) |
| `to` | `number` | Ending block (default: infinite) |
| `mode` | `BlockchainMode` | Finality mode |

**Returns:** `AsyncGenerator<number>`

```js
// Stream new block numbers indefinitely
for await (const num of client.blockchain.getBlockNumbers()) {
  console.log(`New block: ${num}`);
}

// Process specific range
for await (const num of client.blockchain.getBlockNumbers({ 
  from: 50000000, 
  to: 50000100 
})) {
  console.log(`Processing block ${num}`);
}

// Get latest blocks (may include reversible)
for await (const num of client.blockchain.getBlockNumbers({
  mode: BlockchainMode.Latest
})) {
  console.log(`Head block: ${num}`);
}
```

---

#### `getBlocks(options?)`

Returns an async iterator of full blocks.

**Returns:** `AsyncGenerator<`[`SignedBlock`](#-signedblock-interface)`>`

```js
// Stream all new blocks
for await (const block of client.blockchain.getBlocks()) {
  console.log(`Block #${block.block_id} by @${block.witness}`);
  console.log(`  Transactions: ${block.transactions.length}`);
  
  // Process each transaction
  for (const tx of block.transactions) {
    for (const [opType, opData] of tx.operations) {
      // Handle operations
    }
  }
}

// Start from specific block
for await (const block of client.blockchain.getBlocks({ from: 50000000 })) {
  // Process historical blocks
  if (block.block_id === "target") break;
}
```

---

#### `getOperations(options?)`

Returns an async iterator of all operations (including virtual).

**Returns:** `AsyncGenerator<`[`AppliedOperation`](#-appliedoperation-interface)`>`

```js
// Stream all operations
for await (const appliedOp of client.blockchain.getOperations()) {
  const [opType, opData] = appliedOp.op;
  
  switch (opType) {
    case "transfer":
      console.log(`Transfer: ${opData.from} → ${opData.to}: ${opData.amount}`);
      break;
    case "vote":
      const voteType = opData.weight > 0 ? "upvote" : opData.weight < 0 ? "downvote" : "unvote";
      console.log(`Vote: ${opData.voter} ${voteType} @${opData.author}/${opData.permlink}`);
      break;
    case "curation_reward":  // Virtual operation
      console.log(`Curation reward: ${opData.curator} earned ${opData.reward}`);
      break;
  }
}
```

---

#### Stream Methods (Node.js Streams)

Convert iterators to Node.js readable streams.

**Returns:** `ReadableStream`

```js
// Block number stream
const numStream = client.blockchain.getBlockNumberStream();

// Block stream
const blockStream = client.blockchain.getBlockStream();

// Operations stream
const opStream = client.blockchain.getOperationsStream();

// Use with pipes
const es = require("event-stream");

blockStream
  .pipe(es.map((block, cb) => {
    cb(null, `Block ${block.block_id}\n`);
  }))
  .pipe(process.stdout);
```

---

### Broadcast API

The broadcast API sends transactions to the blockchain and returns a `TransactionConfirmation`.

<details>
<summary><strong>📤 Broadcast Response (TransactionConfirmation)</strong></summary>

```js
{
  id: "6fd7c2b7a1e1b2e5b0a3f1c9d4e8a7b6c5d4e3f2"   // transaction id
}
```

The node answers once it has accepted the transaction, before it is in a block; [`client.transaction.findTransaction(id)`](#transaction-status-api) tells when it is in one.

</details>

---

#### Voting on Content

```js
import { Client, PrivateKey } from "@pixagram/dpixa";

const client = new Client(["https://api.pixagram.com"]);
const postingKey = PrivateKey.fromLogin("myuser", "mypassword", "posting");

// Upvote 100%
const result = await client.broadcast.vote({
  voter: "myuser",
  author: "post-author",
  permlink: "post-permlink",
  weight: 10000  // 100% = 10000
}, postingKey);

console.log(`Vote sent: transaction ${result.id}`);
```

**Vote Weight Guide:**

| Weight | Meaning |
|--------|---------|
| `10000` | 100% upvote |
| `5000` | 50% upvote |
| `0` | Remove vote |
| `-5000` | 50% downvote |
| `-10000` | 100% downvote |

---

#### Transferring Funds

```js
const activeKey = PrivateKey.fromLogin("myuser", "mypassword", "active");

// Transfer PIXA
await client.broadcast.transfer({
  from: "myuser",
  to: "recipient",
  amount: "10.000 PIXA",
  memo: "Here's your payment!"
}, activeKey);

// Transfer PXS
await client.broadcast.transfer({
  from: "myuser",
  to: "recipient",
  amount: "5.000 PXS",
  memo: "PXS transfer"
}, activeKey);

// Encrypted memo (starts with #)
const memoKey = PrivateKey.fromLogin("myuser", "mypassword", "memo");
const recipientMemoKey = "PIX7abc..."; // Get from recipient's account

const encryptedMemo = Memo.encode(memoKey, recipientMemoKey, "Secret message");

await client.broadcast.transfer({
  from: "myuser",
  to: "recipient",
  amount: "1.000 PIXA",
  memo: encryptedMemo  // "#encoded..."
}, activeKey);
```

---

#### Creating Posts and Comments

```js
const postingKey = PrivateKey.fromLogin("myuser", "mypassword", "posting");

// Create a new post
await client.broadcast.comment({
  parent_author: "",              // Empty for root posts
  parent_permlink: "photography", // Category/tag
  author: "myuser",
  permlink: "my-first-photo-post",
  title: "My First Photography Post",
  body: `
# Hello World!

This is my first post with **markdown** support.

![My Photo](https://example.com/photo.jpg)
  `,
  json_metadata: JSON.stringify({
    tags: ["photography", "nature", "introduction"],
    image: ["https://example.com/photo.jpg"],
    app: "myapp/1.0",
    format: "markdown"
  })
}, postingKey);

// Reply to a post
await client.broadcast.comment({
  parent_author: "originalauthor",
  parent_permlink: "original-post",
  author: "myuser",
  permlink: "re-originalauthor-original-post-20240115",
  title: "",  // Replies typically have no title
  body: "Great post! Thanks for sharing this.",
  json_metadata: JSON.stringify({
    tags: ["photography"],
    app: "myapp/1.0"
  })
}, postingKey);
```

---

#### Custom JSON Operations

```js
// Follow a user
await client.broadcast.json({
  required_auths: [],
  required_posting_auths: ["myuser"],
  id: "follow",
  json: JSON.stringify([
    "follow",
    {
      follower: "myuser",
      following: "targetuser",
      what: ["blog"]  // ["blog"] to follow, [] to unfollow
    }
  ])
}, postingKey);

// Reblog/Resteem a post
await client.broadcast.json({
  required_auths: [],
  required_posting_auths: ["myuser"],
  id: "follow",
  json: JSON.stringify([
    "reblog",
    {
      account: "myuser",
      author: "post-author",
      permlink: "post-permlink"
    }
  ])
}, postingKey);
```

---

#### Claiming Rewards

```js
const postingKey = PrivateKey.fromLogin("myuser", "mypassword", "posting");

// First, check pending rewards
const [account] = await client.database.getAccounts(["myuser"]);

console.log(`Pending rewards:`);
console.log(`  PIXA: ${account.reward_pixa_balance}`);
console.log(`  PXS: ${account.reward_pxs_balance}`);
console.log(`  VESTS: ${account.reward_vesting_balance}`);

// Claim all rewards (posting key)
await client.broadcast.claimRewardBalance({
  account: "myuser",
  reward_pixa: account.reward_pixa_balance,
  reward_pxs: account.reward_pxs_balance,
  reward_vests: account.reward_vesting_balance
}, postingKey);
```

#### Promoting a Post

```js
// Burns 1.5 PXS for @alice/cat: a transfer to null with the memo "@alice/cat" (active key)
await client.broadcast.promote({ from: "carol", author: "alice", permlink: "cat", amount: "1.500 PXS" }, activeKey);
```

See [Promoted posts](#promoted-posts).

#### NFT Actions

`client.broadcast.nft({ account, action }, activeKey)` sends one `nft` operation; `client.nft` builds and checks each action (mint, list, unlist, buy, transfer, burn, the reserve). See [NFTs](#nfts-hardfork-32).

---

### Resource Credits API

The RC API helps manage and monitor resource credits (transaction bandwidth).

---

#### `findRCAccounts(usernames)`

Get RC account information for multiple users.

**Returns:** `Promise<RCAccount[]>`

```js
const rcAccounts = await client.rc.findRCAccounts(["alice", "bob"]);

for (const rc of rcAccounts) {
  console.log(`@${rc.account}: ${rc.rc_manabar.current_mana} RC`);
}
```

---

#### `getRCMana(username)` / `getVPMana(username)`

Get calculated mana (regenerated to current time).

**Returns:** `Promise<Manabar>`

```js
// Get RC mana
const rcMana = await client.rc.getRCMana("alice");
console.log(`RC: ${rcMana.current_mana} / ${rcMana.max_mana} (${rcMana.percentage}%)`);

// Get Voting Power mana, refilled with the chain's refill time
const vpMana = await client.rc.getVPMana("alice");
console.log(`VP: ${vpMana.percentage / 100}%`);   // percentage is in basis points

// Downvote mana, and what a vote costs (hardfork 32: 3% of the bar for a 100% vote)
const downMana = await client.rc.getDownvoteMana("alice");
const cost = await client.rc.getVoteCost("alice", 10000);
```

<details>
<summary><strong>📤 Example Manabar Response</strong></summary>

```js
{
  current_mana: 9500000000000,
  max_mana: 10000000000000,
  percentage: 9500  // basis points: 95% of the bar
}
```

</details>

---

#### `getResourceParams()`

Returns the global resource parameters (used for advanced RC cost calculation).

**Returns:** `Promise<RCParams>`

```js
const params = await client.rc.getResourceParams();
console.log(params);
```

---

#### `getResourcePool()`

Returns the global resource pool state.

**Returns:** `Promise<RCPool>`

```js
const pool = await client.rc.getResourcePool();
console.log(pool);
```

---

#### `calculateRCMana(rc_account)`

Calculates the current RC mana from a raw RC account object (as returned by `findRCAccounts()`). Regenerates mana to the current time.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `rc_account` | `RCAccount` | RC account object from `findRCAccounts()` |

**Returns:** `Manabar`

```js
const rcAccounts = await client.rc.findRCAccounts(["alice"]);
const mana = client.rc.calculateRCMana(rcAccounts[0]);
console.log(`RC: ${mana.percentage}%`);
```

---

#### `calculateVPMana(account, props?)`

Calculates the current voting power mana from a standard account object (as returned by `getAccounts()`). Regenerates mana to the current time, with the refill time in `props`.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `account` | [`Account`](#-account-interface) | Account object from `getAccounts()` |
| `props` | [`DynamicGlobalProperties`](#-dynamicglobalproperties-interface) | Optional. Its `voting_mana_regeneration_seconds` is the refill time (576,000 s from hardfork 32); without it, the 432,000 s of earlier hardforks |

**Returns:** `Manabar`

```js
const [account] = await client.database.getAccounts(["alice"]);
const props = await client.database.getDynamicGlobalProperties();
const vp = client.rc.calculateVPMana(account, props);
console.log(`Voting Power: ${vp.percentage / 100}%`);
```

`calculateDownvoteMana(account, props)`, `calculateVoteCost(account, weight, props)`, `getDownvoteMana(username)` and `getVoteCost(username, weight)` are described in [Voting bar](#voting-bar-hardfork-32).

---

### Pixamind API

The Pixamind API provides access to community features and notifications.

---

#### `getRankedPosts(options)`

Get trending, hot, or new posts with community support.

**Returns:** `Promise<`[`Discussion[]`](#-discussion-interface)`>`

```js
const posts = await client.pixamind.getRankedPosts({
  sort: "trending",
  tag: "photography",
  limit: 20
});
```

---

#### `getCommunity(options)`

Get community details.

**Returns:** `Promise<`[`CommunityDetail[]`](#-communitydetail-interface)`>`

```js
const community = await client.pixamind.getCommunity({
  name: "portal-123456"
});
```

<details>
<summary><strong>📤 Example Response</strong></summary>

```js
{
  id: 1234,
  name: "portal-123456",
  title: "Photography Lovers",
  about: "A community for photography enthusiasts",
  lang: "en",
  type_id: 1,
  is_nsfw: false,
  subscribers: 5000,
  sum_pending: 1500,
  num_pending: 100,
  num_authors: 200,
  created_at: "2021-01-01T00:00:00",
  avatar_url: "https://...",
  description: "Welcome to our community!",
  flag_text: "",
  settings: {},
  team: ["admin1", "mod1", "mod2"],
  admins: ["admin1"]
}
```

</details>

---

#### `getAccountPosts(options)`

Get posts by a particular account.

**Parameters:**

| Option | Type | Description |
|--------|------|-------------|
| `sort` | `string` | Sort order: `"blog"`, `"feed"`, `"posts"`, `"comments"`, `"replies"` |
| `account` | `string` | Account name |
| `limit` | `number` | Max results to return |
| `start_author` | `string` | Pagination: start author |
| `start_permlink` | `string` | Pagination: start permlink |

**Returns:** `Promise<`[`Discussion[]`](#-discussion-interface)`>`

```js
const posts = await client.pixamind.getAccountPosts({
  sort: "posts",
  account: "alice",
  limit: 10
});

for (const post of posts) {
  console.log(`${post.title} (${post.pending_payout_value})`);
}
```

---

#### `listCommunities(options)`

List all available communities.

**Parameters:**

| Option | Type | Description |
|--------|------|-------------|
| `last` | `string` | Last community name for pagination |
| `limit` | `number` | Max results to return |
| `sort` | `string` | Sort order: `"rank"`, `"new"`, `"subs"` |
| `query` | `string` | Search query string |

**Returns:** `Promise<`[`CommunityDetail[]`](#-communitydetail-interface)`>`

```js
const communities = await client.pixamind.listCommunities({
  limit: 25,
  sort: "rank"
});

for (const c of communities) {
  console.log(`${c.title} — ${c.subscribers} subscribers`);
}
```

---

#### `listAllSubscriptions(account)`

List all community subscriptions for an account.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `account` | `string \| object` | Account name or `{ account: "name" }` |

**Returns:** `Promise<`[`Discussion[]`](#-discussion-interface)`>` — returns role and community info

```js
const subs = await client.pixamind.listAllSubscriptions("alice");

for (const sub of subs) {
  console.log(`Subscribed to: ${sub.title}`);
}
```

---

#### `getAccountNotifications(options)`

Get notifications for an account.

**Returns:** `Promise<`[`Notifications[]`](#-notifications-interface)`>`

```js
const notifications = await client.pixamind.getAccountNotifications({
  account: "alice",
  limit: 50
});
```

<details>
<summary><strong>📤 Example Response</strong></summary>

```js
[
  {
    id: 12345,
    type: "vote",
    score: 50,
    date: "2024-01-15T12:30:00",
    msg: "@bob voted on your post",
    url: "@alice/my-post"
  },
  {
    id: 12344,
    type: "reply",
    score: 100,
    date: "2024-01-15T12:25:00",
    msg: "@charlie replied to your post",
    url: "@alice/my-post#@charlie/re-alice-my-post"
  }
]
```

</details>

---

#### NFTs, promotion, metadata

| Method | Pixamind method | See |
|--------|-----------------|-----|
| `getNft(author, permlink)`, `getNfts(ids)` | `pixamind_nft.get_nfts` | [Reading NFTs](#reading-nfts) |
| `listNftEditions(query)` | `pixamind_nft.list_editions` | [Reading NFTs](#reading-nfts) |
| `listCreatedNfts(account, options)` | `pixamind_nft.list_created` | [Reading NFTs](#reading-nfts) |
| `listOwnedNfts(account, options)` | `pixamind_nft.list_owned` | [Reading NFTs](#reading-nfts) |
| `listNftMarket(query)` | `pixamind_nft.list_market` | [Reading NFTs](#reading-nfts) |
| `getNftHistory(query)` | `pixamind_nft.get_history` | [Reading NFTs](#reading-nfts) |
| `getNftLicense(id)` | `pixamind_nft.get_license` | [Reading NFTs](#reading-nfts) |
| `getPromotedPosts(query)` | `bridge.get_ranked_posts`, sort `promoted` | [Promoted posts](#promoted-posts) |
| `getPromotions(author, permlink)`, `getPromotionsBySender(sender)` | `pixamind_feed.get_promotions` | [Promoted posts](#promoted-posts) |
| `getContentMetadata(author, permlink)`, `getContentMetadataBatch(posts)` | `pixamind_content.get_content_metadata` | [Post metadata and history](#post-metadata-and-history) |
| `getPostHistory(author, permlink, options)` | `pixamind_content.get_post_history` | [Post metadata and history](#post-metadata-and-history) |
| `getPost(author, permlink, observer?)` | `bridge.get_post` | |
| `getInfo()` | `pixamind_api.get_info` | |
| `callNamespace(namespace, method, params)` | any other method | |

---

### Account By Key API

Find accounts associated with a public key.

---

#### `getKeyReferences(keys)`

Find all accounts that use a specific public key.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `keys` | `(string \| PublicKey)[]` | Array of public keys |

**Returns:** `Promise<`[`AccountsByKey`](#-accountsbykey-interface)`>`

```js
const result = await client.keys.getKeyReferences([
  "PIX7abc123...",
  "PIX7xyz789..."
]);

// result.accounts = [["alice", "alice-alt"], ["bob"]]
```

**Use Case Example:**

```js
// Find account for a key
const key = PrivateKey.fromLogin("user", "pass", "posting").createPublic();
const { accounts } = await client.keys.getKeyReferences([key.toString()]);

if (accounts[0].length > 0) {
  console.log(`Key belongs to: ${accounts[0].join(", ")}`);
} else {
  console.log("Key not found on any account");
}
```

---

### Transaction Status API

`client.broadcast` sends transactions with `condenser_api.broadcast_transaction`, which answers as soon as the node has accepted the transaction, before it is in a block: the confirmation holds the transaction `id`. To know when it is in a block:

```js
const { id } = await client.broadcast.vote({ voter: "alice", author: "bob", permlink: "art", weight: 10000 }, postingKey);

const { status, block_num } = await client.transaction.findTransaction(id);
// status: "within_mempool", "within_reversible_block", "within_irreversible_block",
//         "expired_reversible", "expired_irreversible", "too_old" or "unknown"
```

Pass the transaction's `expiration` as a second argument to tell an expired transaction from an unknown one.

---

## NFTs (hardfork 32)

From hardfork 32 an author can mint one of their root posts as an NFT, in 1 to 10,000 copies. Each copy has one owner at a time and can be offered at a fixed price, bought, given away or burned. All of this is one operation, `nft` (37), signed with the active key of the account that acts: the author who mints, the owner who offers, withdraws or gives a copy, or the buyer.

| | |
|---|---|
| Ids | `@author/permlink/0` is the NFT; `@author/permlink/N` is its copy N (1 to 10,000) |
| Currency | Prices, royalties and the mint fee are in PXS |
| Mint fee | 1.000 PXS per copy, burned |
| Royalty | 0 to 25% of each later sale, paid to the author when someone else sells; fixed at mint |
| License | The full text of the terms, UTF-8, up to 72 KiB, fixed at mint; the chain keeps its SHA-256 |
| A minted post | Can no longer be edited or deleted |
| Gift | A transfer of a copy: no payment, so no royalty |
| Burn | A transfer to `null`, for good; the copy keeps its number |
| Reserve | The copies that never left the author and have no offer of their own; copy 0 stands for it in offers and purchases |

`client.nft` signs and sends the actions, and reads what the chain holds at head block, which is what a purchase is checked against. The market summary of an NFT page, its history and the lists by creator, owner and price come from Pixamind, through `client.pixamind` ([Reading NFTs](#reading-nfts)).

Every `client.nft` action returns a [`TransactionConfirmation`](#-transaction-interface) and needs the crypto module ([Lite and crypto entry points](#lite-and-crypto-entry-points)).

### Minting

```js
import { Client, PrivateKey } from "@pixagram/dpixa";

const client = new Client("https://api.pixagram.com");
const activeKey = PrivateKey.fromString(activeWif);

await client.nft.mint({
  account: "alice",             // the author; the post is a root post of hers
  permlink: "my-artwork",
  editions: 5,                  // 1 to 10,000 copies
  royalty: 1000,                // basis points: 10% of each later sale
  license: "Licence « tous droits réservés » …"
  // fee: "5.000 PXS"           // optional: the copies times the fee per copy in force
}, activeKey);
```

Before signing, `mint` runs [`checkNftMint`](#nft-helpers) and throws if the chain would refuse the copies, royalty, license or fee. When `fee` is left out it reads the fee per copy from `database_api.get_nft_params`. The chain also checks that the post is a root post of the minter, that it was not minted before, and that the minter holds the fee in liquid PXS. All copies start with the author.

### Selling and buying a copy

```js
// The owner offers copy 3 at 50 PXS. Without expiration the offer never expires.
await client.nft.list({ account: "bob", nft: "@alice/my-artwork/3", price: "50.000 PXS" }, bobKey);

// …until 1 February 2027 (UTC), or with the copy given by its parts:
await client.nft.list({
  account: "bob", author: "alice", permlink: "my-artwork", edition: 3,
  price: "50.000 PXS", expiration: "2027-02-01T00:00:00"
}, bobKey);

// The owner withdraws the offer.
await client.nft.unlist({ account: "bob", nft: "@alice/my-artwork/3" }, bobKey);

// A buyer takes the offer. The price must equal the asking price; left out, it is read from the chain first.
await client.nft.buy({ account: "dave", nft: "@alice/my-artwork/3" }, daveKey);
await client.nft.buy({ account: "dave", nft: "@alice/my-artwork/3", price: "50.000 PXS" }, daveKey);
```

A buyer pays the price, the author receives the royalty unless the author is the seller, and the seller receives the rest. Because the price signed must equal the asking price, a buyer never pays a price changed after signing: if the offer changes or is withdrawn before the transaction is included, the purchase fails and nothing is paid. `nftSaleSplit(price, royalty, sellerIsCreator)` shows how a price will be shared.

An expiration is at most `2038-01-19T03:14:07`: the node refuses later times in the JSON it receives, so dpixa refuses them before signing. Leave `expiration` out for an offer that never expires; the node then records `2106-02-07T06:28:15` (`NFT_NEVER_EXPIRES`) and returns that time in what it answers.

A copy that never left its author leaves the reserve when the author offers it on its own, and goes back to the reserve when the author withdraws that offer.

### The reserve: every untouched copy at one price

The author can offer every copy that never left them, at one price, in one action. Each buyer gets the lowest-numbered copy still in the reserve, and the author receives the whole price. The offer ends by itself when the reserve runs out.

```js
// The author offers the reserve at 5 PXS a copy (expiration optional).
await client.nft.offerReserve({ account: "carol", permlink: "drop", price: "5.000 PXS" }, carolKey);

// A buyer takes the next copy; the price is read from the chain when left out.
await client.nft.buyFromReserve({ account: "erin", author: "carol", permlink: "drop" }, erinKey);

// The author withdraws the reserve offer.
await client.nft.withdrawReserve({ account: "carol", permlink: "drop" }, carolKey);
```

On chain this is `nft_list`, `nft_buy` and `nft_unlist` of copy 0. The `nft_sold` virtual operation of a purchase names the copy the buyer got. `client.nft.getNft(author, permlink)` tells how many copies are in the reserve (`reserve`), whether it can be bought now (`reserve_listed`), at what price (`reserve_price`) and which copy comes next (`reserve_next`).

### Gifts and burns

```js
// Give copy 2 to frank: no payment, no royalty. Ends any offer of the copy.
await client.nft.transfer({ account: "alice", nft: "@alice/my-artwork/2", to: "frank" }, aliceKey);

// Burn copy 4: it goes to null for good, keeps its number and still counts among the copies.
await client.nft.burn({ account: "alice", nft: "@alice/my-artwork/4" }, aliceKey);
```

### Reading NFTs

What the chain holds at head block, from `client.nft` (`database_api`):

| Method | Returns |
|---|---|
| `getParams()` | The fee per copy (`mint_fee_per_edition`, an `Asset`), `max_editions`, `max_royalty`, `max_license_length` and `price_symbols` (`['PXS']`) |
| `find(ids)` | Up to 100 ids: `{ nfts, editions }`. Ids that name nothing are left out |
| `getNft(author, permlink)` | The NFT, or `undefined` when the post is not minted: `editions`, `royalty`, `license_size`, `license_sha256`, `reserve`, `reserve_next`, `reserve_listed`, `reserve_price`, `reserve_expiration` |
| `getEdition("@author/permlink/N")` | One copy: `owner`, `burned`, `acquired`, `listed`, `price`, `expiration` |
| `areMinted(posts)` | One boolean per post, `[author, permlink]` or `{ author, permlink }`, any number of posts |
| `listByCreator(creator, { after, limit })` | NFTs a creator minted, by permlink |
| `listEditions("@author/permlink/0", { from, limit })` | Copies in number order, each copy whether or not it ever moved |
| `listByOwner(owner, { after, limit })` | Copies an account owns that were offered or moved at least once |
| `askingPrice(author, permlink, edition)` | The price a copy, or the reserve (edition 0), can be bought at now; throws when it is not for sale |

Prices are `Asset` instances, read from the `{ amount, precision, nai }` form database_api answers in. A price or expiration is meaningful only while `listed` (or `reserve_listed`) is true.

What an NFT page or a market needs, from Pixamind (`client.pixamind`, namespace `pixamind_nft`):

| Method | Returns |
|---|---|
| `getNft(author, permlink)` | The NFT with its terms and market summary, or `undefined` |
| `getNfts(ids)` | Up to 100 ids: for `…/0` the NFT with its summary, for `…/N` the copy with the terms of its NFT under `nft` |
| `listNftEditions({ nft, sort, owner, limit, start })` | The copies of one NFT: `sort: "number"` lists every copy, those of the reserve with `reserve: true`; `sort: "price"` lists what can be bought now, cheapest first, the offered reserve as one entry (copy 0) |
| `listCreatedNfts(account, { limit, start })` | NFTs an account minted, newest first, with their summary and `total` |
| `listOwnedNfts(account, { acquired_only, limit, start })` | NFTs an account holds copies of: the terms, `held`, `listed` and `acquired` |
| `listNftMarket({ sort, creator, limit, start })` | What can be bought now: copies offered on their own and offered reserves (copy 0, `reserve: true`, `copies`, `next`) |
| `getNftHistory({ nft } or { account }, limit, start)` | Mints, offers, sales, gifts and burns, newest first |
| `getNftLicense(id)` | The full license text with `license_size` and `license_sha256`, or `undefined` |

The market summary that `getNft` returns:

| Field | Meaning |
|---|---|
| `copies` | Number of copies |
| `for_sale` | Copies that can be bought now: each copy offered on its own, plus the whole reserve while it is offered |
| `listed` | Copies offered on their own |
| `reserve` | Copies in the reserve |
| `reserve_offer` | The reserve offer, when copy 0 can be bought now: `price`, `copies`, `next` (the copy the next buyer gets), `expiration` |
| `floor` | The lowest price a copy can be bought at now: `price`, `copies` (how many sell at it) and `nft_ids` (the ids to buy them with; `…/0` is the reserve) |
| `held_by_creator`, `burned` | Copies the creator still holds; copies given to `null` |
| `sales`, `volume`, `royalties`, `last_sale` | Sales of all copies, what they paid, what the creator received, the latest one |

```js
const nft = await client.pixamind.getNft("carol", "drop");
if (nft && nft.floor) {
  console.log(`${nft.for_sale} of ${nft.copies} for sale from ${nft.floor.price}`);
  // buy the cheapest: an id of floor.nft_ids, "@carol/drop/0" being the reserve
  await client.nft.buy({ account: "erin", nft: nft.floor.nft_ids[0], price: nft.floor.price }, erinKey);
}
```

Pixamind lists return `next_start` and `has_more`: pass `next_start` back as `start` for the next page. Every post Pixamind returns (`getRankedPosts`, `getAccountPosts`, `getPost`, `database.getDiscussions` on a Pixamind node) carries `nft_minted`, `true` or `false`.

To check that a license text is the one minted, compare the `license_sha256` of `client.pixamind.getNftLicense(id)` with the chain's, from `client.nft.getNft(author, permlink)`.

### NFT helpers

```js
import {
  parseNftId, formatNftId, isNftId,
  nftMintFee, nftRoyalty, nftSaleSplit, checkNftMint, utf8ByteLength,
  NFT_MAX_EDITIONS, NFT_MAX_ROYALTY, NFT_MAX_LICENSE_BYTES, NFT_RESERVE, NFT_LATEST_EXPIRATION
} from "@pixagram/dpixa";

parseNftId("@alice/my-artwork/3");      // { author: "alice", permlink: "my-artwork", edition: 3 }
formatNftId("alice", "my-artwork");     // "@alice/my-artwork/0"
isNftId("@alice/my-artwork/03");        // false: no leading zeros, as the node reads ids

nftMintFee(5).toString();                       // "5.000 PXS"
nftRoyalty("300.000 PXS", 1000).toString();     // "30.000 PXS", rounded down to 0.001 as the node does
nftSaleSplit("300.000 PXS", 1000);              // { royalty: 30.000 PXS, seller: 270.000 PXS }
nftSaleSplit("300.000 PXS", 1000, true);        // the creator sells: { royalty: 0.000 PXS, seller: 300.000 PXS }

checkNftMint({ permlink: "p", editions: 5, royalty: 3000, license: "…", fee: "5.000 PXS" });
// ["royalty: 0 to 2500 basis points (25%)"]  (empty when the chain would accept these values)

utf8ByteLength("Licence « tous droits réservés »");   // 36: the unit of the 72 KiB license limit
```

| Constant | Value |
|---|---|
| `NFT_MAX_EDITIONS` | 10,000 copies |
| `NFT_MAX_ROYALTY` | 2500 basis points (25%) |
| `NFT_MAX_LICENSE_BYTES` | 73,728 bytes (72 KiB) |
| `NFT_MINT_FEE_PER_EDITION` | `"1.000 PXS"` |
| `NFT_RESERVE` | 0, the edition number of the reserve |
| `NFT_NEVER_EXPIRES` | `"2106-02-07T06:28:15"`, the expiration the node returns for an offer that never expires; to make one, leave `expiration` out |
| `NFT_LATEST_EXPIRATION` | `"2038-01-19T03:14:07"`, the latest expiration the node reads |
| `NFT_BURN_ACCOUNT` | `"null"` |
| `NFT_FIND_LIMIT` | 100 ids per `find` or `getNfts` call |

### The nft operation

`client.nft` builds the operation; `client.broadcast.nft(data, activeKey)` sends one you build yourself, and `client.broadcast.sendOperations` sends it with others in one transaction.

```js
["nft", {
  account: "alice",                      // the actor
  action: [0, {                          // [tag, payload]
    permlink: "my-artwork",
    editions: 5,
    royalty: 1000,
    license: "PIXA_LICENSE/1.0",
    fee: "5.000 PXS",
    extensions: []
  }],
  extensions: []
}]
```

| Tag | Action | Payload |
|---|---|---|
| 0 | `nft_mint` | `permlink`, `editions`, `royalty`, `license`, `fee` |
| 1 | `nft_list` | `author`, `permlink`, `edition` (0 = the reserve), `price`, `expiration` (optional) |
| 2 | `nft_unlist` | `author`, `permlink`, `edition` (0 = the reserve) |
| 3 | `nft_buy` | `author`, `permlink`, `edition` (0 = the next copy of the reserve), `price` |
| 4 | `nft_transfer` | `author`, `permlink`, `edition` (1 or more), `to` (`null` burns) |

The action can also be written `["nft_mint", {...}]` or `{ type: "nft_mint", value: {...} }`, the form database_api and HAF use. `extensions` can be left out. When dpixa signs, it writes the action as `[tag, payload]`, the form condenser_api reads, with `extensions: []`; an offer given the never-expiring time is sent without `expiration`, which the node reads as the same time. The digest does not change. Fed through the node's own JSON parser in condenser_api mode, every action dpixa sends gives back the bytes dpixa signed.

A purchase produces two virtual operations:

| Id | Name | Fields |
|---|---|---|
| 93 | `nft_sold` | `seller`, `buyer`, `author`, `permlink`, `edition` (the copy sold; for a purchase from the reserve, the copy the buyer got), `price`, `royalty` (zero when the creator sold) |
| 94 | `nft_royalty` | `creator`, `seller`, `buyer`, `permlink`, `edition`, `royalty`; only when a royalty was paid |

An account's NFT activity, from its history:

```js
const op = utils.operationOrders;
const nftOnly = utils.makeBitMaskFilter([op.nft, op.nft_sold, op.nft_royalty]);
const history = await client.database.getAccountHistory("alice", -1, 100, nftOnly);
```

---

## Voting bar (hardfork 32)

Hardfork 32 makes each vote weigh more on the voting bar, so that a curator who votes a few times a day with care keeps up with an account voting all the time:

| | Before hardfork 32 | From hardfork 32 |
|---|---|---|
| A 100% vote costs | 2% of a full bar | 3% of a full bar |
| The bar refills | 20% a day (5 days from empty) | 15% a day (6 days 16 hours from empty) |
| `vote_power_reserve_rate` | 10 | 5 |
| `voting_mana_regeneration_seconds` | 432,000 (not returned by older nodes) | 576,000 |
| Vesting shares taken back from a delegation are usable again after | 5 days | 7 days (`delegation_return_period`) |

The downvote bar refills at the same rate. Both values are global properties, returned by `client.database.getDynamicGlobalProperties()`, and `client.rc` reads them:

```js
// Mana, refilled to now with the refill time the chain has (percentage: basis points, 10000 = full)
const vp = await client.rc.getVPMana("alice");
console.log(`Voting bar: ${(vp.percentage / 100).toFixed(2)}%`);

const down = await client.rc.getDownvoteMana("alice");

// What a vote costs: mana (millionths of VESTS), its share of a full bar, and a 100% vote's share
const cost = await client.rc.getVoteCost("alice", 5000);   // a 50% vote
console.log(`${cost.percentage}% of the bar; a full vote costs ${cost.full_vote_percentage}%`); // 1.5, 3

// Without extra requests, from objects you already have:
const props = await client.database.getDynamicGlobalProperties();
const [account] = await client.database.getAccounts(["alice"]);
client.rc.calculateVPMana(account, props);
client.rc.calculateDownvoteMana(account, props);
client.rc.calculateVoteCost(account, 10000, props);
```

`calculateVoteCost` follows the node exactly: `ceil(floor(effective VESTS × |weight| × 86400 / 10000) / (vote_power_reserve_rate × voting_mana_regeneration_seconds))`, the effective VESTS being the account's own, minus those it delegated, plus those it received, minus its next weekly power-down. A downvote is paid from the downvote bar first. `calculateVPMana(account)` without `props` keeps the 5-day refill of earlier versions; `getVotingManaRegenerationSeconds(props)` returns the refill time a node reports, or 432,000 when it reports none.

---

## Promoted posts

Anyone can push a post up the promoted feed by burning PXS for it: a transfer to `null` with the memo `@author/permlink`. Pixamind adds the amount to the post's promoted total.

```js
await client.broadcast.promote(
  { from: "carol", author: "alice", permlink: "cat", amount: "1.500 PXS" },
  carolActiveKey
);
// the same as client.broadcast.transfer({ from: "carol", to: "null", amount: "1.500 PXS", memo: "@alice/cat" }, carolActiveKey)
```

| Rule | |
|---|---|
| Asset | PXS only; `promote` refuses anything else. PIXA sent to `null` burns without promoting |
| Target | A root post that exists when the transfer is made; a reply cannot be promoted |
| Memo | Exactly `@author/permlink`, which `promote` writes |
| Amount | From 0.001 PXS; payments from any account add up |
| Ranking | Highest total first, while the post awaits its payout (7 days); it keeps its total afterwards |
| Refund | None: the PXS is burned whatever happens to the post |

Reading it:

```js
// The promoted feed: all posts, a tag, a community, or "my" (the observer's communities)
const posts = await client.pixamind.getPromotedPosts({ tag: "my", observer: "dave", limit: 20 });
posts.forEach((post) => console.log(post.promoted, post.title)); // "1.750 PXS"

// The payments behind a post, and what an account spent
const { promoted, promotions } = await client.pixamind.getPromotions("alice", "cat");
const spending = await client.pixamind.getPromotionsBySender("carol", 50);
```

Every post Pixamind returns carries `promoted`, `"0.000 PXS"` when nothing was burned for it. `client.pixamind.getRankedPosts({ sort: "promoted", … })` and `client.database.getDiscussions("promoted", …)` read the same feed.

## Post metadata and history

```js
// Format, tags, license, picture size; and when they apply: promoted, versions (recorded edits), nft
const meta = await client.pixamind.getContentMetadata("alice", "cat");
console.log(meta.content.image.width, meta.content.image.height, meta.promoted, meta.versions, meta.nft?.floor);

// Up to 100 posts in one call; null for a post that does not exist
const many = await client.pixamind.getContentMetadataBatch([["alice", "cat"], ["bob", "dog"]]);

// Every recorded version of a post or comment, oldest first: the creation, then each edit
const history = await client.pixamind.getPostHistory("bob", "blog-1", { limit: 20, bodies: false });
history.versions.forEach((v) => console.log(v.version, v.timestamp, v.changed));
```

`getContentMetadata` reads the picture's size from the header of the image in the post body, so a feed can reserve the space before loading it. `client.pixamind.getInfo()` tells which of these features a Pixamind node runs (`features.nfts`, `features.promotions`, `features.post_history`).

## Pixa names and node names

dpixa has always used Pixa names for these fields. Nodes before pixacore 1.32.0 read only Hive's names; [pixacore](https://github.com/pixagram-blockchain/pixacore) 1.32.0, the node of hardfork 32, writes Pixa's names and reads both:

| Operation | dpixa name | Nodes before pixacore 1.32.0 | pixacore 1.32.0 |
|---|---|---|---|
| `comment_options` | `percent_pxs` | `percent_hbd` | `percent_pxs`, or `percent_hbd` |
| `claim_reward_balance` | `reward_pixa`, `reward_pxs` | `reward_hive`, `reward_hbd` | either pair |
| `escrow_transfer`, `escrow_release` | `pxs_amount`, `pixa_amount` | `hbd_amount`, `hive_amount` | either pair |
| `witness_update` (`props`) | `pxs_interest_rate` | `hbd_interest_rate` | either name |
| `witness_set_properties` (`utils.buildWitnessUpdateOp`) | `pxs_exchange_rate`, `pxs_interest_rate` | `hbd_exchange_rate`, `hbd_interest_rate` | `hbd_exchange_rate`, `hbd_interest_rate`: these keys are signed data and keep their names on every node |

pixacore 1.32.0 also answers with Pixa's names (`pxs_balance`, `reward_pixa_balance`, `total_vesting_fund_pixa`, `percent_pxs`, ...). The account, post and global-properties types of dpixa declare both names where they differ, so the same code reads either node.

A signature covers the binary form of the transaction, which the node rebuilds from the JSON it receives. A field under a name the node does not read is skipped and replaced by its default value, so the transaction the node checks differs from the one that was signed, and is rejected for a missing authority. Up to 1.6.0, a node reading the Hive names rejected any transaction in which such a field held something other than its default, for example `percent_pxs: 0`. `api.pixagram.com` renames these fields before they reach its node, so 1.6.0 worked through it; a node reached directly, such as a witness's own node or a testnet, did not. A pixacore 1.32.0 node reads both names, so no renaming is needed. From 1.7.0:

- Give each field under either name. dpixa signs the same bytes for both.
- When it signs, `cryptoUtils.signTransaction` writes the value under both names, so the API node reads what was signed whichever names it uses. `client.broadcast.send` does the same for a transaction signed elsewhere. `normalizeTransaction(tx)` and `normalizeOperation(op)` are the functions they use. The digest never changes.
- Two names holding different values are refused before signing.
- `utils.buildWitnessUpdateOp` writes witness properties under the names the node looks up, `hbd_exchange_rate` and `hbd_interest_rate`. Here the names are part of the signed data: a node reached directly ignored `pxs_exchange_rate`, so a price feed published that way never took effect, and `api.pixagram.com` rewrote the name after it was signed, so the node refused the signature.
- Reading: `getVestingSharePrice` takes `total_vesting_fund_pixa` or `total_vesting_fund_hive`, and the account, post and global-properties types declare both names where they differ.

---

## Working with Assets

### Asset Class

The `Asset` class provides a convenient way to work with blockchain tokens.

#### Creating Assets

```js
import { Asset } from "@pixagram/dpixa";

// From string (most common)
const pixa = Asset.fromString("100.000 PIXA");
const pxs = Asset.fromString("50.500 PXS");
const vests = Asset.fromString("1000000.000000 VESTS");

// From number with symbol
const amount = Asset.from(100, "PIXA");  // "100.000 PIXA"

// Using constructor
const asset = new Asset(100.5, "PIXA");  // "100.500 PIXA"

// Validate expected symbol
const validated = Asset.fromString("100.000 PIXA", "PIXA");  // OK
// Asset.fromString("100.000 PXS", "PIXA");  // Throws!
```

#### Asset Properties & Methods

```js
const asset = Asset.fromString("123.456 PIXA");

// Properties
asset.amount;         // 123.456 (number)
asset.symbol;         // "PIXA" (string)
asset.getPrecision(); // 3 (decimal places)

// Arithmetic (returns NEW Asset)
asset.add(10);           // "133.456 PIXA"
asset.subtract(20);      // "103.456 PIXA"
asset.multiply(2);       // "246.912 PIXA"
asset.divide(2);         // "61.728 PIXA"

// Static methods
Asset.min(a, b);    // Returns smaller
Asset.max(a, b);    // Returns larger

// Serialization
asset.toString();  // "123.456 PIXA"
asset.toJSON();    // "123.456 PIXA"
```

<details>
<summary><strong>📋 <a id="asset-symbols-reference"></a>Asset Symbols Reference</strong></summary>

| Symbol | Description | Precision | Example |
|--------|-------------|-----------|---------|
| `PIXA` | Main token | 3 | `"100.000 PIXA"` |
| `PXS` | Pixa Supra, the Big Mac referenced supracoin | 3 | `"50.500 PXS"` |
| `VESTS` | Vesting shares (Pixa Power) | 6 | `"1000000.000000 VESTS"` |
| `TESTS` | Testnet main token | 3 | `"100.000 TESTS"` |
| `TBD` | Testnet PXS | 3 | `"50.000 TBD"` |

</details>

---

### Price Class

The `Price` class represents an exchange rate between two assets.

```js
import { Price, Asset } from "@pixagram/dpixa";

// Create from Asset instances
const price = new Price(
  Asset.fromString("1.000 PIXA"),   // base
  Asset.fromString("0.500 PXS")     // quote
);
// Means: 1 PIXA = 0.5 PXS

// Create from object
const price2 = Price.from({
  base: "1.000 PIXA",
  quote: "0.500 PXS"
});

// Convert between assets
const pixaAmount = Asset.fromString("100.000 PIXA");
const pxsValue = price.convert(pixaAmount);
console.log(pxsValue.toString());  // "50.000 PXS"

// String representation
console.log(price.toString());  // "1.000 PIXA:0.500 PXS"
```

---

### Helper Functions

#### `getVestingSharePrice(props)`

Calculate the current VESTS to PIXA conversion rate.

**Returns:** `Price`

```js
import { getVestingSharePrice } from "@pixagram/dpixa";

const props = await client.database.getDynamicGlobalProperties();
const vestingPrice = getVestingSharePrice(props);

// Convert VESTS to PIXA
const vests = Asset.fromString("1000000.000000 VESTS");
const pixa = vestingPrice.convert(vests);
console.log(`1M VESTS = ${pixa}`);  // e.g., "500.000 PIXA"
```

#### `getVests(account, subtractDelegated?, addReceived?)`

Calculate effective vesting shares for an account.

**Returns:** `number`

```js
import { getVests } from "@pixagram/dpixa";

const [account] = await client.database.getAccounts(["alice"]);

// Get total effective VESTS
const totalVests = getVests(account, true, true);
// Subtracts delegated, adds received

// Get only owned VESTS (no delegations)
const ownedVests = getVests(account, true, false);

// Get raw VESTS (ignore delegations)
const rawVests = getVests(account, false, false);
```

---

## Cryptography

### Private Keys

#### Creating Private Keys

```js
import { PrivateKey } from "@pixagram/dpixa";

// From username/password (most common method)
const postingKey = PrivateKey.fromLogin("username", "password", "posting");
const activeKey = PrivateKey.fromLogin("username", "password", "active");
const ownerKey = PrivateKey.fromLogin("username", "password", "owner");
const memoKey = PrivateKey.fromLogin("username", "password", "memo");

// From WIF (Wallet Import Format) string
const key = PrivateKey.fromString("5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3");

// From arbitrary seed
const seedKey = PrivateKey.fromSeed("my-secret-seed-phrase");

// From buffer
const bufferKey = PrivateKey.from(someBuffer);
```

<details>
<summary><strong>📋 <a id="key-roles-reference"></a>Key Roles Reference</strong></summary>

| Role | Usage | Required For |
|------|-------|--------------|
| `owner` | Account recovery, changing keys | Changing owner/active/posting keys, account recovery |
| `active` | Financial operations | Transfers, power up/down, witness voting, market orders |
| `posting` | Social operations | Posting, commenting, voting, following |
| `memo` | Private messaging | Encrypting/decrypting private memos |

**Security Note:** Always use the minimum required key. Never use owner key for regular operations.

</details>

#### Using Private Keys

```js
const privateKey = PrivateKey.fromLogin("user", "pass", "posting");

// Get corresponding public key
const publicKey = privateKey.createPublic();
console.log(publicKey.toString());  // "PIX7abc..."

// Sign a message (32-byte hash)
const message = cryptoUtils.sha256(Buffer.from("Hello, World!"));
const signature = privateKey.sign(message);

// Export as WIF string
const wif = privateKey.toString();
console.log(wif);  // "5K..."

// Get shared secret (for memo encryption)
const recipientPubKey = PublicKey.fromString("PIX7xyz...");
const sharedSecret = privateKey.get_shared_secret(recipientPubKey);
```

---

### Public Keys

```js
import { PublicKey, PrivateKey } from "@pixagram/dpixa";

// From string
const pubKey = PublicKey.fromString("PIX7hLHCpMfLeHD4pkpKPrCFRGqPKcqLp4GZrw2NVHHLv9FpT4rQz");

// From private key
const privateKey = PrivateKey.fromLogin("user", "pass", "posting");
const publicKey = privateKey.createPublic();

// Verify a signature
const message = cryptoUtils.sha256(Buffer.from("Hello"));
const signature = privateKey.sign(message);
const isValid = publicKey.verify(message, signature);
console.log(`Signature valid: ${isValid}`);  // true

// Export
const wif = publicKey.toString();  // "PIX7hLHCpM..."
```

---

### Signatures

```js
import { Signature, PrivateKey, cryptoUtils } from "@pixagram/dpixa";

const privateKey = PrivateKey.fromLogin("user", "pass", "active");
const message = cryptoUtils.sha256(Buffer.from("Sign this message"));

// Create signature
const signature = privateKey.sign(message);

// Export signature
const sigString = signature.toString();  // Hex string
const sigBuffer = signature.toBuffer();  // Buffer

// Import signature
const importedSig = Signature.fromString(sigString);
const fromBuffer = Signature.fromBuffer(sigBuffer);

// Recover public key from signature
const recoveredPubKey = signature.recover(message);
```

---

### Memo Encryption

```js
import { Memo, PrivateKey } from "@pixagram/dpixa";

// Get recipient's public memo key from their account
const [recipient] = await client.database.getAccounts(["recipient"]);
const recipientMemoKey = recipient.memo_key;

// Sender's private memo key
const senderPrivate = PrivateKey.fromLogin("sender", "password", "memo");

// Encrypt a memo
const encrypted = Memo.encode(
  senderPrivate,
  recipientMemoKey,
  "This is a secret message!"
);
console.log(encrypted);  // "#JfoiM3FbR3..." (starts with #)

// Decrypt (recipient side)
const recipientPrivate = PrivateKey.fromLogin("recipient", "password", "memo");
const decrypted = Memo.decode(recipientPrivate, encrypted);
console.log(decrypted);  // "This is a secret message!"
```

---

### Crypto Utilities

```js
import { cryptoUtils } from "@pixagram/dpixa";

// Hashing
const sha256 = cryptoUtils.sha256("Hello World");           // Buffer
const doubleSha = cryptoUtils.doubleSha256("Hello");        // sha256(sha256(x))
const ripemd = cryptoUtils.ripemd160("Hello");              // Buffer

// Key encoding
const encoded = cryptoUtils.encodePrivate(keyBuffer);   // WIF string
const decoded = cryptoUtils.decodePrivate("5K...");     // Buffer
const pubEncoded = cryptoUtils.encodePublic(pubKeyBuffer, "PIX");

// Validation
const isWif = cryptoUtils.isWif("5KQwrPbwd...");        // true
const isCanonical = cryptoUtils.isCanonicalSignature(sigBuffer);

// Transaction utilities
const digest = cryptoUtils.transactionDigest(transaction);
const txId = cryptoUtils.generateTrxId(transaction);

// Sign a transaction
const signedTx = cryptoUtils.signTransaction(
  transaction,
  [privateKey1, privateKey2],  // Can use multiple keys
  chainId  // Optional, defaults to main chain
);
```

---

## Building Transactions

For advanced use cases, you can build and sign transactions manually.

```js
import { Client, PrivateKey, cryptoUtils } from "@pixagram/dpixa";

const client = new Client(["https://api.pixagram.com"]);

// Get reference block info
const props = await client.database.getDynamicGlobalProperties();
const refBlockNum = props.head_block_number - 3;
const refBlock = await client.database.getBlock(refBlockNum);

// Build transaction
const transaction = {
  ref_block_num: refBlockNum & 0xFFFF,
  ref_block_prefix: Buffer.from(refBlock.block_id, "hex").readUInt32LE(4),
  expiration: new Date(Date.now() + 60000).toISOString().slice(0, -5),
  operations: [
    ["vote", {
      voter: "myuser",
      author: "post-author",
      permlink: "post-permlink",
      weight: 10000
    }]
  ],
  extensions: []
};

// Sign transaction
const privateKey = PrivateKey.fromLogin("myuser", "password", "posting");
const signedTx = cryptoUtils.signTransaction(
  transaction,
  [privateKey],
  client.chainId
);

// Broadcast
const result = await client.call("condenser_api", "broadcast_transaction_synchronous", [signedTx]);
console.log(`Transaction ID: ${result.id}`);
```

---

## Operations Reference

<details>
<summary><strong>📋 Transfer Operations</strong></summary>

### `transfer`
```js
["transfer", {
  from: "sender",
  to: "recipient",
  amount: "10.000 PIXA",  // or PXS
  memo: "Optional message"
}]
```

### `transfer_to_vesting` (Power Up)
```js
["transfer_to_vesting", {
  from: "sender",
  to: "recipient",  // Can be same or different
  amount: "100.000 PIXA"
}]
```

### `withdraw_vesting` (Power Down)
```js
["withdraw_vesting", {
  account: "user",
  vesting_shares: "1000000.000000 VESTS"  // 0 to cancel
}]
```

### `delegate_vesting_shares`
```js
["delegate_vesting_shares", {
  delegator: "user",
  delegatee: "recipient",
  vesting_shares: "100000.000000 VESTS"  // 0 to undelegate
}]
```

### `recurrent_transfer`
```js
["recurrent_transfer", {
  from: "sender",
  to: "recipient",
  amount: "10.000 PIXA",
  memo: "Monthly payment",
  recurrence: 24,    // Hours between transfers
  executions: 12,    // Number of transfers (0 to cancel)
  extensions: []
}]
```

</details>

<details>
<summary><strong>📋 Content Operations</strong></summary>

### `comment`
```js
["comment", {
  parent_author: "",           // Empty for root post
  parent_permlink: "category", // Category/tag for posts
  author: "user",
  permlink: "my-post",
  title: "Post Title",         // Empty for comments
  body: "Post content...",
  json_metadata: JSON.stringify({
    tags: ["tag1", "tag2"],
    image: ["https://..."],
    app: "myapp/1.0"
  })
}]
```

### `comment_options`
```js
["comment_options", {
  author: "user",
  permlink: "my-post",
  max_accepted_payout: "1000000.000 PXS",
  percent_pxs: 10000,  // 0-10000
  allow_votes: true,
  allow_curation_rewards: true,
  extensions: [
    [0, {
      beneficiaries: [
        { account: "beneficiary1", weight: 1000 }  // 10%
      ]
    }]
  ]
}]
```

### `vote`
```js
["vote", {
  voter: "user",
  author: "post_author",
  permlink: "post_permlink",
  weight: 10000  // -10000 to 10000
}]
```

### `delete_comment`
```js
["delete_comment", {
  author: "user",
  permlink: "my-post"
}]
```

</details>

<details>
<summary><strong>📋 Account Operations</strong></summary>

### `account_create`
```js
["account_create", {
  fee: "3.000 PIXA",
  creator: "existing_user",
  new_account_name: "newuser",
  owner: { weight_threshold: 1, account_auths: [], key_auths: [["PIX...", 1]] },
  active: { weight_threshold: 1, account_auths: [], key_auths: [["PIX...", 1]] },
  posting: { weight_threshold: 1, account_auths: [], key_auths: [["PIX...", 1]] },
  memo_key: "PIX...",
  json_metadata: "{}"
}]
```

### `claim_reward_balance`
```js
["claim_reward_balance", {
  account: "user",
  reward_pixa: "1.000 PIXA",
  reward_pxs: "0.500 PXS",
  reward_vests: "100.000000 VESTS"
}]
```

### `account_witness_vote`
```js
["account_witness_vote", {
  account: "user",
  witness: "witness_name",
  approve: true  // false to remove vote
}]
```

</details>

<details>
<summary><strong>📋 Custom Operations</strong></summary>

### `custom_json`
```js
["custom_json", {
  required_auths: [],
  required_posting_auths: ["user"],
  id: "follow",                 // Operation identifier (max 32 chars)
  json: JSON.stringify([...])   // JSON payload
}]
```

### `custom`
```js
["custom", {
  required_auths: ["user"],
  id: 0,
  data: Buffer.from("...")  // Raw binary data
}]
```

### `custom_binary`
```js
["custom_binary", {
  required_owner_auths: [],
  required_active_auths: [],
  required_posting_auths: ["user"],
  required_auths: [],
  id: "app_id",
  data: Buffer.from("...")
}]
```

</details>

<details>
<summary><strong>📋 Governance Operations</strong></summary>

### `account_witness_vote`
```js
["account_witness_vote", {
  account: "user",
  witness: "witness_name",
  approve: true  // false to remove vote
}]
```

### `account_witness_proxy`
```js
["account_witness_proxy", {
  account: "user",
  proxy: "proxy_account"  // "" to clear proxy
}]
```

### `witness_update`
```js
["witness_update", {
  owner: "witness_name",
  url: "https://mywitness.com",
  block_signing_key: "PIX7abc...",
  props: {
    account_creation_fee: "3.000 PIXA",
    maximum_block_size: 65536,
    pxs_interest_rate: 1000
  },
  fee: "0.000 PIXA"
}]
```

### `witness_set_properties`
```js
["witness_set_properties", {
  owner: "witness_name",
  props: [
    ["key", "hex_encoded_signing_key"],
    ["account_creation_fee", "hex_encoded_fee"],
    ["url", "hex_encoded_url"]
  ],
  extensions: []
}]
```

> 💡 Use [`utils.buildWitnessUpdateOp()`](#build-witness-update) to easily construct this operation.

### `create_proposal`
```js
["create_proposal", {
  creator: "user",
  receiver: "recipient",
  start_date: "2024-02-01T00:00:00",
  end_date: "2024-03-01T00:00:00",
  daily_pay: "100.000 PXS",
  subject: "Proposal title",
  permlink: "proposal-post-permlink",
  extensions: []
}]
```

### `update_proposal_votes`
```js
["update_proposal_votes", {
  voter: "user",
  proposal_ids: [1, 5, 12],
  approve: true,
  extensions: []
}]
```

### `update_proposal`
```js
["update_proposal", {
  proposal_id: 42,
  creator: "user",
  daily_pay: "50.000 PXS",
  subject: "Updated title",
  permlink: "updated-permlink",
  end_date: "2024-04-01T00:00:00",
  extensions: []
}]
```

### `remove_proposal`
```js
["remove_proposal", {
  proposal_owner: "user",
  proposal_ids: [42],
  extensions: []
}]
```

### `decline_voting_rights`
```js
["decline_voting_rights", {
  account: "user",
  decline: true  // irreversible!
}]
```

</details>

<details>
<summary><strong>📋 Market Operations</strong></summary>

### `limit_order_create`
```js
["limit_order_create", {
  owner: "user",
  orderid: 1001,
  amount_to_sell: "10.000 PIXA",
  min_to_receive: "5.000 PXS",
  fill_or_kill: false,
  expiration: "2024-02-01T00:00:00"
}]
```

### `limit_order_create2`
```js
["limit_order_create2", {
  owner: "user",
  orderid: 1002,
  amount_to_sell: "10.000 PIXA",
  fill_or_kill: false,
  exchange_rate: {
    base: "1.000 PIXA",
    quote: "0.500 PXS"
  },
  expiration: "2024-02-01T00:00:00"
}]
```

### `limit_order_cancel`
```js
["limit_order_cancel", {
  owner: "user",
  orderid: 1001
}]
```

### `convert`
```js
["convert", {
  owner: "user",
  requestid: 1,
  amount: "100.000 PXS"  // PXS → PIXA (3.5 day delay)
}]
```

### `collateralized_convert`
```js
["collateralized_convert", {
  owner: "user",
  requestid: 2,
  amount: "100.000 PIXA"  // Instant PIXA → PXS
}]
```

### `feed_publish` (witnesses only)
```js
["feed_publish", {
  publisher: "witness_name",
  exchange_rate: {
    base: "0.500 PXS",
    quote: "1.000 PIXA"
  }
}]
```

</details>

<details>
<summary><strong>📋 Savings Operations</strong></summary>

### `transfer_to_savings`
```js
["transfer_to_savings", {
  from: "user",
  to: "user",        // Can be same account
  amount: "100.000 PIXA",  // or PXS
  memo: "Savings deposit"
}]
```

### `transfer_from_savings`
```js
["transfer_from_savings", {
  from: "user",
  request_id: 1,
  to: "user",
  amount: "50.000 PIXA",
  memo: "Withdrawal"
  // 3-day delay before funds arrive
}]
```

### `cancel_transfer_from_savings`
```js
["cancel_transfer_from_savings", {
  from: "user",
  request_id: 1
}]
```

</details>

<details>
<summary><strong>📋 Escrow Operations</strong></summary>

### `escrow_transfer`
```js
["escrow_transfer", {
  from: "buyer",
  to: "seller",
  agent: "escrow_agent",
  escrow_id: 1,
  pxs_amount: "100.000 PXS",
  pixa_amount: "0.000 PIXA",
  fee: "1.000 PXS",
  ratification_deadline: "2024-01-20T00:00:00",
  escrow_expiration: "2024-02-01T00:00:00",
  json_meta: "{}"
}]
```

### `escrow_approve`
```js
["escrow_approve", {
  from: "buyer",
  to: "seller",
  agent: "escrow_agent",
  who: "escrow_agent",  // Who is approving
  escrow_id: 1,
  approve: true
}]
```

### `escrow_dispute`
```js
["escrow_dispute", {
  from: "buyer",
  to: "seller",
  agent: "escrow_agent",
  who: "buyer",  // Who is disputing
  escrow_id: 1
}]
```

### `escrow_release`
```js
["escrow_release", {
  from: "buyer",
  to: "seller",
  agent: "escrow_agent",
  who: "escrow_agent",
  receiver: "seller",
  escrow_id: 1,
  pxs_amount: "100.000 PXS",
  pixa_amount: "0.000 PIXA"
}]
```

</details>

<details>
<summary><strong>📋 Account Recovery Operations</strong></summary>

### `request_account_recovery`
```js
["request_account_recovery", {
  recovery_account: "recovery_partner",
  account_to_recover: "hacked_user",
  new_owner_authority: {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [["PIX7new...", 1]]
  },
  extensions: []
}]
```

### `recover_account`
```js
["recover_account", {
  account_to_recover: "hacked_user",
  new_owner_authority: { /* new authority */ },
  recent_owner_authority: { /* previous authority */ },
  extensions: []
}]
```

### `change_recovery_account`
```js
["change_recovery_account", {
  account_to_recover: "user",
  new_recovery_account: "trusted_friend",
  extensions: []
}]
```

</details>

<details>
<summary><strong>📋 NFT Operation (hardfork 32)</strong></summary>

### `nft`
```js
["nft", {
  account: "alice",          // the actor, active key
  action: [0, {              // 0 mint, 1 list, 2 unlist, 3 buy, 4 transfer
    permlink: "my-artwork",
    editions: 5,
    royalty: 1000,
    license: "PIXA_LICENSE/1.0",
    fee: "5.000 PXS"
  }]
}]
```

See [The nft operation](#the-nft-operation) for every action.

</details>

<details>
<summary><strong>📋 Virtual Operations (Read-Only)</strong></summary>

| Operation | Description |
|-----------|-------------|
| `author_reward` | Author payout |
| `curation_reward` | Curator payout |
| `comment_reward` | Comment/post payout |
| `fill_convert_request` | Conversion completed |
| `fill_vesting_withdraw` | Power down payment |
| `fill_order` | Market order filled |
| `producer_reward` | Witness block reward |
| `interest` | PXS interest payment |
| `return_vesting_delegation` | Delegation returned |
| `nft_sold` | A copy of an NFT was bought (93) |
| `nft_royalty` | The royalty of that sale, when not zero (94) |

</details>

---

## Utilities

### Operation Bitmask Filter

```js
import { utils } from "@pixagram/dpixa";

const op = utils.operationOrders;

// Create filter for specific operations
const filter = utils.makeBitMaskFilter([
  op.vote,
  op.comment,
  op.transfer,
  op.custom_json
]);

// Use with getAccountHistory
const history = await client.database.getAccountHistory("alice", -1, 100, filter);
```

### Sleep

```js
await utils.sleep(2000);  // Wait 2 seconds
```

### Copy Objects

```js
const copy = utils.copy(originalObject);  // Deep copy
```

### Iterator to Stream

```js
const stream = utils.iteratorStream(client.blockchain.getBlocks());
stream.on("data", (block) => console.log(block));
```

### Build Witness Update

```js
const witnessOp = utils.buildWitnessUpdateOp("mywitness", {
  key: publicKey,                          // the current signing key, required
  account_creation_fee: "3.000 PIXA",
  maximum_block_size: 65536,
  pxs_exchange_rate: { base: "0.250 PXS", quote: "1.000 PIXA" },  // written as hbd_exchange_rate
  url: "https://mywitness.com"
});
```

**Returns:** [`WitnessSetPropertiesOperation`](#-operation-interfaces) — ready to broadcast. `pxs_exchange_rate` and `pxs_interest_rate` are written under the names the node reads, `hbd_exchange_rate` and `hbd_interest_rate`; the interest rate is fixed at 0 on Pixa.

---

### Wait For Event

```js
// Wait for a specific event from an EventEmitter
const result = await utils.waitForEvent(emitter, "data");
```

Utility that returns a `Promise` which resolves when the specified event is emitted.

---

### Retrying Fetch

Low-level utility used internally by the `Client` for RPC calls with failover. Rarely needed directly.

```js
const { response, currentAddress } = await utils.retryingFetch(
  currentAddress,     // string - current RPC URL
  allAddresses,       // string | string[] - all RPC URLs
  fetchOptions,       // any - fetch request options
  timeout,            // number - ms before giving up
  failoverThreshold,  // number - max retry rounds
  consoleOnFailover,  // boolean - log failovers
  backoffFn           // (tries: number) => number - backoff strategy
);
```

---

## Serialization

The `Types` object provides serializers for blockchain data types. Used internally for transaction signing, but available for custom use.

```js
import { Types } from "@pixagram/dpixa";

// Primitive serializers
Types.UInt8       // Unsigned 8-bit integer
Types.UInt16      // Unsigned 16-bit integer
Types.UInt32      // Unsigned 32-bit integer
Types.UInt64      // Unsigned 64-bit integer
Types.Int8        // Signed 8-bit integer
Types.Int16       // Signed 16-bit integer
Types.Int32       // Signed 32-bit integer
Types.Int64       // Signed 64-bit integer
Types.Boolean     // Boolean
Types.String      // Variable-length string
Types.Void        // Void (throws on serialize — placeholder)

// Blockchain-specific serializers
Types.Date        // Date string → 4-byte uint32 timestamp
Types.Asset       // Asset string → fixed binary format
Types.PublicKey   // Public key → 33-byte compressed point
Types.Authority   // Authority object → threshold + key/account lists
Types.Price       // Price object → base + quote assets
Types.Operation   // Operation tuple → varint ID + serialized params
Types.Transaction // Full transaction → ref_block + expiration + ops
Types.EncryptedMemo // Encrypted memo → nonce + check + encrypted bytes
Types.Binary(size?) // Raw binary data (optional fixed size)

// Compound serializers (factories)
Types.Array(itemSerializer)                  // Varint-length array
Types.Optional(valueSerializer)              // 1-byte flag + optional value
Types.Object(keySerializers)                 // Ordered key-value pairs
Types.FlatMap(keySerializer, valueSerializer) // Key-value map
Types.StaticVariant(itemSerializers)         // Tagged union [index, data]
```

---

## Error Handling

```js
try {
  await client.broadcast.transfer({
    from: "alice",
    to: "bob",
    amount: "10.000 PIXA",
    memo: ""
  }, activeKey);
} catch (error) {
  if (error.message.includes("insufficient")) {
    console.error("Insufficient balance");
  } else if (error.message.includes("authority")) {
    console.error("Wrong key or insufficient authority");
  } else if (error.message.includes("bandwidth")) {
    console.error("Insufficient resource credits");
  } else {
    console.error("Error:", error.message);
  }
}
```

### Retry Pattern

```js
async function withRetry(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry ${i + 1}/${maxRetries} in ${delay}ms...`);
      await utils.sleep(delay);
      delay *= 2;
    }
  }
}

const accounts = await withRetry(() => client.database.getAccounts(["alice"]));
```

---

## Types & Interfaces

> All interfaces below are referenced throughout this documentation. Use your editor's search to jump between method signatures and their return types.

<details>
<summary><strong>📋 <a id="-dynamicglobalproperties-interface"></a>DynamicGlobalProperties Interface</strong></summary>

Returned by: [`database.getDynamicGlobalProperties()`](#getdynamicglobalproperties)

```typescript
interface DynamicGlobalProperties {
  id: number;
  head_block_number: number;
  head_block_id: string;
  time: string;
  current_witness: string;
  total_pow: number;
  num_pow_witnesses: number;
  virtual_supply: string | Asset;
  current_supply: string | Asset;
  current_pxs_supply: string | Asset;
  total_vesting_fund_pixa: string | Asset;
  total_vesting_shares: string | Asset;
  total_reward_fund_pixa: string | Asset;
  pending_rewarded_vesting_shares: string | Asset;
  pending_rewarded_vesting_pixa: string | Asset;
  pxs_interest_rate: number;
  pxs_print_rate: number;
  maximum_block_size: number;
  current_aslot: number;
  recent_slots_filled: string;
  participation_count: number;
  last_irreversible_block_num: number;
  vote_power_reserve_rate: number;            // 5 from hardfork 32 (a full vote: 3% of the bar)
  voting_mana_regeneration_seconds?: number;  // 576000 from hardfork 32 (15% a day)
  delegation_return_period?: number;          // 604800 from hardfork 32 (7 days)
  downvote_pool_percent?: number;
  current_reserve_ratio: number;
}
```

</details>

<details>
<summary><strong>📋 <a id="-chainproperties-interface"></a>ChainProperties Interface</strong></summary>

Returned by: [`database.getChainProperties()`](#getchainproperties)

```typescript
interface ChainProperties {
  account_creation_fee: string | Asset;
  maximum_block_size: number;
  pxs_interest_rate: number;
}
```

</details>

<details>
<summary><strong>📋 <a id="-account-interface"></a>Account / ExtendedAccount Interface</strong></summary>

Returned by: [`database.getAccounts()`](#getaccountsusernames)

```typescript
interface Account {
  id: number;
  name: string;
  owner: AuthorityType;
  active: AuthorityType;
  posting: AuthorityType;
  memo_key: string;
  json_metadata: string;
  posting_json_metadata: string;
  proxy: string;
  balance: string | Asset;
  savings_balance: string | Asset;
  pxs_balance: string | Asset;
  savings_pxs_balance: string | Asset;
  savings_pxs_seconds: string;
  savings_pxs_seconds_last_update: string;
  savings_pxs_last_interest_payment: string;
  savings_withdraw_requests: number;
  vesting_shares: string | Asset;
  delegated_vesting_shares: string | Asset;
  received_vesting_shares: string | Asset;
  vesting_withdraw_rate: string | Asset;
  to_withdraw: string | number;
  withdrawn: string | number;
  withdraw_routes: number;
  reward_pixa_balance: string | Asset;
  reward_pxs_balance: string | Asset;
  reward_vesting_balance: string | Asset;
  voting_power: number;
  voting_manabar: {
    current_mana: string | number;
    last_update_time: number;
  };
  post_count: number;
  created: string;
  last_post: string;
  last_vote_time: string;
  witnesses_voted_for: number;
}

interface ExtendedAccount extends Account {
  curation_rewards: number;
  posting_rewards: number;
  // ... additional chain-state fields
}
```

</details>

<details>
<summary><strong>📋 <a id="-appliedoperation-interface"></a>AppliedOperation Interface</strong></summary>

Returned by: [`database.getOperations()`](#getoperationsblocknum-onlyvirtual), [`database.getAccountHistory()`](#getaccounthistoryaccount-from-limit-operation_bitmask), [`blockchain.getOperations()`](#getoperationsoptions)

```typescript
interface AppliedOperation {
  trx_id: string;
  block: number;
  trx_in_block: number;
  op_in_trx: number;
  virtual_op: number;
  timestamp: string;
  op: Operation;
}
```

</details>

<details>
<summary><strong>📋 <a id="-blockheader-interface"></a>BlockHeader Interface</strong></summary>

Returned by: [`database.getBlockHeader()`](#getblockheaderblocknum), [`blockchain.getCurrentBlockHeader()`](#getcurrentblockheadermode)

```typescript
interface BlockHeader {
  previous: string;
  timestamp: string;
  witness: string;
  transaction_merkle_root: string;
  extensions: any[];
}
```

</details>

<details>
<summary><strong>📋 <a id="-signedblock-interface"></a>SignedBlock Interface</strong></summary>

Returned by: [`database.getBlock()`](#getblockblocknum), [`blockchain.getCurrentBlock()`](#getcurrentblockmode), [`blockchain.getBlocks()`](#getblocksoptions)

Extends: [`BlockHeader`](#-blockheader-interface)

```typescript
interface SignedBlock extends BlockHeader {
  witness_signature: string;
  block_id: string;
  signing_key: string;
  transaction_ids: string[];
  transactions: Transaction[];
}
```

</details>

<details>
<summary><strong>📋 <a id="-transaction-interface"></a>Transaction / SignedTransaction / TransactionConfirmation Interfaces</strong></summary>

Returned by: [`database.getTransaction()`](#gettransactiontxid) (SignedTransaction), all `broadcast.*` methods (TransactionConfirmation)

```typescript
interface Transaction {
  ref_block_num: number;
  ref_block_prefix: number;
  expiration: string;
  operations: Operation[];
  extensions: any[];
}

interface SignedTransaction extends Transaction {
  signatures: string[];
}

interface TransactionConfirmation {
  id: string;           // what client.broadcast returns
  block_num?: number;   // only from broadcast_transaction_synchronous, called directly
  trx_num?: number;
  expired?: boolean;
}
```

</details>

<details>
<summary><strong>📋 <a id="-authority-interface"></a>Authority Class / AuthorityType Interface</strong></summary>

Used in: [`Account`](#-account-interface) (owner, active, posting), account creation/update operations

```typescript
interface AuthorityType {
  weight_threshold: number;
  account_auths: [string, number][];
  key_auths: [string | PublicKey, number][];
}
```

The `Authority` class implements `AuthorityType` and provides convenience methods:

```js
import { Authority, PublicKey } from "@pixagram/dpixa";

// Create from a single public key
const auth = Authority.from("PIX7abc...");

// Create from an AuthorityType object
const auth2 = Authority.from({
  weight_threshold: 1,
  account_auths: [],
  key_auths: [["PIX7abc...", 1]]
});

// Create from PublicKey instance
const pubKey = PublicKey.fromString("PIX7abc...");
const auth3 = Authority.from(pubKey);
```

</details>

<details>
<summary><strong>📋 <a id="-discussion-interface"></a>Discussion / Comment Interfaces</strong></summary>

Returned by: [`database.getDiscussions()`](#getdiscussionsby-query), [`pixamind.getRankedPosts()`](#getrankedpostsoptions), [`pixamind.getAccountPosts()`](#getaccountpostsoptions)

`Discussion` extends `Comment` with additional display-oriented fields.

```typescript
interface Comment {
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
  last_payout: string;
  depth: number;
  children: number;
  net_rshares: string;
  abs_rshares: string;
  children_abs_rshares: string;
  cashout_time: string;
  max_cashout_time: string;
  total_vote_weight: number;
  total_payout_value: string | Asset;
  curator_payout_value: string | Asset;
  author_rewards: string;
  net_votes: number;
  max_accepted_payout: string;
  percent_pxs: number;
  allow_replies: boolean;
  allow_votes: boolean;
  allow_curation_rewards: boolean;
  beneficiaries: BeneficiaryRoute[];
}

interface Discussion extends Comment {
  active_votes: any[];
  author_reputation: number;
  body_length: string;
  pending_payout_value: string | Asset;
  url: string;
  root_title: string;
  promoted: string | Asset;     // PXS burned to promote the post (Pixamind)
  nft_minted?: boolean;         // the post is minted as an NFT (Pixamind, hardfork 32)
  first_reblogged_by?: any;
  first_reblogged_on?: any;
}
```

</details>

<details>
<summary><strong>📋 <a id="-disqussionquery-interface"></a>DisqussionQuery Interface</strong></summary>

Used by: [`database.getDiscussions()`](#getdiscussionsby-query)

```typescript
interface DisqussionQuery {
  tag?: string;
  limit: number;
  filter_tags?: string[];
  select_authors?: string[];
  select_tags?: string[];
  truncate_body?: number;
  start_author?: string;
  start_permlink?: string;
  parent_author?: string;
  parent_permlink?: string;
}
```

</details>

<details>
<summary><strong>📋 <a id="-vestingdelegation-interface"></a>VestingDelegation Interface</strong></summary>

Returned by: [`database.getVestingDelegations()`](#getvestingdelegationsaccount-from-limit)

```typescript
interface VestingDelegation {
  id: number;
  delegator: string;
  delegatee: string;
  vesting_shares: string | Asset;
  min_delegation_time: string;
}
```

</details>

<details>
<summary><strong>📋 <a id="-communitydetail-interface"></a>CommunityDetail Interface</strong></summary>

Returned by: [`pixamind.getCommunity()`](#getcommunityoptions), [`pixamind.listCommunities()`](#listcommunitiesoptions)

```typescript
interface CommunityDetail {
  id: number;
  name: string;
  title: string;
  about: string;
  lang: string;
  type_id: number;
  is_nsfw: boolean;
  subscribers: number;
  sum_pending: number;
  num_pending: number;
  num_authors: number;
  created_at: string;
  avatar_url: string;
  description: string;
  flag_text: string;
  settings: object;
  team: string[];
  admins: string[];
}
```

</details>

<details>
<summary><strong>📋 <a id="-notifications-interface"></a>Notifications Interface</strong></summary>

Returned by: [`pixamind.getAccountNotifications()`](#getaccountnotificationsoptions)

```typescript
interface Notifications {
  id: number;
  type: string;      // "vote", "reply", "mention", "follow", "reblog", etc.
  score: number;
  date: string;
  msg: string;
  url: string;
}
```

</details>

<details>
<summary><strong>📋 <a id="-accountsbykey-interface"></a>AccountsByKey Interface</strong></summary>

Returned by: [`keys.getKeyReferences()`](#getkeyreferenceskeys)

```typescript
interface AccountsByKey {
  accounts: string[][];  // Array of arrays — each inner array = accounts for that key
}
```

</details>

<details>
<summary><strong>📋 <a id="-beneficiaryroute-interface"></a>BeneficiaryRoute Interface</strong></summary>

Used in: [`CommentOptionsOperation`](#operations-reference), [`Discussion`](#-discussion-interface)

```typescript
interface BeneficiaryRoute {
  account: string;
  weight: number;  // 0-10000 (basis points, 10000 = 100%)
}
```

</details>

<details>
<summary><strong>📋 <a id="-blockchainstreamoptions-interface"></a>BlockchainStreamOptions Interface</strong></summary>

Used by: [`blockchain.getBlockNumbers()`](#getblocknumbersoptions), [`blockchain.getBlocks()`](#getblocksoptions), [`blockchain.getOperations()`](#getoperationsoptions)

```typescript
interface BlockchainStreamOptions {
  from?: number;           // Starting block number (default: current)
  to?: number;             // Ending block number (default: infinite)
  mode?: BlockchainMode;   // Finality mode
}
```

</details>

<details>
<summary><strong>📋 <a id="-smtasset-interface"></a>SMTAsset Interface</strong></summary>

Used for SMT (Smart Media Token) asset representations.

```typescript
interface SMTAsset {
  amount: string | number;
  precision: number;
  nai: string;
}
```

</details>

<details>
<summary><strong>📋 <a id="-hexbuffer-class"></a>HexBuffer Class</strong></summary>

Buffer wrapper that serializes to a hex-encoded string. Useful for binary data in operations.

```js
import { HexBuffer } from "@pixagram/dpixa";

// Create from hex string
const hex = HexBuffer.from("deadbeef");

// Create from buffer
const buf = HexBuffer.from(Buffer.from([0xde, 0xad]));

// Create from byte array
const arr = HexBuffer.from([0xde, 0xad, 0xbe, 0xef]);

// Export
hex.toString();        // "deadbeef"
hex.toString("hex");   // "deadbeef"
hex.toJSON();          // "deadbeef"
hex.buffer;            // <Buffer de ad be ef>
```

</details>

<details>
<summary><strong>📋 <a id="-operation-interfaces"></a>Operation Interfaces (full list)</strong></summary>

All operations follow the tuple pattern `[OperationName, { ...params }]`.

**Type aliases:**

```typescript
type OperationName =
  | "vote" | "comment" | "transfer" | "transfer_to_vesting"
  | "withdraw_vesting" | "limit_order_create" | "limit_order_cancel"
  | "feed_publish" | "convert" | "account_create" | "account_update"
  | "witness_update" | "account_witness_vote" | "account_witness_proxy"
  | "pow" | "custom" | "report_over_production" | "delete_comment"
  | "custom_json" | "comment_options" | "set_withdraw_vesting_route"
  | "limit_order_create2" | "claim_account" | "create_claimed_account"
  | "request_account_recovery" | "recover_account" | "change_recovery_account"
  | "escrow_transfer" | "escrow_dispute" | "escrow_release" | "pow2"
  | "escrow_approve" | "transfer_to_savings" | "transfer_from_savings"
  | "cancel_transfer_from_savings" | "custom_binary" | "decline_voting_rights"
  | "nft" | "set_reset_account" | "claim_reward_balance"
  | "delegate_vesting_shares" | "account_create_with_delegation"
  | "witness_set_properties" | "account_update2" | "create_proposal"
  | "update_proposal_votes" | "remove_proposal" | "update_proposal"
  | "collateralized_convert" | "recurrent_transfer";

type VirtualOperationName =
  | "author_reward" | "curation_reward" | "comment_reward"
  | "fill_convert_request" | "fill_vesting_withdraw" | "fill_order"
  | "producer_reward" | "interest" | "return_vesting_delegation"
  | "comment_benefactor_reward" | "clear_null_account_balance"
  | "sps_fund" | "sps_convert" | "changed_recovery_account"
  | "transfer_to_vesting_completed" | "account_created"
  | "vesting_shares_split" | "system_warning" | "shutdown_witness"
  | "dhf_funding" | "dhf_conversion" | "hardfork_hive" | "hardfork_hive_restore"
  | "limit_order_cancelled" | "producer_missed" | "proposal_fee"
  | "collateralized_convert_immediate_conversion" | "escrow_approved" | "escrow_rejected"
  | "proxy_cleared" | "declined_voting_rights" | "nft_sold" | "nft_royalty"
  // … the full list, with numbers: utils.operationOrders
```

**Individual operation interfaces** — each extends `Operation` with typed `[0]` (name) and `[1]` (params):

| Interface | Operation Name |
|-----------|---------------|
| `VoteOperation` | `vote` |
| `CommentOperation` | `comment` |
| `CommentOptionsOperation` | `comment_options` |
| `TransferOperation` | `transfer` |
| `TransferToVestingOperation` | `transfer_to_vesting` |
| `WithdrawVestingOperation` | `withdraw_vesting` |
| `DelegateVestingSharesOperation` | `delegate_vesting_shares` |
| `SetWithdrawVestingRouteOperation` | `set_withdraw_vesting_route` |
| `RecurrentTransferOperation` | `recurrent_transfer` |
| `AccountCreateOperation` | `account_create` |
| `AccountCreateWithDelegationOperation` | `account_create_with_delegation` |
| `CreateClaimedAccountOperation` | `create_claimed_account` |
| `ClaimAccountOperation` | `claim_account` |
| `AccountUpdateOperation` | `account_update` |
| `AccountUpdate2Operation` | `account_update2` |
| `ClaimRewardBalanceOperation` | `claim_reward_balance` |
| `DeleteCommentOperation` | `delete_comment` |
| `CustomJsonOperation` | `custom_json` |
| `CustomOperation` | `custom` |
| `CustomBinaryOperation` | `custom_binary` |
| `LimitOrderCreateOperation` | `limit_order_create` |
| `LimitOrderCreate2Operation` | `limit_order_create2` |
| `LimitOrderCancelOperation` | `limit_order_cancel` |
| `ConvertOperation` | `convert` |
| `CollateralizedConvertOperation` | `collateralized_convert` |
| `FeedPublishOperation` | `feed_publish` |
| `TransferToSavingsOperation` | `transfer_to_savings` |
| `TransferFromSavingsOperation` | `transfer_from_savings` |
| `CancelTransferFromSavingsOperation` | `cancel_transfer_from_savings` |
| `EscrowTransferOperation` | `escrow_transfer` |
| `EscrowApproveOperation` | `escrow_approve` |
| `EscrowDisputeOperation` | `escrow_dispute` |
| `EscrowReleaseOperation` | `escrow_release` |
| `AccountWitnessVoteOperation` | `account_witness_vote` |
| `AccountWitnessProxyOperation` | `account_witness_proxy` |
| `WitnessUpdateOperation` | `witness_update` |
| `WitnessSetPropertiesOperation` | `witness_set_properties` |
| `CreateProposalOperation` | `create_proposal` |
| `UpdateProposalOperation` | `update_proposal` |
| `UpdateProposalVotesOperation` | `update_proposal_votes` |
| `RemoveProposalOperation` | `remove_proposal` |
| `RequestAccountRecoveryOperation` | `request_account_recovery` |
| `RecoverAccountOperation` | `recover_account` |
| `ChangeRecoveryAccountOperation` | `change_recovery_account` |
| `DeclineVotingRightsOperation` | `decline_voting_rights` |
| `SetResetAccountOperation` | `set_reset_account` |
| `NftOperation` | `nft` (actions `NftMint`, `NftList`, `NftUnlist`, `NftBuy`, `NftTransfer`) |
| `NftSoldOperation` | `nft_sold` (virtual) |
| `NftRoyaltyOperation` | `nft_royalty` (virtual) |
| `ReportOverProductionOperation` | `report_over_production` |
| `PowOperation` | `pow` |
| `Pow2Operation` | `pow2` |

</details>

---

## Enumerations

```js
import { BlockchainMode } from "@pixagram/dpixa";

// BlockchainMode
BlockchainMode.Irreversible  // 0 — Only confirmed blocks (default)
BlockchainMode.Latest        // 1 — Head block (may be reversed on fork)
```

See also: [Asset Symbols](#asset-symbols-reference), [Discussion Query Categories](#discussion-query-categories), [Key Roles](#key-roles-reference)

---

## Constants

```js
import { 
  VERSION,
  DEFAULT_ADDRESS_PREFIX,
  DEFAULT_CHAIN_ID,
  NETWORK_ID
} from "@pixagram/dpixa";

console.log(VERSION);                // Library version string
console.log(DEFAULT_ADDRESS_PREFIX); // "PIX"
console.log(DEFAULT_CHAIN_ID);       // Buffer (32 bytes)
console.log(NETWORK_ID);             // Buffer (network ID for WIF)
```

---

## Advanced Usage

### Custom Backoff Strategy

```js
const client = new Client(["https://api.pixagram.com"], {
  backoff: (tries) => {
    // Exponential backoff with jitter
    const base = Math.min(1000 * Math.pow(2, tries), 30000);
    const jitter = Math.random() * 1000;
    return base + jitter;
  }
});
```

### Connection Pooling (Node.js)

```js
const https = require("https");

const agent = new https.Agent({
  keepAlive: true,
  maxSockets: 10
});

const client = new Client(["https://api.pixagram.com"], {
  agent: agent
});
```

### Building a Vote Bot

```js
async function autoVoter(authors, weight = 10000) {
  const postingKey = PrivateKey.fromLogin("mybot", "password", "posting");
  
  for await (const op of client.blockchain.getOperations()) {
    const [opType, opData] = op.op;
    
    if (opType === "comment" && 
        opData.parent_author === "" &&  // Root post only
        authors.includes(opData.author)) {
      
      try {
        await client.broadcast.vote({
          voter: "mybot",
          author: opData.author,
          permlink: opData.permlink,
          weight: weight
        }, postingKey);
        
        console.log(`Voted on @${opData.author}/${opData.permlink}`);
      } catch (error) {
        console.error(`Vote failed: ${error.message}`);
      }
    }
  }
}

autoVoter(["favorite-author1", "favorite-author2"]);
```

---

## Testing

```bash
npm ci
npm test              # lint gate (eslint), as CI runs it
npm run test:unit     # offline suite: crypto, serializers, assets, memos, compat snapshot, NFTs, hardfork 32
make test             # everything, including the tests that need a live node (TEST_NODE=https://… make test)
```

`test/nft.ts` checks the NFT operation against bytes printed by the node itself (a probe built against the node's headers, fc::raw::pack in the legacy pack mode that signatures cover). `test/hf32.ts` checks `client.nft`, the Pixamind additions, the promotion and claim helpers and the voting bar against a mocked node. `test/compat.ts` compares keys, signatures, digests and RPC request bodies with `test/fixtures/compat.json`; `test/compat-cases.js` lists the differences 1.7.0 made to it on purpose.

---

## Important Notes

> ⚠️ **WebSocket Removed**: As of v0.7.0, WebSocket support has been removed. Use HTTP(S) URLs.

> 💡 **CORS**: If running your own node, configure proper CORS headers for browser access.

> 🔐 **Security**: Never expose private keys in client-side code. Use minimum required key level.

> 📡 **Node Selection**: Use multiple RPC nodes for reliability with automatic failover.

---

## License

BSD 3-Clause with a no-military-use clause (`BSD-3-Clause-No-Military-License`), see [LICENSE](https://github.com/pixagram-blockchain/pixaclient/blob/main/LICENSE). dpixa started as a fork of [dhive](https://gitlab.syncad.com/hive/dhive), itself from dsteem by Johan Nordberg.

---

*Share and Enjoy!* 🚀
