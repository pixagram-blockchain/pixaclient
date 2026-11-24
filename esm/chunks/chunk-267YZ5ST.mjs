/*! @pixagram/dpixa 1.7.0 | BSD-3-Clause-No-Military-License | Copyright (c) 2017 Johan Nordberg, Copyright (c) 2025 Pixagram Ltd | https://github.com/pixagram-blockchain/pixaclient */
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  buildWitnessUpdateOp: () => buildWitnessUpdateOp,
  copy: () => copy,
  iteratorStream: () => iteratorStream,
  makeBitMaskFilter: () => makeBitMaskFilter,
  operationOrders: () => operationOrders,
  retryingFetch: () => retryingFetch,
  sleep: () => sleep,
  waitForEvent: () => waitForEvent
});

// src/crypto-registry.ts
var provider;
var registerCrypto = (implementation) => {
  provider = implementation;
};
var peekCrypto = () => provider;
var requireCrypto = (feature) => {
  if (!provider) {
    throw new Error(
      `dpixa: ${feature} needs the crypto module, which is not loaded. Import '@pixagram/dpixa/crypto' (or the full '@pixagram/dpixa') first.`
    );
  }
  return provider;
};

// src/iterator-stream.ts
var IteratorStream = class {
  constructor(iterator) {
    this.iterator = iterator;
    this.readable = true;
    this.destroyed = false;
    this.listeners = /* @__PURE__ */ new Map();
    this.flowing = false;
    this.pausedByUser = false;
    this.started = false;
  }
  on(event, listener) {
    const list = this.listeners.get(event);
    if (list) {
      list.push(listener);
    } else {
      this.listeners.set(event, [listener]);
    }
    if (event === "data" && !this.pausedByUser) {
      this.resume();
    }
    return this;
  }
  addListener(event, listener) {
    return this.on(event, listener);
  }
  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener.apply(this, args);
    };
    return this.on(event, wrapper);
  }
  off(event, listener) {
    const list = this.listeners.get(event);
    if (list) {
      const index = list.indexOf(listener);
      if (index !== -1) {
        list.splice(index, 1);
      }
    }
    return this;
  }
  removeListener(event, listener) {
    return this.off(event, listener);
  }
  removeAllListeners(event) {
    if (event === void 0) {
      this.listeners.clear();
    } else {
      this.listeners.delete(event);
    }
    return this;
  }
  listenerCount(event) {
    const list = this.listeners.get(event);
    return list ? list.length : 0;
  }
  emit(event, ...args) {
    const list = this.listeners.get(event);
    if (!list || list.length === 0) {
      if (event === "error") {
        throw args[0];
      }
      return false;
    }
    for (const listener of list.slice()) {
      listener.apply(this, args);
    }
    return true;
  }
  pause() {
    this.flowing = false;
    this.pausedByUser = true;
    return this;
  }
  resume() {
    this.flowing = true;
    this.pausedByUser = false;
    this.signal();
    if (!this.started) {
      this.started = true;
      void this.pump();
    }
    return this;
  }
  isPaused() {
    return !this.flowing;
  }
  pipe(destination, options) {
    this.on("data", (chunk) => {
      if (destination.write(chunk) === false && destination.once) {
        this.pause();
        destination.once("drain", () => this.resume());
      }
    });
    if ((!options || options.end !== false) && typeof destination.end === "function") {
      this.once("end", () => {
        destination.end();
      });
    }
    this.resume();
    return destination;
  }
  destroy(error) {
    if (this.destroyed) {
      return this;
    }
    this.destroyed = true;
    this.readable = false;
    this.signal();
    if (typeof this.iterator.return === "function") {
      void Promise.resolve(this.iterator.return()).catch(() => void 0);
    }
    if (error) {
      this.emit("error", error);
    }
    this.emit("close");
    return this;
  }
  [Symbol.asyncIterator]() {
    this.started = true;
    return this.iterator;
  }
  signal() {
    const wake = this.wake;
    this.wake = void 0;
    if (wake) {
      wake();
    }
  }
  waitUntilFlowing() {
    if (this.flowing || this.destroyed) {
      return void 0;
    }
    return new Promise((resolve2) => {
      this.wake = resolve2;
    });
  }
  async pump() {
    try {
      while (true) {
        await this.waitUntilFlowing();
        if (this.destroyed) {
          return;
        }
        const result = await this.iterator.next();
        if (this.destroyed) {
          return;
        }
        if (result.done) {
          break;
        }
        while (!this.flowing && !this.destroyed) {
          await this.waitUntilFlowing();
        }
        if (this.destroyed) {
          return;
        }
        this.emit("data", result.value);
      }
    } catch (error) {
      if (this.destroyed) {
        return;
      }
      this.readable = false;
      this.emit("error", error);
    }
    if (this.destroyed) {
      return;
    }
    this.readable = false;
    this.emit("end");
    this.emit("close");
  }
};

// src/utils.ts
var timeoutErrors = [
  "timeout",
  "ENOTFOUND",
  "ECONNREFUSED",
  "database lock",
  "CERT_HAS_EXPIRED",
  "EHOSTUNREACH",
  "ECONNRESET",
  "ERR_TLS_CERT_ALTNAME_INVALID",
  "EAI_AGAIN"
];
function waitForEvent(emitter, eventName) {
  return new Promise((resolve2, _reject) => {
    emitter.once(eventName, resolve2);
  });
}
function sleep(ms) {
  return new Promise((resolve2) => {
    setTimeout(resolve2, ms);
  });
}
var nodeStreamModule = () => {
  const proc = globalThis.process;
  if (proc && typeof proc.getBuiltinModule === "function") {
    try {
      return proc.getBuiltinModule("stream");
    } catch (_error) {
      return void 0;
    }
  }
  return void 0;
};
function iteratorStream(iterator) {
  const nodeStream = nodeStreamModule();
  if (!nodeStream) {
    return new IteratorStream(iterator);
  }
  const stream = new nodeStream.PassThrough({ objectMode: true });
  const iterate = async () => {
    for await (const item of iterator) {
      if (!stream.write(item)) {
        await waitForEvent(stream, "drain");
      }
    }
  };
  iterate().then(() => {
    stream.end();
  }).catch((error) => {
    stream.emit("error", error);
    stream.end();
  });
  return stream;
}
function copy(object) {
  return JSON.parse(JSON.stringify(object));
}
var IS_NODE = (() => {
  const proc = globalThis.process;
  return !!(proc && proc.versions && proc.versions.node);
})();
var AttemptTimer = class {
  constructor(url, ms) {
    this.url = url;
    this.ms = ms;
    this.controller = new AbortController();
    this.arm(`network timeout at: ${url}`, "request-timeout");
  }
  /** Response headers arrived: start the separate body timeout. */
  bodyPhase() {
    this.clear();
    this.arm(`Response timeout while trying to fetch ${this.url} (over ${this.ms}ms)`, "body-timeout");
  }
  clear() {
    if (this.timer !== void 0) {
      clearTimeout(this.timer);
      this.timer = void 0;
    }
  }
  arm(message, type) {
    this.timer = setTimeout(() => {
      const error = new Error(message);
      error.name = "FetchError";
      error.type = type;
      this.error = error;
      this.controller.abort();
    }, this.ms);
  }
};
var withErrorCode = (error) => {
  if (error && error.code === void 0 && error.cause && typeof error.cause.code === "string") {
    try {
      error.code = error.cause.code;
    } catch (_error) {
    }
  }
  return error;
};
async function retryingFetch(currentAddress, allAddresses, opts, timeout, failoverThreshold, consoleOnFailover, backoff, fetchTimeout) {
  let start = Date.now();
  let tries = 0;
  let round = 0;
  do {
    try {
      if (fetchTimeout) {
        opts.timeout = fetchTimeout(tries);
      }
      const timer = IS_NODE && opts.timeout > 0 ? new AttemptTimer(currentAddress, opts.timeout) : void 0;
      try {
        const response = await globalThis.fetch(
          currentAddress,
          timer ? { ...opts, signal: timer.controller.signal } : opts
        );
        if (timer) {
          timer.bodyPhase();
        }
        if (!response.ok) {
          if (response.status === 500) {
            const resJson = await response.json();
            if (resJson.jsonrpc === "2.0") {
              return { response: resJson, currentAddress };
            }
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return { response: await response.json(), currentAddress };
      } catch (error) {
        throw timer && timer.error ? timer.error : withErrorCode(error);
      } finally {
        if (timer) {
          timer.clear();
        }
      }
    } catch (error) {
      if (timeout !== 0 && Date.now() - start > timeout) {
        if ((!error || !error.code) && Array.isArray(allAddresses)) {
          currentAddress = failover(
            currentAddress,
            allAddresses,
            currentAddress,
            consoleOnFailover
          );
        } else {
          const isFailoverError = timeoutErrors.filter(
            (fe) => error && typeof error.code === "string" && error.code.includes(fe)
          ).length > 0;
          if (isFailoverError && Array.isArray(allAddresses) && allAddresses.length > 1) {
            if (round < failoverThreshold) {
              start = Date.now();
              tries = -1;
              if (failoverThreshold > 0) {
                round++;
              }
              currentAddress = failover(
                currentAddress,
                allAddresses,
                currentAddress,
                consoleOnFailover
              );
            } else {
              error.message = `[${error.code}] tried ${failoverThreshold} times with ${allAddresses.join(
                ","
              )}`;
              throw error;
            }
          } else {
            console.error(
              `Didn't failover for error ${error.code ? "code" : "message"}: [${error.code || error.message}]`
            );
            throw error;
          }
        }
      }
      await sleep(backoff(tries++));
    }
  } while (true);
}
var failover = (url, urls, currentAddress, consoleOnFailover) => {
  const index = urls.indexOf(url);
  const targetUrl = urls.length === index + 1 ? urls[0] : urls[index + 1];
  if (consoleOnFailover) {
    console.log(`Switched Pixa RPC: ${targetUrl} (previous: ${currentAddress})`);
  }
  return targetUrl;
};
var buildWitnessUpdateOp = (owner, props) => requireCrypto("utils.buildWitnessUpdateOp").buildWitnessUpdateOp(owner, props);
var operationOrders = {
  vote: 0,
  // tslint:disable-next-line: object-literal-sort-keys
  comment: 1,
  transfer: 2,
  transfer_to_vesting: 3,
  withdraw_vesting: 4,
  limit_order_create: 5,
  limit_order_cancel: 6,
  feed_publish: 7,
  convert: 8,
  account_create: 9,
  account_update: 10,
  witness_update: 11,
  account_witness_vote: 12,
  account_witness_proxy: 13,
  pow: 14,
  custom: 15,
  report_over_production: 16,
  delete_comment: 17,
  custom_json: 18,
  comment_options: 19,
  set_withdraw_vesting_route: 20,
  limit_order_create2: 21,
  claim_account: 22,
  create_claimed_account: 23,
  request_account_recovery: 24,
  recover_account: 25,
  change_recovery_account: 26,
  escrow_transfer: 27,
  escrow_dispute: 28,
  escrow_release: 29,
  pow2: 30,
  escrow_approve: 31,
  transfer_to_savings: 32,
  transfer_from_savings: 33,
  cancel_transfer_from_savings: 34,
  custom_binary: 35,
  decline_voting_rights: 36,
  nft: 37,
  // hardfork 32; the number of reset_account, a placeholder no block ever contained
  set_reset_account: 38,
  claim_reward_balance: 39,
  delegate_vesting_shares: 40,
  account_create_with_delegation: 41,
  witness_set_properties: 42,
  account_update2: 43,
  create_proposal: 44,
  update_proposal_votes: 45,
  remove_proposal: 46,
  update_proposal: 47,
  collateralized_convert: 48,
  recurrent_transfer: 49,
  // virtual ops
  fill_convert_request: 50,
  author_reward: 51,
  curation_reward: 52,
  comment_reward: 53,
  liquidity_reward: 54,
  interest: 55,
  fill_vesting_withdraw: 56,
  fill_order: 57,
  shutdown_witness: 58,
  fill_transfer_from_savings: 59,
  hardfork: 60,
  comment_payout_update: 61,
  return_vesting_delegation: 62,
  comment_benefactor_reward: 63,
  producer_reward: 64,
  clear_null_account_balance: 65,
  proposal_pay: 66,
  dhf_funding: 67,
  sps_fund: 67,
  // dhf_funding, as earlier dpixa versions named it
  hardfork_hive: 68,
  hardfork_pixa: 68,
  // hardfork_hive
  hardfork_hive_restore: 69,
  hardfork_pixa_restore: 69,
  // hardfork_hive_restore
  delayed_voting: 70,
  consolidate_treasury_balance: 71,
  effective_comment_vote: 72,
  ineffective_delete_comment: 73,
  dhf_conversion: 74,
  sps_convert: 74,
  // dhf_conversion
  expired_account_notification: 75,
  changed_recovery_account: 76,
  transfer_to_vesting_completed: 77,
  pow_reward: 78,
  vesting_shares_split: 79,
  account_created: 80,
  fill_collateralized_convert_request: 81,
  system_warning: 82,
  fill_recurrent_transfer: 83,
  failed_recurrent_transfer: 84,
  limit_order_cancelled: 85,
  producer_missed: 86,
  proposal_fee: 87,
  collateralized_convert_immediate_conversion: 88,
  escrow_approved: 89,
  escrow_rejected: 90,
  proxy_cleared: 91,
  declined_voting_rights: 92,
  nft_sold: 93,
  // hardfork 32
  nft_royalty: 94
  // hardfork 32
};
function makeBitMaskFilter(allowedOperations) {
  return allowedOperations.reduce(redFunction, [0n, 0n]).map((value) => value !== 0n ? value.toString() : null);
}
var redFunction = ([low, high], allowedOperation) => {
  if (allowedOperation < 64) {
    return [low | 1n << BigInt(allowedOperation), high];
  } else {
    return [low, high | 1n << BigInt(allowedOperation - 64)];
  }
};

// src/helpers/blockchain.ts
var BlockchainMode = /* @__PURE__ */ ((BlockchainMode2) => {
  BlockchainMode2[BlockchainMode2["Irreversible"] = 0] = "Irreversible";
  BlockchainMode2[BlockchainMode2["Latest"] = 1] = "Latest";
  return BlockchainMode2;
})(BlockchainMode || {});
var Blockchain = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Get latest block number.
   */
  async getCurrentBlockNum(mode = 0 /* Irreversible */) {
    const props = await this.client.database.getDynamicGlobalProperties();
    switch (mode) {
      case 0 /* Irreversible */:
        return props.last_irreversible_block_num;
      case 1 /* Latest */:
        return props.head_block_number;
    }
  }
  /**
   * Get latest block header.
   */
  async getCurrentBlockHeader(mode) {
    return this.client.database.getBlockHeader(
      await this.getCurrentBlockNum(mode)
    );
  }
  /**
   * Get latest block.
   */
  async getCurrentBlock(mode) {
    return this.client.database.getBlock(await this.getCurrentBlockNum(mode));
  }
  /**
   * Return a asynchronous block number iterator.
   * @param options Feed options, can also be a block number to start from.
   */
  async *getBlockNumbers(options) {
    const interval = 3;
    if (!options) {
      options = {};
    } else if (typeof options === "number") {
      options = { from: options };
    }
    let current = await this.getCurrentBlockNum(options.mode);
    if (options.from !== void 0 && options.from > current) {
      throw new Error(
        `From can't be larger than current block num (${current})`
      );
    }
    let seen = options.from !== void 0 ? options.from : current;
    while (true) {
      while (current > seen) {
        yield seen++;
        if (options.to !== void 0 && seen > options.to) {
          return;
        }
      }
      await sleep(interval * 1e3);
      current = await this.getCurrentBlockNum(options.mode);
    }
  }
  /**
   * Return a stream of block numbers, accepts same parameters as {@link getBlockNumbers}.
   */
  getBlockNumberStream(options) {
    return iteratorStream(this.getBlockNumbers(options));
  }
  /**
   * Return a asynchronous block iterator, accepts same parameters as {@link getBlockNumbers}.
   */
  async *getBlocks(options) {
    for await (const num of this.getBlockNumbers(options)) {
      yield await this.client.database.getBlock(num);
    }
  }
  /**
   * Return a stream of blocks, accepts same parameters as {@link getBlockNumbers}.
   */
  getBlockStream(options) {
    return iteratorStream(this.getBlocks(options));
  }
  /**
   * Return a asynchronous operation iterator, accepts same parameters as {@link getBlockNumbers}.
   */
  async *getOperations(options) {
    for await (const num of this.getBlockNumbers(options)) {
      const operations = await this.client.database.getOperations(num);
      for (const operation of operations) {
        yield operation;
      }
    }
  }
  /**
   * Return a stream of operations, accepts same parameters as {@link getBlockNumbers}.
   */
  getOperationsStream(options) {
    return iteratorStream(this.getOperations(options));
  }
};

// src/chain/account.ts
var Authority = class _Authority {
  constructor({ weight_threshold, account_auths, key_auths }) {
    this.weight_threshold = weight_threshold;
    this.account_auths = account_auths;
    this.key_auths = key_auths;
  }
  /**
   * Convenience to create a new instance from PublicKey or authority object.
   */
  static from(value) {
    const PublicKeyClass = peekCrypto()?.PublicKey;
    if (value instanceof _Authority) {
      return value;
    } else if (typeof value === "string" || PublicKeyClass !== void 0 && value instanceof PublicKeyClass) {
      return new _Authority({
        account_auths: [],
        key_auths: [[value, 1]],
        weight_threshold: 1
      });
    } else {
      return new _Authority(value);
    }
  }
};

// src/assert.ts
var AssertionError = class extends Error {
  constructor(message) {
    super(message);
    this.code = "ERR_ASSERTION";
    this.name = "AssertionError";
  }
};
var fail = (message, fallback) => {
  throw new AssertionError(message !== void 0 ? message : fallback);
};
var assert = Object.assign(
  (value, message) => {
    if (!value) {
      fail(message, "false == true");
    }
  },
  {
    deepEqual: (actual, expected, message) => {
      let equal = actual.length === expected.length;
      for (let i = 0; equal && i < actual.length; i++) {
        equal = actual[i] === expected[i];
      }
      if (!equal) {
        fail(message, "byte arrays are not equal");
      }
    },
    equal: (actual, expected, message) => {
      if (actual != expected) {
        fail(message, `${String(actual)} == ${String(expected)}`);
      }
    }
  }
);
var assert_default = assert;

// src/chain/asset.ts
var NAI_SYMBOLS = {
  "@@000000013": "PXS",
  "@@000000021": "PIXA",
  "@@000000037": "VESTS"
};
var symbolOfNai = (nai) => NAI_SYMBOLS[nai];
var Asset = class _Asset {
  constructor(amount, symbol) {
    this.amount = amount;
    this.symbol = symbol;
  }
  /**
   * Create a new Asset instance from a string, e.g. `42.000 PIXA`.
   */
  static fromString(string, expectedSymbol) {
    const [amountString, symbol] = string.split(" ");
    if (!["PXA", "HIVE", "PIXA", "TESTS", "PXP", "VESTS", "PXS", "TBD", "STEEM", "TPS", "SBD", "HBD"].includes(symbol)) {
      throw new Error(`Invalid asset symbol: ${symbol}`);
    }
    if (expectedSymbol && symbol !== expectedSymbol) {
      throw new Error(
        `Invalid asset, expected symbol: ${expectedSymbol} got: ${symbol}`
      );
    }
    const amount = Number.parseFloat(amountString);
    if (!Number.isFinite(amount)) {
      throw new Error(`Invalid asset amount: ${amountString}`);
    }
    return new _Asset(amount, symbol);
  }
  /**
   * Create an Asset from the form database_api (and HAF) use for amounts,
   * `{ amount: "5000", precision: 3, nai: "@@000000013" }`: `@@000000021` is PIXA, `@@000000013`
   * PXS and `@@000000037` VESTS (on a testnet, pass `TESTS` or `TBD` as `symbol`).
   */
  static fromNai(value, symbol) {
    const name = symbol || NAI_SYMBOLS[value && value.nai];
    if (!name) {
      throw new Error(`Unknown asset NAI: ${value && value.nai}`);
    }
    const precision = Number(value.precision);
    const raw = String(value.amount);
    if (!/^-?\d+$/.test(raw) || !Number.isInteger(precision) || precision < 0 || precision > 12) {
      throw new Error(`Invalid NAI asset ${JSON.stringify(value)}`);
    }
    const negative = raw.startsWith("-");
    const digits = raw.replace("-", "").padStart(precision + 1, "0");
    const text = precision > 0 ? `${digits.slice(0, digits.length - precision)}.${digits.slice(digits.length - precision)}` : digits;
    return new _Asset(Number.parseFloat((negative ? "-" : "") + text), name);
  }
  /**
   * Convenience to create new Asset.
   * @param value  An Asset, a string such as `"42.000 PIXA"`, a number, or an amount in the
   *               database_api form `{ amount, precision, nai }` (see {@link Asset.fromNai}).
   * @param symbol Symbol to use when created from number. Will also be used to validate
   *               the asset, throws if the passed value has a different symbol than this.
   */
  static from(value, symbol) {
    if (value && typeof value === "object" && !(value instanceof _Asset) && "nai" in value) {
      const asset = _Asset.fromNai(value);
      if (symbol && asset.symbol !== symbol) {
        throw new Error(`Invalid asset, expected symbol: ${symbol} got: ${asset.symbol}`);
      }
      return asset;
    }
    if (value instanceof _Asset) {
      if (symbol && value.symbol !== symbol) {
        throw new Error(
          `Invalid asset, expected symbol: ${symbol} got: ${value.symbol}`
        );
      }
      return value;
    } else if (typeof value === "number" && Number.isFinite(value)) {
      return new _Asset(value, symbol || "STEEM");
    } else if (typeof value === "string") {
      return _Asset.fromString(value, symbol);
    } else {
      throw new Error(`Invalid asset '${String(value)}'`);
    }
  }
  /**
   * Return the smaller of the two assets.
   */
  static min(a, b) {
    assert_default(
      a.symbol === b.symbol,
      "can not compare assets with different symbols"
    );
    return a.amount < b.amount ? a : b;
  }
  /**
   * Return the larger of the two assets.
   */
  static max(a, b) {
    assert_default(
      a.symbol === b.symbol,
      "can not compare assets with different symbols"
    );
    return a.amount > b.amount ? a : b;
  }
  /**
   * Return asset precision.
   */
  getPrecision() {
    switch (this.symbol) {
      case "VESTS":
        return 6;
      default:
        return 3;
    }
  }
  /**
   * returns a representation of this asset using only STEEM SBD for
   * legacy purposes
   */
  steem_symbols() {
    switch (this.symbol) {
      case "STEEM":
        return _Asset.from(this.amount, "PIXA");
      case "SBD":
        return _Asset.from(this.amount, "PXS");
      default:
        return this;
    }
  }
  /**
   * Return a string representation of this asset, e.g. `42.000 PIXA`.
   */
  toString() {
    return `${this.amount.toFixed(this.getPrecision())} ${this.symbol}`;
  }
  /**
   * Return a new Asset instance with amount added.
   */
  add(amount) {
    const other = _Asset.from(amount, this.symbol);
    assert_default(this.symbol === other.symbol, "can not add with different symbols");
    return new _Asset(this.amount + other.amount, this.symbol);
  }
  /**
   * Return a new Asset instance with amount subtracted.
   */
  subtract(amount) {
    const other = _Asset.from(amount, this.symbol);
    assert_default(
      this.symbol === other.symbol,
      "can not subtract with different symbols"
    );
    return new _Asset(this.amount - other.amount, this.symbol);
  }
  /**
   * Return a new Asset with the amount multiplied by factor.
   */
  multiply(factor) {
    const other = _Asset.from(factor, this.symbol);
    assert_default(
      this.symbol === other.symbol,
      "can not multiply with different symbols"
    );
    return new _Asset(this.amount * other.amount, this.symbol);
  }
  /**
   * Return a new Asset with the amount divided.
   */
  divide(divisor) {
    const other = _Asset.from(divisor, this.symbol);
    assert_default(
      this.symbol === other.symbol,
      "can not divide with different symbols"
    );
    return new _Asset(this.amount / other.amount, this.symbol);
  }
  /**
   * For JSON serialization, same as toString().
   */
  toJSON() {
    return this.toString();
  }
};
var Price = class _Price {
  /**
   * @param base  - represents a value of the price object to be expressed relatively to quote
   *                asset. Cannot have amount == 0 if you want to build valid price.
   * @param quote - represents an relative asset. Cannot have amount == 0, otherwise
   *                asertion fail.
   *
   * Both base and quote shall have different symbol defined.
   */
  constructor(base, quote) {
    this.base = base;
    this.quote = quote;
    assert_default(
      base.amount !== 0 && quote.amount !== 0,
      "base and quote assets must be non-zero"
    );
    assert_default(
      base.symbol !== quote.symbol,
      "base and quote can not have the same symbol"
    );
  }
  /**
   * Convenience to create new Price.
   */
  static from(value) {
    if (value instanceof _Price) {
      return value;
    } else {
      return new _Price(Asset.from(value.base), Asset.from(value.quote));
    }
  }
  /**
   * Return a string representation of this price pair.
   */
  toString() {
    return `${this.base}:${this.quote}`;
  }
  /**
   * Return a new Asset with the price converted between the symbols in the pair.
   * Throws if passed asset symbol is not base or quote.
   */
  convert(asset) {
    if (asset.symbol === this.base.symbol) {
      assert_default(this.base.amount > 0);
      return new Asset(
        asset.amount * this.quote.amount / this.base.amount,
        this.quote.symbol
      );
    } else if (asset.symbol === this.quote.symbol) {
      assert_default(this.quote.amount > 0);
      return new Asset(
        asset.amount * this.base.amount / this.quote.amount,
        this.base.symbol
      );
    } else {
      throw new Error(`Can not convert ${asset} with ${this}`);
    }
  }
};

// src/chain/nft.ts
var NFT_MAX_EDITIONS = 1e4;
var NFT_MAX_ROYALTY = 2500;
var NFT_MAX_LICENSE_BYTES = 72 * 1024;
var NFT_MINT_FEE_PER_EDITION = "1.000 PXS";
var NFT_RESERVE = 0;
var NFT_NEVER_EXPIRES = "2106-02-07T06:28:15";
var NFT_LATEST_EXPIRATION = "2038-01-19T03:14:07";
var NFT_BURN_ACCOUNT = "null";
var NFT_FIND_LIMIT = 100;
var NFT_ACTION_TAGS = {
  nft_mint: 0,
  nft_list: 1,
  nft_unlist: 2,
  nft_buy: 3,
  nft_transfer: 4
};
var NFT_ACTION_NAMES = ["nft_mint", "nft_list", "nft_unlist", "nft_buy", "nft_transfer"];
var parseNftId = (id) => {
  const first = typeof id === "string" ? id.indexOf("/") : -1;
  const last = typeof id === "string" ? id.lastIndexOf("/") : -1;
  const wellFormed = typeof id === "string" && id.length >= 2 && id[0] === "@" && first >= 0 && last > first + 1 && last + 1 < id.length;
  if (!wellFormed) {
    throw new Error(`An NFT id is written @author/permlink/N, got '${String(id)}'`);
  }
  const author = id.slice(1, first);
  if (!/^[a-z][a-z0-9.-]{2,15}$/.test(author)) {
    throw new Error(`Invalid author in NFT id '${id}'`);
  }
  const number = id.slice(last + 1);
  if (!/^(0|[1-9][0-9]{0,4})$/.test(number) || Number(number) > NFT_MAX_EDITIONS) {
    throw new Error(`Invalid copy number in NFT id '${id}'`);
  }
  return { author, permlink: id.slice(first + 1, last), edition: Number(number) };
};
var isNftId = (id) => {
  try {
    parseNftId(id);
    return true;
  } catch (_error) {
    return false;
  }
};
var formatNftId = (author, permlink, edition = 0) => {
  if (!Number.isInteger(edition) || edition < 0 || edition > NFT_MAX_EDITIONS) {
    throw new Error(`NFT edition must be an integer from 0 to ${NFT_MAX_EDITIONS}, got ${edition}`);
  }
  return `@${author}/${permlink}/${edition}`;
};
var utf8ByteLength = (text) => {
  let bytes = 0;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code < 128) {
      bytes += 1;
    } else if (code < 2048) {
      bytes += 2;
    } else if (code >= 55296 && code <= 56319 && i + 1 < text.length) {
      bytes += 4;
      i++;
    } else {
      bytes += 3;
    }
  }
  return bytes;
};
var milli = (asset) => {
  const [whole, fraction = ""] = asset.amount.toFixed(3).split(".");
  const negative = whole.startsWith("-");
  const value = BigInt(whole.replace("-", "")) * 1000n + BigInt(fraction.padEnd(3, "0").slice(0, 3));
  return negative ? -value : value;
};
var fromMilli = (value, symbol) => {
  const negative = value < 0n;
  const magnitude = negative ? -value : value;
  const text = `${negative ? "-" : ""}${magnitude / 1000n}.${(magnitude % 1000n).toString().padStart(3, "0")}`;
  return Asset.fromString(`${text} ${symbol}`);
};
var nftMintFee = (editions, perEdition = NFT_MINT_FEE_PER_EDITION) => {
  if (!Number.isInteger(editions) || editions < 1 || editions > NFT_MAX_EDITIONS) {
    throw new Error(`An NFT has 1 to ${NFT_MAX_EDITIONS} copies, got ${editions}`);
  }
  const fee = Asset.from(perEdition);
  return fromMilli(milli(fee) * BigInt(editions), fee.symbol);
};
var nftRoyalty = (price, royalty) => {
  if (!Number.isInteger(royalty) || royalty < 0 || royalty > 1e4) {
    throw new Error(`An NFT royalty is in basis points, 0 to 10000, got ${royalty}`);
  }
  const amount = Asset.from(price);
  return fromMilli(milli(amount) * BigInt(royalty) / 10000n, amount.symbol);
};
var nftSaleSplit = (price, royalty, sellerIsCreator = false) => {
  const amount = Asset.from(price);
  const toCreator = sellerIsCreator ? fromMilli(0n, amount.symbol) : nftRoyalty(amount, royalty);
  return { royalty: toCreator, seller: fromMilli(milli(amount) - milli(toCreator), amount.symbol) };
};
var checkNftMint = (mint) => {
  const problems = [];
  if (typeof mint.permlink !== "string" || mint.permlink.length === 0) {
    problems.push("permlink: the permlink of a root post of the minter is required");
  }
  const editions = Number(mint.editions);
  if (!Number.isInteger(editions) || editions < 1 || editions > NFT_MAX_EDITIONS) {
    problems.push(`editions: 1 to ${NFT_MAX_EDITIONS} copies`);
  }
  const royalty = Number(mint.royalty);
  if (!Number.isInteger(royalty) || royalty < 0 || royalty > NFT_MAX_ROYALTY) {
    problems.push(`royalty: 0 to ${NFT_MAX_ROYALTY} basis points (25%)`);
  }
  if (typeof mint.license !== "string") {
    problems.push("license: the full text of the license terms is required");
  } else if (utf8ByteLength(mint.license) > NFT_MAX_LICENSE_BYTES) {
    problems.push(`license: at most ${NFT_MAX_LICENSE_BYTES} bytes of UTF-8 (72 KiB)`);
  }
  if (mint.fee === void 0) {
    problems.push("fee: editions x 1.000 PXS");
  } else {
    let fee;
    try {
      fee = Asset.from(mint.fee);
    } catch (_error) {
      problems.push("fee: not an asset");
    }
    if (fee && fee.symbol !== "PXS" && fee.symbol !== "TBD") {
      problems.push("fee: the mint fee is paid in PXS");
    } else if (fee && Number.isInteger(editions) && editions >= 1 && editions <= NFT_MAX_EDITIONS && milli(fee) !== milli(nftMintFee(editions))) {
      problems.push(`fee: exactly ${nftMintFee(editions, Asset.from(1, fee.symbol)).toString()} for ${editions} copies`);
    }
  }
  return problems;
};
var toNftAction = (action) => {
  let tag;
  let payload;
  if (Array.isArray(action)) {
    const [kind, value] = action;
    tag = typeof kind === "number" ? kind : NFT_ACTION_TAGS[kind];
    payload = value;
  } else if (action && typeof action === "object" && "type" in action) {
    const { type, value } = action;
    tag = NFT_ACTION_TAGS[String(type).replace(/_operation$/, "")];
    payload = value;
  } else {
    throw new Error("An NFT action is [tag, payload], [name, payload] or {type, value}");
  }
  if (!Number.isInteger(tag) || tag < 0 || tag >= NFT_ACTION_NAMES.length) {
    throw new Error(`Unknown NFT action: ${JSON.stringify(Array.isArray(action) ? action[0] : action.type)}`);
  }
  if (!payload || typeof payload !== "object") {
    throw new Error(`${NFT_ACTION_NAMES[tag]}: the action has no payload`);
  }
  return [tag, payload];
};
var nftActionName = (tag) => {
  const name = NFT_ACTION_NAMES[tag];
  if (name === void 0) {
    throw new Error(`Unknown NFT action tag: ${tag}`);
  }
  return name;
};

// src/chain/normalize.ts
var FIELD_ALIASES = {
  claim_reward_balance: [["reward_hive", "reward_pixa"], ["reward_hbd", "reward_pxs"]],
  comment_options: [["percent_hbd", "percent_pxs"]],
  escrow_release: [["hbd_amount", "pxs_amount"], ["hive_amount", "pixa_amount"]],
  escrow_transfer: [["hbd_amount", "pxs_amount"], ["hive_amount", "pixa_amount"]]
};
var CHAIN_PROPERTY_ALIASES = [["hbd_interest_rate", "pxs_interest_rate"]];
var sameValue = (a, b) => {
  if (a instanceof Asset || b instanceof Asset || typeof a === "string" && typeof b === "string") {
    try {
      const x = Asset.from(a);
      const y = Asset.from(b);
      return x.toString() === y.toString();
    } catch (_error) {
      return String(a) === String(b);
    }
  }
  return String(a) === String(b);
};
var withBothNames = (operation, data, aliases) => {
  let result = data;
  for (const [nodeName, pixaName] of aliases) {
    const nodeValue = result[nodeName];
    const pixaValue = result[pixaName];
    if (nodeValue === void 0 && pixaValue === void 0) {
      continue;
    }
    if (nodeValue !== void 0 && pixaValue !== void 0) {
      if (!sameValue(nodeValue, pixaValue)) {
        throw new Error(`${operation}: ${nodeName} and ${pixaName} are the same field and hold different values`);
      }
      continue;
    }
    if (result === data) {
      result = { ...data };
    }
    if (nodeValue === void 0) {
      result[nodeName] = pixaValue;
    } else {
      result[pixaName] = nodeValue;
    }
  }
  return result;
};
var seconds = (time) => Date.parse(time.endsWith("Z") ? time : time + "Z") / 1e3;
var normalizeNft = (data) => {
  const [tag, payload] = toNftAction(data.action);
  const action = { ...payload };
  if (action.extensions === void 0) {
    action.extensions = [];
  }
  if (tag === 1 && action.expiration !== void 0) {
    const time = typeof action.expiration === "string" ? seconds(action.expiration) : NaN;
    if (time === seconds(NFT_NEVER_EXPIRES)) {
      delete action.expiration;
    } else if (time > seconds(NFT_LATEST_EXPIRATION)) {
      throw new Error(`nft_list.expiration: the node reads times up to ${NFT_LATEST_EXPIRATION}; leave expiration out for an offer that never expires`);
    }
  }
  return {
    ...data,
    action: [tag, action],
    extensions: data.extensions === void 0 ? [] : data.extensions
  };
};
var normalizeOperation = (operation) => {
  if (!Array.isArray(operation) || !operation[1] || typeof operation[1] !== "object") {
    return operation;
  }
  const [name, data] = operation;
  let result = data;
  if (name === "nft") {
    result = normalizeNft(data);
  } else if (FIELD_ALIASES[name]) {
    result = withBothNames(name, data, FIELD_ALIASES[name]);
  } else if (name === "witness_update" && data.props && typeof data.props === "object") {
    const props = withBothNames("witness_update.props", data.props, CHAIN_PROPERTY_ALIASES);
    if (props !== data.props) {
      result = { ...data, props };
    }
  }
  return result === data ? operation : [name, result];
};
var normalizeTransaction = (transaction) => {
  if (!transaction || !Array.isArray(transaction.operations)) {
    return transaction;
  }
  let changed = false;
  const operations = transaction.operations.map((operation) => {
    const normalized = normalizeOperation(operation);
    changed = changed || normalized !== operation;
    return normalized;
  });
  return changed ? { ...transaction, operations } : transaction;
};

// src/bbuffer.ts
var HEX_CHARS = "0123456789abcdef";
function bytesToHex(bytes, start = 0, end = bytes.length) {
  let out = "";
  for (let i = start; i < end; i++) {
    const b = bytes[i];
    out += HEX_CHARS[b >>> 4] + HEX_CHARS[b & 15];
  }
  return out;
}
function hexToBytes(hex) {
  if (hex.length >= 2 && hex[0] === "0" && (hex[1] === "x" || hex[1] === "X")) {
    hex = hex.slice(2);
  }
  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }
  const out = new Uint8Array(hex.length >>> 1);
  for (let i = 0; i < out.length; i++) {
    const hi = parseHexChar(hex.charCodeAt(i * 2));
    const lo = parseHexChar(hex.charCodeAt(i * 2 + 1));
    if (hi < 0 || lo < 0) {
      throw new Error(`Invalid hex string at position ${i * 2}`);
    }
    out[i] = hi << 4 | lo;
  }
  return out;
}
function parseHexChar(code) {
  if (code >= 48 && code <= 57) {
    return code - 48;
  }
  if (code >= 97 && code <= 102) {
    return code - 87;
  }
  if (code >= 65 && code <= 70) {
    return code - 55;
  }
  return -1;
}
function binaryToBytes(str) {
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    out[i] = str.charCodeAt(i) & 255;
  }
  return out;
}
function bytesToBinary(bytes, start = 0, end = bytes.length) {
  let out = "";
  const CHUNK = 32768;
  for (let i = start; i < end; i += CHUNK) {
    const slice = bytes.subarray(i, Math.min(i + CHUNK, end));
    out += String.fromCharCode.apply(null, slice);
  }
  return out;
}
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder("utf-8");
function utf8ToBytes(str) {
  return textEncoder.encode(str);
}
function bytesToUtf8(bytes, start = 0, end = bytes.length) {
  return textDecoder.decode(bytes.subarray(start, end));
}
function encodeString(str, encoding) {
  switch (encoding) {
    case "hex":
      return hexToBytes(str);
    case "binary":
    case "latin1":
      return binaryToBytes(str);
    case "utf-8":
    case "utf8":
      return utf8ToBytes(str);
    default:
      throw new Error(`Unsupported encoding: ${encoding}`);
  }
}
function decodeBytes(bytes, encoding, start = 0, end = bytes.length) {
  switch (encoding) {
    case "hex":
      return bytesToHex(bytes, start, end);
    case "binary":
    case "latin1":
      return bytesToBinary(bytes, start, end);
    case "utf-8":
    case "utf8":
      return bytesToUtf8(bytes, start, end);
    default:
      throw new Error(`Unsupported encoding: ${encoding}`);
  }
}
var BBuffer = class _BBuffer extends Uint8Array {
  /* ---- static factories ---- */
  /**
   * Allocate a new zero-filled buffer of the given size.
   * The optional `fill` argument is a byte value (0-255) to pre-fill with.
   */
  static alloc(size, fill = 0) {
    const buf = new _BBuffer(size);
    if (fill !== 0) {
      buf.fill(fill);
    }
    return buf;
  }
  static from(value, encoding = "utf-8") {
    if (typeof value === "string") {
      const bytes = encodeString(value, encoding);
      return _BBuffer.fromUint8Array(bytes);
    }
    if (value instanceof _BBuffer) {
      const out = new _BBuffer(value.length);
      out.set(value);
      return out;
    }
    if (value instanceof Uint8Array) {
      const out = new _BBuffer(value.length);
      out.set(value);
      return out;
    }
    if (value instanceof ArrayBuffer) {
      const view = new Uint8Array(value);
      const out = new _BBuffer(view.length);
      out.set(view);
      return out;
    }
    const arr = value;
    const result = new _BBuffer(arr.length);
    for (let i = 0; i < arr.length; i++) {
      result[i] = arr[i] & 255;
    }
    return result;
  }
  /** Concatenate a list of Uint8Arrays / BBuffers into a single new buffer. */
  static concat(list, totalLength) {
    if (totalLength === void 0) {
      totalLength = 0;
      for (const item of list) {
        totalLength += item.length;
      }
    }
    const out = new _BBuffer(totalLength);
    let offset = 0;
    for (const item of list) {
      if (offset + item.length > totalLength) {
        out.set(item.subarray(0, totalLength - offset), offset);
        break;
      }
      out.set(item, offset);
      offset += item.length;
    }
    return out;
  }
  /** Internal helper: wrap a Uint8Array in a BBuffer with its own memory. */
  static fromUint8Array(bytes) {
    const out = new _BBuffer(bytes.length);
    out.set(bytes);
    return out;
  }
  /* ---- instance methods ---- */
  /**
   * Return a string in the given encoding. Defaults to utf-8 so that calls
   * like `buf.toString()` behave like Node.js `Buffer`.
   */
  toString(encoding = "utf-8", start = 0, end = this.length) {
    return decodeBytes(this, encoding, start, end);
  }
  /**
   * Return an *independent* copy of the sub-range. Node's `Buffer.slice`
   * returns a view that aliases the original; that aliasing is one of the
   * classes of bug this module is meant to prevent, so we always copy.
   */
  slice(begin = 0, end = this.length) {
    const len = this.length;
    const s = begin < 0 ? Math.max(len + begin, 0) : Math.min(begin, len);
    let e = end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
    if (e < s) {
      e = s;
    }
    const out = new _BBuffer(e - s);
    out.set(super.subarray(s, e));
    return out;
  }
  /** Read a single unsigned byte. */
  readUInt8(offset = 0) {
    if (offset < 0 || offset >= this.length) {
      throw new RangeError(`readUInt8 out of range: ${offset}`);
    }
    return this[offset];
  }
  /** Write a single unsigned byte. Returns new offset like Node. */
  writeUInt8(value, offset = 0) {
    if (offset < 0 || offset >= this.length) {
      throw new RangeError(`writeUInt8 out of range: ${offset}`);
    }
    this[offset] = value & 255;
    return offset + 1;
  }
  /**
   * Read an unsigned little-endian 16/32-bit integer at `offset`.
   * Matches Node.js `Buffer.prototype.readUInt{16,32}LE`.
   */
  readUInt16LE(offset = 0) {
    if (offset < 0 || offset + 2 > this.length) {
      throw new RangeError(`readUInt16LE out of range: ${offset}`);
    }
    return this[offset] | this[offset + 1] << 8;
  }
  readUInt32LE(offset = 0) {
    if (offset < 0 || offset + 4 > this.length) {
      throw new RangeError(`readUInt32LE out of range: ${offset}`);
    }
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24) >>> 0;
  }
  /** Big-endian variants, for completeness. */
  readUInt16BE(offset = 0) {
    if (offset < 0 || offset + 2 > this.length) {
      throw new RangeError(`readUInt16BE out of range: ${offset}`);
    }
    return this[offset] << 8 | this[offset + 1];
  }
  readUInt32BE(offset = 0) {
    if (offset < 0 || offset + 4 > this.length) {
      throw new RangeError(`readUInt32BE out of range: ${offset}`);
    }
    return (this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]) >>> 0;
  }
  /**
   * Copy bytes from this buffer into `target`, starting at `targetStart`,
   * reading `[sourceStart, sourceEnd)` of this buffer. Mirrors Node's
   * `Buffer.prototype.copy` return value (number of bytes copied).
   */
  copy(target, targetStart = 0, sourceStart = 0, sourceEnd = this.length) {
    if (sourceEnd > this.length) {
      sourceEnd = this.length;
    }
    if (sourceStart < 0) {
      sourceStart = 0;
    }
    if (sourceEnd <= sourceStart) {
      return 0;
    }
    const available = target.length - targetStart;
    const want = sourceEnd - sourceStart;
    const n = Math.min(available, want);
    if (n <= 0) {
      return 0;
    }
    target.set(super.subarray(sourceStart, sourceStart + n), targetStart);
    return n;
  }
};

// src/helpers/broadcast.ts
var BroadcastAPI = class {
  constructor(client) {
    this.client = client;
    /**
     * How many milliseconds in the future to set the expiry time to when
     * broadcasting a transaction, defaults to 1 minute.
     */
    this.expireTime = 60 * 1e3;
  }
  /**
   * Broadcast a comment, also used to create a new top level post.
   * @param comment The comment/post.
   * @param key Private posting key of comment author.
   */
  async comment(comment, key) {
    const op = ["comment", comment];
    return this.sendOperations([op], key);
  }
  /**
   * Broadcast a comment and set the options.
   * @param comment The comment/post.
   * @param options The comment/post options.
   * @param key Private posting key of comment author.
   */
  async commentWithOptions(comment, options, key) {
    const ops = [
      ["comment", comment],
      ["comment_options", options]
    ];
    return this.sendOperations(ops, key);
  }
  /**
   * Broadcast a vote.
   * @param vote The vote to send.
   * @param key Private posting key of the voter.
   */
  async vote(vote, key) {
    const op = ["vote", vote];
    return this.sendOperations([op], key);
  }
  /**
   * Broadcast a transfer.
   * @param data The transfer operation payload.
   * @param key Private active key of sender.
   */
  async transfer(data, key) {
    const op = ["transfer", data];
    return this.sendOperations([op], key);
  }
  /**
   * Broadcast custom JSON.
   * @param data The custom_json operation payload.
   * @param key Private posting or active key.
   */
  async json(data, key) {
    const op = ["custom_json", data];
    return this.sendOperations([op], key);
  }
  /**
   * Claim pending rewards into the account's balances.
   * @param data The amounts to claim, as `getAccounts` shows them pending; PIXA as `reward_pixa`
   *             (or `reward_hive`), PXS as `reward_pxs` (or `reward_hbd`), and `reward_vests`.
   * @param key Private posting key of the account.
   */
  async claimRewardBalance(data, key) {
    const op = ["claim_reward_balance", data];
    return this.sendOperations([op], key);
  }
  /**
   * Broadcast an nft_operation (hardfork 32): mint, offer, withdraw an offer, buy or give away a
   * copy. {@link NftAPI} (`client.nft`) builds each action and checks it first.
   * @param data `account` (the actor) and `action`, e.g. `[0, { permlink, editions, royalty, license, fee }]`.
   * @param key Private active key of `account`.
   */
  async nft(data, key) {
    const op = ["nft", data];
    return this.sendOperations([op], key);
  }
  /**
   * Promote a post: burn PXS for it by sending it to `null` with the memo `@author/permlink`.
   * Pixamind adds the amount to the post's promoted total, which ranks the promoted feed while
   * the post awaits its payout. Only a root post can be promoted, only PXS counts, and the PXS is
   * burned whatever happens to the post.
   * @param data `from` pays, `author`/`permlink` name the post, `amount` in PXS (from 0.001).
   * @param key Private active key of `from`.
   */
  async promote(data, key) {
    const amount = Asset.from(data.amount);
    if (amount.symbol !== "PXS" && amount.symbol !== "TBD") {
      throw new Error(`A promotion is paid in PXS, got ${amount.toString()}`);
    }
    if (!(amount.amount >= 1e-3)) {
      throw new Error(`A promotion is at least 0.001 PXS, got ${amount.toString()}`);
    }
    if (!data.author || !data.permlink) {
      throw new Error("A promotion names a post: author and permlink");
    }
    const op = [
      "transfer",
      { amount, from: data.from, memo: `@${data.author}/${data.permlink}`, to: "null" }
    ];
    return this.sendOperations([op], key);
  }
  /**
   * Create a new account on testnet.
   * @param options New account options.
   * @param key Private active key of account creator.
   */
  async createTestAccount(options, key) {
    assert_default(
      Object.prototype.hasOwnProperty.call(globalThis, "it"),
      "helper to be used only for mocha tests"
    );
    const cryptoImpl = requireCrypto("client.broadcast.createTestAccount");
    const { username, metadata, creator } = options;
    const prefix = this.client.addressPrefix;
    let owner, active, posting, memo_key;
    if (options.password) {
      const ownerKey = cryptoImpl.PrivateKey.fromLogin(
        username,
        options.password,
        "owner"
      ).createPublic(prefix);
      owner = Authority.from(ownerKey);
      const activeKey = cryptoImpl.PrivateKey.fromLogin(
        username,
        options.password,
        "active"
      ).createPublic(prefix);
      active = Authority.from(activeKey);
      const postingKey = cryptoImpl.PrivateKey.fromLogin(
        username,
        options.password,
        "posting"
      ).createPublic(prefix);
      posting = Authority.from(postingKey);
      memo_key = cryptoImpl.PrivateKey.fromLogin(
        username,
        options.password,
        "memo"
      ).createPublic(prefix);
    } else if (options.auths) {
      owner = Authority.from(options.auths.owner);
      active = Authority.from(options.auths.active);
      posting = Authority.from(options.auths.posting);
      memo_key = cryptoImpl.PublicKey.from(options.auths.memoKey);
    } else {
      throw new Error("Must specify either password or auths");
    }
    let { fee, delegation } = options;
    delegation = Asset.from(delegation || 0, "VESTS");
    fee = Asset.from(fee || 0, "TESTS");
    if (fee.amount > 0) {
      const chainProps = await this.client.database.getChainProperties();
      const creationFee = Asset.from(chainProps.account_creation_fee);
      if (fee.amount !== creationFee.amount) {
        throw new Error("Fee must be exactly " + creationFee.toString());
      }
    }
    const claim_op = [
      "claim_account",
      {
        creator,
        extensions: [],
        fee
      }
    ];
    const create_op = [
      "create_claimed_account",
      {
        active,
        creator,
        extensions: [],
        json_metadata: metadata ? JSON.stringify(metadata) : "",
        memo_key,
        new_account_name: username,
        owner,
        posting
      }
    ];
    const ops = [claim_op, create_op];
    if (delegation.amount > 0) {
      const delegate_op = [
        "delegate_vesting_shares",
        {
          delegatee: username,
          delegator: creator,
          vesting_shares: delegation
        }
      ];
      ops.push(delegate_op);
    }
    return this.sendOperations(ops, key);
  }
  /**
   * Update account.
   * @param data The account_update payload.
   * @param key The private key of the account affected, should be the corresponding
   *            key level or higher for updating account authorities.
   */
  async updateAccount(data, key) {
    const op = ["account_update", data];
    return this.sendOperations([op], key);
  }
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
  async delegateVestingShares(options, key) {
    const op = ["delegate_vesting_shares", options];
    return this.sendOperations([op], key);
  }
  /**
   * Sign and broadcast transaction with operations to the network. Throws if the transaction expires.
   * @param operations List of operations to send.
   * @param key Private key(s) used to sign transaction.
   */
  async sendOperations(operations, key) {
    requireCrypto("client.broadcast.sendOperations");
    const props = await this.client.database.getDynamicGlobalProperties();
    const ref_block_num = props.head_block_number & 65535;
    const ref_block_prefix = BBuffer.from(
      props.head_block_id,
      "hex"
    ).readUInt32LE(4);
    const expiration = new Date(
      (/* @__PURE__ */ new Date(props.time + "Z")).getTime() + this.expireTime
    ).toISOString().slice(0, -5);
    const extensions = [];
    const tx = {
      expiration,
      extensions,
      operations,
      ref_block_num,
      ref_block_prefix
    };
    const result = await this.send(this.sign(tx, key));
    return result;
  }
  /**
   * Sign a transaction with key(s).
   */
  sign(transaction, key) {
    return requireCrypto("client.broadcast.sign").signTransaction(transaction, key, this.client.chainId);
  }
  /**
   * Broadcast a signed transaction to the network.
   *
   * The operations are sent in the form the node reads (see `normalizeTransaction`), which never
   * changes what the signatures cover. The node checks and queues the transaction; `id` is its
   * transaction id, and `client.transaction.findTransaction(id)` tells when it is in a block.
   */
  async send(transaction) {
    const trxId = requireCrypto("client.broadcast.send").generateTrxId(transaction);
    const result = await this.call("broadcast_transaction", [normalizeTransaction(transaction)]);
    return Object.assign({ id: trxId }, result);
  }
  /**
   * Convenience for calling `condenser_api`.
   */
  call(method, params) {
    return this.client.call("condenser_api", method, params);
  }
};

// src/helpers/database.ts
var DatabaseAPI = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Convenience for calling `database_api`.
   */
  call(method, params) {
    return this.client.call("condenser_api", method, params);
  }
  /**
   * Return state of server.
   */
  getDynamicGlobalProperties() {
    return this.call("get_dynamic_global_properties");
  }
  /**
   * Return median chain properties decided by witness.
   */
  async getChainProperties() {
    return this.call("get_chain_properties");
  }
  /**
   * Return all of the state required for a particular url path.
   * @param path Path component of url conforming to condenser's scheme
   *             e.g. `@almost-digital` or `trending/travel`
   */
  async getState(path) {
    return this.call("get_state", [path]);
  }
  /**
   * Return median price in PXS for 1 PIXA as reported by the witnesses.
   */
  async getCurrentMedianHistoryPrice() {
    return Price.from(await this.call("get_current_median_history_price"));
  }
  /**
   * Get list of delegations made by account.
   * @param account Account delegating
   * @param from Delegatee start offset, used for paging.
   * @param limit Number of results, max 1000.
   */
  async getVestingDelegations(account, from = "", limit = 1e3) {
    return this.call("get_vesting_delegations", [account, from, limit]);
  }
  /**
   * Return server config. See:
   * https://github.com/steemit/steem/blob/master/libraries/protocol/include/steemit/protocol/config.hpp
   */
  getConfig() {
    return this.call("get_config");
  }
  /**
   * Return header for *blockNum*.
   */
  getBlockHeader(blockNum) {
    return this.call("get_block_header", [blockNum]);
  }
  /**
   * Return block *blockNum*.
   */
  getBlock(blockNum) {
    return this.call("get_block", [blockNum]);
  }
  /**
   * Return all applied operations in *blockNum*.
   */
  getOperations(blockNum, onlyVirtual = false) {
    return this.call("get_ops_in_block", [blockNum, onlyVirtual]);
  }
  /**
   * Return array of discussions (a.k.a. posts).
   * @param by The type of sorting for the discussions, valid options are:
   *           `active` `blog` `cashout` `children` `comments` `created`
   *           `feed` `hot` `promoted` `trending` `votes`. Note that
   *           for `blog` and `feed` the tag is set to a username.
   */
  getDiscussions(by, query) {
    return this.call(`get_discussions_by_${by}`, [query]);
  }
  /**
   * Return array of account info objects for the usernames passed.
   * @param usernames The accounts to fetch.
   */
  getAccounts(usernames) {
    return this.call("get_accounts", [usernames]);
  }
  /**
   * Returns the details of a transaction based on a transaction id.
   */
  async getTransaction(txId) {
    return this.call("get_transaction", [txId]);
  }
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
  getAccountHistory(account, from, limit, operation_bitmask) {
    let params = [account, from, limit];
    if (operation_bitmask && Array.isArray(operation_bitmask)) {
      if (operation_bitmask.length !== 2) {
        throw Error(
          "operation_bitmask should be generated by the helper function"
        );
      }
      params = params.concat(operation_bitmask);
    }
    return this.call("get_account_history", params);
  }
  /**
   * Verify signed transaction.
   */
  async verifyAuthority(stx) {
    return this.call("verify_authority", [stx]);
  }
  /** return rpc node version */
  async getVersion() {
    return this.call("get_version", []);
  }
};

// src/chain/misc.ts
var HexBuffer = class _HexBuffer {
  constructor(buffer) {
    this.buffer = buffer;
  }
  /**
   * Convenience to create a new HexBuffer, does not copy data if value passed is already a buffer.
   *
   * Accepts any Uint8Array-backed buffer, which includes the bundled BBuffer,
   * Node's native Buffer, and plain Uint8Array. Previously the parameter was
   * typed as just `Buffer` (= BBuffer in this file) which rejected Node
   * Buffers even though they work identically at runtime — broke the
   * operations test suite under strict TS.
   */
  static from(value) {
    if (value instanceof _HexBuffer) {
      return value;
    } else if (value instanceof Uint8Array) {
      return new _HexBuffer(BBuffer.from(value));
    } else if (typeof value === "string") {
      return new _HexBuffer(BBuffer.from(value, "hex"));
    } else {
      return new _HexBuffer(BBuffer.from(value));
    }
  }
  toString(encoding = "hex") {
    return this.buffer.toString(encoding);
  }
  toJSON() {
    return this.toString();
  }
};
var VOTING_MANA_REGENERATION_SECONDS_PRE_HF32 = 432e3;
function getVotingManaRegenerationSeconds(props) {
  const seconds2 = props ? Number(props.voting_mana_regeneration_seconds) : NaN;
  return Number.isFinite(seconds2) && seconds2 > 0 ? seconds2 : VOTING_MANA_REGENERATION_SECONDS_PRE_HF32;
}
function getVestingSharePrice(props) {
  const fund = props.total_vesting_fund_pixa !== void 0 ? props.total_vesting_fund_pixa : props.total_vesting_fund_hive;
  const totalVestingFund = Asset.from(fund);
  const totalVestingShares = Asset.from(props.total_vesting_shares);
  if (totalVestingFund.amount === 0 || totalVestingShares.amount === 0) {
    return new Price(new Asset(1, "VESTS"), new Asset(1, "PIXA"));
  }
  return new Price(totalVestingShares, totalVestingFund);
}
function getVests(account, subtract_delegated = true, add_received = true) {
  let vests = Asset.from(account.vesting_shares);
  const vests_delegated = Asset.from(account.delegated_vesting_shares);
  const vests_received = Asset.from(account.received_vesting_shares);
  const withdraw_rate = Asset.from(account.vesting_withdraw_rate);
  const already_withdrawn = (Number(account.to_withdraw) - Number(account.withdrawn)) / 1e6;
  const withdraw_vests = Math.min(withdraw_rate.amount, already_withdrawn);
  vests = vests.subtract(withdraw_vests);
  if (subtract_delegated) {
    vests = vests.subtract(vests_delegated);
  }
  if (add_received) {
    vests = vests.add(vests_received);
  }
  return vests.amount;
}

// src/helpers/rc.ts
var vestsUnits = (value) => {
  const text = typeof value === "string" ? value.split(" ")[0] : Asset.from(value).amount.toFixed(6);
  const negative = text.startsWith("-");
  const [whole, fraction = ""] = text.replace("-", "").split(".");
  const units = BigInt(whole || "0") * 1000000n + BigInt((fraction + "000000").slice(0, 6));
  return negative ? -units : units;
};
var shareUnits = (value) => BigInt(String(value === void 0 || value === null ? 0 : value).split(".")[0]);
var effectiveVestsUnits = (account) => {
  const rate = vestsUnits(account.vesting_withdraw_rate);
  const remaining = shareUnits(account.to_withdraw) - shareUnits(account.withdrawn);
  const nextWithdrawal = rate < remaining ? rate : remaining;
  const effective = vestsUnits(account.vesting_shares) - vestsUnits(account.delegated_vesting_shares) + vestsUnits(account.received_vesting_shares) - (nextWithdrawal > 0n ? nextWithdrawal : 0n);
  return effective > 0n ? effective : 0n;
};
var RCAPI = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Convenience for calling `rc_api`.
   */
  call(method, params) {
    return this.client.call("rc_api", method, params);
  }
  /**
   * Returns RC data for array of usernames
   */
  async findRCAccounts(usernames) {
    return (await this.call("find_rc_accounts", { accounts: usernames })).rc_accounts;
  }
  /**
   * Returns the global resource params
   */
  async getResourceParams() {
    return (await this.call("get_resource_params", {})).resource_params;
  }
  /**
   * Returns the global resource pool
   */
  async getResourcePool() {
    return (await this.call("get_resource_pool", {})).resource_pool;
  }
  /**
   * Makes a API call and returns the RC mana-data for a specified username
   */
  async getRCMana(username) {
    const rc_account = (await this.findRCAccounts([username]))[0];
    return this.calculateRCMana(rc_account);
  }
  /**
   * Makes API calls and returns the voting mana-data for a specified username, refilled with
   * the refill time the chain has now.
   */
  async getVPMana(username) {
    const [account, props] = await this.accountAndProps(username);
    return this.calculateVPMana(account, props);
  }
  /**
   * Makes API calls and returns the downvote mana-data for a specified username.
   */
  async getDownvoteMana(username) {
    const [account, props] = await this.accountAndProps(username);
    return this.calculateDownvoteMana(account, props);
  }
  /**
   * Makes API calls and returns what a vote of `weight` would cost `username` now.
   */
  async getVoteCost(username, weight) {
    const [account, props] = await this.accountAndProps(username);
    return this.calculateVoteCost(account, weight, props);
  }
  /**
   * Calculates the RC mana-data based on an RCAccount - findRCAccounts()
   */
  calculateRCMana(rc_account) {
    return this._calculateManabar(
      Number(rc_account.max_rc),
      rc_account.rc_manabar
    );
  }
  /**
   * Calculates the voting mana-data based on an Account - getAccounts()
   * @param props The dynamic global properties (`getDynamicGlobalProperties()`), whose
   *              `voting_mana_regeneration_seconds` is the refill time of the bar: 576,000 s
   *              (15% a day) from hardfork 32. Without them, the 432,000 s (20% a day) of
   *              earlier hardforks is used.
   */
  calculateVPMana(account, props) {
    const max_mana = getVests(account) * Math.pow(10, 6);
    return this._calculateManabar(max_mana, account.voting_manabar, getVotingManaRegenerationSeconds(props));
  }
  /**
   * Calculates the downvote mana-data based on an Account - getAccounts(). The downvote bar holds
   * `downvote_pool_percent` of the voting bar and refills in the same time.
   */
  calculateDownvoteMana(account, props) {
    const percent = Number(props.downvote_pool_percent || 0);
    const max_mana = getVests(account) * Math.pow(10, 6) * percent / 1e4;
    if (!account.downvote_manabar || percent <= 0) {
      return { current_mana: 0, max_mana: 0, percentage: 0 };
    }
    return this._calculateManabar(max_mana, account.downvote_manabar, getVotingManaRegenerationSeconds(props));
  }
  /**
   * What a vote of `weight` (-10000 to 10000) costs the voter, exactly as the node computes it
   * since hardfork 28: `ceil(floor(effective vests * |weight| * 86400 / 10000) /
   * (vote_power_reserve_rate * voting_mana_regeneration_seconds))`. From hardfork 32 a 100% vote
   * costs 3% of a full bar (2% before). A downvote is paid from the downvote bar first.
   */
  calculateVoteCost(account, weight, props) {
    if (!Number.isInteger(weight) || weight < -1e4 || weight > 1e4) {
      throw new Error(`A vote weight is an integer from -10000 to 10000, got ${weight}`);
    }
    const rate = Number(props.vote_power_reserve_rate);
    if (!Number.isInteger(rate) || rate <= 0) {
      throw new Error("calculateVoteCost needs vote_power_reserve_rate from getDynamicGlobalProperties()");
    }
    const effective = effectiveVestsUnits(account);
    const denominator = BigInt(rate) * BigInt(getVotingManaRegenerationSeconds(props));
    const used = effective * BigInt(Math.abs(weight)) * 86400n / 10000n;
    const mana = used === 0n ? 0n : (used + denominator - 1n) / denominator;
    const fullVote = effective * 10000n * 86400n / 10000n;
    const fullVoteMana = fullVote === 0n ? 0n : (fullVote + denominator - 1n) / denominator;
    const percent = (value) => effective === 0n ? 0 : Number(value * 10000n / effective) / 100;
    return {
      full_vote_percentage: percent(fullVoteMana),
      mana: Number(mana),
      percentage: percent(mana)
    };
  }
  /**
   * Internal convenience method to reduce redundant code
   */
  _calculateManabar(max_mana, { current_mana, last_update_time }, regenerationSeconds = 432e3) {
    const delta = Date.now() / 1e3 - last_update_time;
    current_mana = Number(current_mana) + delta * max_mana / regenerationSeconds;
    let percentage = Math.round(current_mana / max_mana * 1e4);
    if (!isFinite(percentage) || percentage < 0) {
      percentage = 0;
    } else if (percentage > 1e4) {
      percentage = 1e4;
    }
    return { current_mana, max_mana, percentage };
  }
  async accountAndProps(username) {
    const [accounts, props] = await Promise.all([
      this.client.call("condenser_api", "get_accounts", [[username]]),
      this.client.database.getDynamicGlobalProperties()
    ]);
    if (!accounts[0]) {
      throw new Error(`Account ${username} not found`);
    }
    return [accounts[0], props];
  }
};

// src/helpers/key.ts
var AccountByKeyAPI = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Convenience for calling `account_by_key_api`.
   */
  call(method, params) {
    return this.client.call("account_by_key_api", method, params);
  }
  /**
   * Returns all accounts that have the key associated with their owner or active authorities.
   */
  async getKeyReferences(keys) {
    return this.call("get_key_references", { keys: keys.map((key) => key.toString()) });
  }
};

// src/helpers/nft.ts
var toAsset = (value) => Asset.from(value);
var toNft = (raw) => ({ ...raw, reserve_price: toAsset(raw.reserve_price) });
var toEdition = (raw) => ({ ...raw, price: toAsset(raw.price) });
var resolve = (ref) => {
  if ("nft" in ref) {
    return parseNftId(ref.nft);
  }
  return { author: ref.author, permlink: ref.permlink, edition: ref.edition };
};
var NftAPI = class {
  constructor(client) {
    this.client = client;
  }
  /** Convenience for calling `database_api`. */
  call(method, params = {}) {
    return this.client.call("database_api", method, params);
  }
  // ---------------------------------------------------------------- reads
  /** The limits and mint fee nft_operation is checked against at head block. */
  async getParams() {
    const raw = await this.call("get_nft_params", {});
    return {
      max_editions: raw.max_editions,
      max_license_length: raw.max_license_length,
      max_royalty: raw.max_royalty,
      mint_fee_per_edition: toAsset(raw.mint_fee_per_edition),
      price_symbols: (raw.price_symbols || []).map((symbol) => typeof symbol === "string" ? symbol : symbolOfNai(symbol && symbol.nai) || String(symbol && symbol.nai))
    };
  }
  /**
   * Up to 100 NFTs or copies by id: `@author/permlink/0` for an NFT (with its reserve),
   * `@author/permlink/N` for the NFT with its copy N. Ids that name nothing are left out, so the
   * call also tells which posts are minted. Each NFT and each copy is answered once, in the order
   * first asked; a copy that was never offered nor moved is answered as its creator's.
   */
  async find(ids) {
    if (ids.length > NFT_FIND_LIMIT) {
      throw new Error(`At most ${NFT_FIND_LIMIT} NFT ids per call`);
    }
    const raw = await this.call("find_nfts", { nfts: ids });
    return { editions: (raw.editions || []).map(toEdition), nfts: (raw.nfts || []).map(toNft) };
  }
  /** The NFT of a post, or undefined when the post is not minted. */
  async getNft(author, permlink) {
    const { nfts } = await this.find([formatNftId(author, permlink, 0)]);
    return nfts[0];
  }
  /** One copy (`@author/permlink/N`, N >= 1), or undefined when there is no such copy. */
  async getEdition(id) {
    const { edition } = parseNftId(id);
    if (edition === NFT_RESERVE) {
      throw new Error(`${id} names an NFT; a copy is @author/permlink/N with N from 1`);
    }
    const { editions } = await this.find([id]);
    return editions[0];
  }
  /** Whether each post is minted, in the order given (100 posts per request). */
  async areMinted(posts) {
    const ids = posts.map((post) => Array.isArray(post) ? formatNftId(post[0], post[1]) : formatNftId(post.author, post.permlink));
    const minted = /* @__PURE__ */ new Set();
    for (let i = 0; i < ids.length; i += NFT_FIND_LIMIT) {
      const { nfts } = await this.find(ids.slice(i, i + NFT_FIND_LIMIT));
      for (const nft of nfts) {
        minted.add(nft.nft_id);
      }
    }
    return ids.map((id) => minted.has(id));
  }
  /**
   * NFTs a creator minted, in permlink order.
   * @param options `after`: the permlink to continue after (the last of the previous page);
   *                `limit`: 1 to 1000, default 100.
   */
  async listByCreator(creator, options = {}) {
    const limit = options.limit || 100;
    const after = options.after;
    const raw = await this.call("list_nfts", {
      limit: after === void 0 ? limit : Math.min(limit + 1, 1e3),
      order: "by_creator",
      start: [creator, after === void 0 ? "" : after]
    });
    return (raw.nfts || []).filter((nft) => nft.author === creator && nft.permlink !== after).slice(0, limit).map(toNft);
  }
  /**
   * The copies of one NFT in number order, each copy once whether or not it ever moved.
   * @param nft The NFT, `@author/permlink/0` (or any copy id).
   * @param options `from`: first copy, default 1; `limit`: 1 to 1000, default 100.
   */
  async listEditions(nft, options = {}) {
    const { author, permlink } = parseNftId(nft);
    const raw = await this.call("list_nft_editions", {
      limit: options.limit || 100,
      order: "by_permlink",
      start: formatNftId(author, permlink, Math.max(options.from || 1, 1))
    });
    return (raw.editions || []).map(toEdition);
  }
  /**
   * Copies an account owns that were offered or moved at least once. A creator's reserve is not
   * listed: it is `reserve` on each NFT ({@link listByCreator}); Pixamind's
   * {@link PixamindAPI.listOwnedNfts} counts both.
   * @param options `after`: the copy id to continue after (the last of the previous page);
   *                `limit`: 1 to 1000, default 100.
   */
  async listByOwner(owner, options = {}) {
    const limit = options.limit || 100;
    const after = options.after;
    const raw = await this.call("list_nft_editions", {
      limit: after === void 0 ? limit : Math.min(limit + 1, 1e3),
      order: "by_account",
      start: [owner, after === void 0 ? "" : after]
    });
    return (raw.editions || []).filter((copy2) => copy2.owner === owner && copy2.nft_id !== after).slice(0, limit).map(toEdition);
  }
  // -------------------------------------------------------------- actions
  /**
   * Mint a root post of `account` in 1 to 10,000 copies. `fee` defaults to the copies times the
   * fee per copy in force (1.000 PXS); it is burned. Royalty and license can never change, and the
   * post can no longer be edited or deleted. Throws before signing when {@link checkNftMint} finds
   * a problem.
   */
  async mint(data, key) {
    const { account, ...action } = data;
    let fee = action.fee;
    if (fee === void 0) {
      fee = nftMintFee(Number(action.editions), (await this.getParams()).mint_fee_per_edition);
    }
    const mint = { ...action, fee };
    const problems = checkNftMint(mint);
    if (problems.length > 0) {
      throw new Error(`nft_mint: ${problems.join("; ")}`);
    }
    return this.send(account, [0, mint], key);
  }
  /**
   * Offer a copy at a fixed price in PXS, or change its offer. The copy stays with its owner until
   * someone buys it. `expiration` left out: the offer never expires; otherwise at most
   * 2038-01-19T03:14:07, the latest time the node reads.
   */
  async list(data, key) {
    const { author, permlink, edition } = resolve(data);
    const action = { author, edition, permlink, price: data.price };
    if (data.expiration !== void 0) {
      action.expiration = data.expiration;
    }
    return this.send(data.account, [1, action], key);
  }
  /** Withdraw the offer of a copy. A copy that never left its author goes back to the reserve. */
  async unlist(data, key) {
    const { author, permlink, edition } = resolve(data);
    return this.send(data.account, [2, { author, edition, permlink }], key);
  }
  /**
   * Buy a copy (or, with edition 0, the next copy of the reserve). The price has to equal the
   * asking price; left out, it is read from the chain first, and the purchase fails if the offer
   * changes before the transaction is included.
   */
  async buy(data, key) {
    const { author, permlink, edition } = resolve(data);
    const price = data.price !== void 0 ? data.price : await this.askingPrice(author, permlink, edition);
    return this.send(data.account, [3, { author, edition, permlink, price }], key);
  }
  /** Give a copy to another account: no payment, so no royalty. Ends any offer of the copy. */
  async transfer(data, key) {
    const { author, permlink, edition } = resolve(data);
    return this.send(data.account, [4, { author, edition, permlink, to: data.to }], key);
  }
  /** Burn a copy: give it to `null`, for good. It keeps its number and still counts among the copies. */
  async burn(data, key) {
    return this.transfer({ ...data, to: NFT_BURN_ACCOUNT }, key);
  }
  /**
   * Offer the reserve: every copy that never left the author and has no offer of its own, at one
   * price, in one action. Each buyer gets the lowest-numbered copy still in the reserve and the
   * author receives the whole price. The offer ends by itself when the reserve runs out.
   */
  async offerReserve(data, key) {
    return this.list({ ...data, author: data.account, edition: NFT_RESERVE }, key);
  }
  /** Withdraw the reserve offer. */
  async withdrawReserve(data, key) {
    return this.unlist({ ...data, author: data.account, edition: NFT_RESERVE }, key);
  }
  /** Buy the next copy of an author's reserve; `price` left out is read from the chain. */
  async buyFromReserve(data, key) {
    return this.buy({ ...data, edition: NFT_RESERVE }, key);
  }
  /** The price a copy (or the reserve, edition 0) can be bought at now; throws when it is not for sale. */
  async askingPrice(author, permlink, edition) {
    const id = formatNftId(author, permlink, edition);
    const { nfts, editions } = await this.find([id]);
    if (nfts.length === 0) {
      throw new Error(`${formatNftId(author, permlink)} is not minted`);
    }
    if (edition === NFT_RESERVE) {
      if (!nfts[0].reserve_listed) {
        throw new Error(`The reserve of ${id} is not offered`);
      }
      return nfts[0].reserve_price;
    }
    if (editions.length === 0) {
      throw new Error(`${id} does not exist`);
    }
    if (!editions[0].listed) {
      throw new Error(`${id} is not offered`);
    }
    return editions[0].price;
  }
  send(account, action, key) {
    return this.client.broadcast.nft({ account, action, extensions: [] }, key);
  }
};

// src/helpers/pixamind.ts
var PixamindAPI = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Convenience of calling pixamind api
   * @param method
   * @param params
   */
  call(method, params) {
    return this.client.call("bridge", method, params);
  }
  /**
   * Get trending, hot, recent community posts from Pixamind
   * @param options
   */
  getRankedPosts(options) {
    return this.call("get_ranked_posts", options);
  }
  /**
   * Get posts by particular account from Pixamind
   * @param options
   */
  getAccountPosts(options) {
    return this.call("get_account_posts", options);
  }
  /**
   * Get community details such as who are the admin,
   * moderators, how many subscribers, etc..
   * @param options
   */
  getCommunity(options) {
    return this.call("get_community", options);
  }
  /**
   * List all subscriptions by particular account
   * @param account the account you want to query
   * @returns {Array} return role, what community the account joined
   */
  listAllSubscriptions(account) {
    return this.call("list_all_subscriptions", account);
  }
  /**
   * Get particular account notifications feed
   * @param options
   */
  getAccountNotifications(options) {
    return this.call("account_notifications", options);
  }
  /**
   * List all available communities on pixamind
   * @param options
   */
  listCommunities(options) {
    return this.call("list_communities", options);
  }
  /**
   * Call a method of another Pixamind namespace: `pixamind_api`, `pixamind_content`,
   * `pixamind_feed`, `pixamind_graph` or `pixamind_nft`.
   */
  callNamespace(namespace, method, params = {}) {
    return this.client.call(namespace, method, params);
  }
  /**
   * What the Pixamind node is: version, indexed block, enabled features (`nfts`, `promotions`,
   * `post_history`, …) and namespaces.
   */
  getInfo() {
    return this.callNamespace("pixamind_api", "get_info", {});
  }
  /**
   * One post with its bridge fields, `nft_minted` and `promoted` included.
   */
  getPost(author, permlink, observer) {
    return this.call("get_post", observer ? { author, permlink, observer } : { author, permlink });
  }
  // ------------------------------------------------------------- promotion
  /**
   * The promoted feed: root posts awaiting payout that PXS was burned for, highest total first
   * (newest first on a tie), each with `promoted`. `tag` can be a tag, a community or `my` with
   * an observer. To promote a post: {@link BroadcastAPI.promote}.
   */
  getPromotedPosts(query = {}) {
    return this.call("get_ranked_posts", { ...query, sort: "promoted" });
  }
  /**
   * The payments behind a post, newest first, with its total.
   * @param limit 1 to 1000, default 100.
   */
  getPromotions(author, permlink, limit) {
    const params = limit === void 0 ? { author, permlink } : { author, limit, permlink };
    return this.callNamespace("pixamind_feed", "get_promotions", params);
  }
  /**
   * What an account burned to promote posts, newest first, with its total.
   * @param limit 1 to 1000, default 100.
   */
  getPromotionsBySender(sender, limit) {
    const params = limit === void 0 ? { sender } : { limit, sender };
    return this.callNamespace("pixamind_feed", "get_promotions", params);
  }
  // --------------------------------------------------------------- content
  /**
   * Metadata of a post: format, tags, license, picture size, and when they apply `promoted`,
   * `versions` (recorded edits) and `nft` (terms and market summary of a minted post).
   * Throws when the post does not exist.
   */
  getContentMetadata(author, permlink) {
    return this.callNamespace("pixamind_content", "get_content_metadata", { author, permlink });
  }
  /**
   * Metadata of up to 100 posts in one call, in the order asked; `null` for a post that does not exist.
   */
  getContentMetadataBatch(posts) {
    if (posts.length > 100) {
      return Promise.reject(new Error("At most 100 posts per call"));
    }
    return this.callNamespace("pixamind_content", "get_content_metadata", { posts });
  }
  /**
   * Every recorded version of a post or comment, oldest first: the creation, then each edit, with
   * the fields it changed. `bodies: false` leaves the bodies out.
   * @param options `start` (version number, from 1), `limit` (1 to 100, default 20), `bodies` (default true)
   */
  getPostHistory(author, permlink, options = {}) {
    return this.callNamespace("pixamind_content", "get_post_history", { author, permlink, ...options });
  }
  // ------------------------------------------------------------------ NFTs
  /**
   * NFTs and copies by id, at most 100: for `@author/permlink/0` the NFT with its terms and
   * market summary (copies, for_sale, floor, reserve, reserve_offer, …), for `@author/permlink/N`
   * copy N with the terms of its NFT under `nft`. Ids that name nothing are left out, so an empty
   * answer means "not minted".
   */
  async getNfts(ids) {
    const list = Array.isArray(ids) ? ids : [ids];
    if (list.length > NFT_FIND_LIMIT) {
      throw new Error(`At most ${NFT_FIND_LIMIT} NFT ids per call`);
    }
    return (await this.callNamespace("pixamind_nft", "get_nfts", { nfts: list })).nfts;
  }
  /**
   * One NFT with its terms and market summary; undefined when the post is not minted.
   */
  async getNft(author, permlink) {
    const [nft] = await this.getNfts(formatNftId(author, permlink, 0));
    return nft;
  }
  /**
   * The copies of one NFT, page by page: by number (every copy, reserve included) or by price
   * (what can be bought now, cheapest first, the offered reserve as copy 0).
   */
  listNftEditions(query) {
    return this.callNamespace("pixamind_nft", "list_editions", query);
  }
  /**
   * NFTs an account minted, newest first, each with its summary, and their `total`.
   */
  listCreatedNfts(account, options = {}) {
    return this.callNamespace("pixamind_nft", "list_created", { account, ...options });
  }
  /**
   * NFTs an account holds copies of, latest acquisition first: the terms, how many it holds and
   * how many of those are for sale. A creator holds the copies it never parted with;
   * `acquired_only` leaves those out.
   */
  listOwnedNfts(account, options = {}) {
    return this.callNamespace("pixamind_nft", "list_owned", { account, ...options });
  }
  /**
   * What can be bought now across all NFTs, each with the terms of its NFT: copies offered on their
   * own, and offered reserves as one entry each (copy 0, `reserve: true`, `copies`, `next`).
   */
  listNftMarket(query = {}) {
    return this.callNamespace("pixamind_nft", "list_market", query);
  }
  /**
   * History of an NFT (`…/0`: every copy), of one copy (`…/N`: that copy and the mint), or of an
   * account, newest first: mints, offers, sales, gifts and burns. `limit` up to 1,000.
   */
  getNftHistory(query) {
    return this.callNamespace("pixamind_nft", "get_history", query);
  }
  /**
   * The full license text of an NFT (any copy id names it), with its size and SHA-256; undefined
   * when the post is not minted. Compare `license_sha256` with the chain's
   * ({@link NftAPI.getNft}) to check the text is the one minted.
   */
  async getNftLicense(id) {
    const result = await this.callNamespace("pixamind_nft", "get_license", { nft: id });
    return result && result.license !== void 0 ? result : void 0;
  }
};

// src/helpers/transaction.ts
var TransactionStatusAPI = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Convenience for calling `transaction_status_api`.
   */
  call(method, params) {
    return this.client.call("transaction_status_api", method, params);
  }
  /**
   * Returns the status of a given transaction id, with the number of its block once it is in one.
   * Pass the transaction's `expiration` to tell an expired transaction from an unknown one.
   */
  async findTransaction(transaction_id, expiration) {
    const params = {
      transaction_id
    };
    if (expiration) {
      params.expiration = expiration;
    }
    return this.call("find_transaction", params);
  }
};

// src/errors.ts
var VError = class extends Error {
  constructor(options, message) {
    super(options.cause ? `${message}: ${options.cause.message}` : message);
    if (options.name) {
      this.name = options.name;
    }
    this.jse_shortmsg = message;
    if (options.cause) {
      this.jse_cause = options.cause;
    }
    this.jse_info = {};
    if (options.info) {
      for (const key in options.info) {
        this.jse_info[key] = options.info[key];
      }
    }
  }
  /**
   * Return the underlying error, if any (same as verror's `cause()`).
   */
  cause() {
    return this.jse_cause;
  }
};
VError.prototype.name = "VError";

// src/version.ts
var version_default = "1.7.0";

// src/parameters.ts
var MAINNET_HEX_CHAIN_ID = "706978616772616d000000000000000000000000000000000000000000000000";
var TESTNET_HEX_CHAIN_ID = "18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e";
var PREFIX_MAINNET_ADDRESS = "PIX";
var PREFIX_TESTNET_ADDRESS = "TST";
var MAIN_MAINNET_NODE_URL = "https://api.pixagram.com";
var MAIN_TESTNET_NODE_URL = "https://api.pixagram.com";

// src/client.ts
var VERSION = version_default;
var DEFAULT_CHAIN_ID = BBuffer.from(
  MAINNET_HEX_CHAIN_ID,
  "hex"
);
var DEFAULT_ADDRESS_PREFIX = PREFIX_MAINNET_ADDRESS;
var Client = class _Client {
  /**
   * @param address The address to the Pixa RPC server,
   * e.g. `https://api.pixagram.com`. or [`https://api.pixagram.com`, `https://another.api.com`]
   * @param options Client options.
   */
  constructor(address, options = {}) {
    if (options.rebrandedApi) {
      console.log("Warning: rebrandedApi is deprecated and safely can be removed from client options");
    }
    this.currentAddress = (Array.isArray(address) ? address[0] : address) || MAIN_MAINNET_NODE_URL;
    this.address = address || [MAIN_MAINNET_NODE_URL];
    this.options = options;
    this.chainId = options.chainId ? BBuffer.from(options.chainId, "hex") : DEFAULT_CHAIN_ID;
    assert_default.equal(this.chainId.length, 32, "invalid chain id");
    this.addressPrefix = options.addressPrefix || DEFAULT_ADDRESS_PREFIX;
    this.timeout = options.timeout || 60 * 1e3;
    this.backoff = options.backoff || defaultBackoff;
    this.failoverThreshold = options.failoverThreshold || 3;
    this.consoleOnFailover = options.consoleOnFailover || false;
    this.database = new DatabaseAPI(this);
    this.broadcast = new BroadcastAPI(this);
    this.blockchain = new Blockchain(this);
    this.rc = new RCAPI(this);
    this.pixamind = new PixamindAPI(this);
    this.nft = new NftAPI(this);
    this.keys = new AccountByKeyAPI(this);
    this.transaction = new TransactionStatusAPI(this);
  }
  /**
   * Create a new client instance configured for the testnet.
   */
  static testnet(options) {
    let opts = {};
    if (options) {
      opts = copy(options);
      opts.agent = options.agent;
    }
    opts.addressPrefix = PREFIX_TESTNET_ADDRESS;
    opts.chainId = TESTNET_HEX_CHAIN_ID;
    return new _Client(MAIN_TESTNET_NODE_URL, opts);
  }
  /**
   * Make a RPC call to the server.
   *
   * @param api     The API to call, e.g. `database_api`.
   * @param method  The API method, e.g. `get_dynamic_global_properties`.
   * @param params  Array of parameters to pass to the method, optional.
   *
   */
  async call(api, method, params = []) {
    const request = {
      id: 0,
      jsonrpc: "2.0",
      method: api + "." + method,
      params
    };
    const body = JSON.stringify(request, (key, value) => {
      if (value && typeof value === "object" && value.type === "Buffer") {
        return BBuffer.from(value.data).toString("hex");
      }
      return value;
    });
    const opts = {
      body,
      cache: "no-cache",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      method: "POST",
      mode: "cors"
    };
    if (typeof self === void 0) {
      opts.headers = {
        "User-Agent": `dpixa/${version_default}`
      };
    }
    if (this.options.agent) {
      opts.agent = this.options.agent;
    }
    let fetchTimeout;
    if (api !== "network_broadcast_api" && !method.startsWith("broadcast_transaction")) {
      fetchTimeout = (tries) => (tries + 1) * 500;
    }
    const { response, currentAddress } = await retryingFetch(
      this.currentAddress,
      this.address,
      opts,
      this.timeout,
      this.failoverThreshold,
      this.consoleOnFailover,
      this.backoff,
      fetchTimeout
    );
    if (currentAddress !== this.currentAddress) {
      this.currentAddress = currentAddress;
    }
    if (response.error) {
      const formatValue = (value) => {
        switch (typeof value) {
          case "object":
            return JSON.stringify(value);
          default:
            return String(value);
        }
      };
      const { data } = response.error;
      let { message } = response.error;
      if (data && data.stack && data.stack.length > 0) {
        const top = data.stack[0];
        const topData = copy(top.data);
        message = top.format.replace(
          /\$\{([a-z_]+)\}/gi,
          (match, key) => {
            let rv = match;
            if (topData[key]) {
              rv = formatValue(topData[key]);
              delete topData[key];
            }
            return rv;
          }
        );
        const unformattedData = Object.keys(topData).map((key) => ({ key, value: formatValue(topData[key]) })).map((item) => `${item.key}=${item.value}`);
        if (unformattedData.length > 0) {
          message += " " + unformattedData.join(" ");
        }
      }
      throw new VError({ info: data, name: "RPCError" }, message);
    }
    assert_default.equal(response.id, request.id, "got invalid response id");
    return response.result;
  }
  updateOperations(_rebrandedApi) {
    console.log("Warning: call to updateOperations() is deprecated and can safely be removed");
  }
};
var defaultBackoff = (tries) => Math.min(Math.pow(tries * 10, 2), 10 * 1e3);

export {
  registerCrypto,
  copy,
  utils_exports,
  BlockchainMode,
  Blockchain,
  assert_default,
  binaryToBytes,
  bytesToBinary,
  utf8ToBytes,
  bytesToUtf8,
  encodeString,
  decodeBytes,
  BBuffer,
  Authority,
  symbolOfNai,
  Asset,
  Price,
  NFT_MAX_EDITIONS,
  NFT_MAX_ROYALTY,
  NFT_MAX_LICENSE_BYTES,
  NFT_MINT_FEE_PER_EDITION,
  NFT_RESERVE,
  NFT_NEVER_EXPIRES,
  NFT_LATEST_EXPIRATION,
  NFT_BURN_ACCOUNT,
  NFT_FIND_LIMIT,
  NFT_ACTION_TAGS,
  parseNftId,
  isNftId,
  formatNftId,
  utf8ByteLength,
  nftMintFee,
  nftRoyalty,
  nftSaleSplit,
  checkNftMint,
  toNftAction,
  nftActionName,
  normalizeOperation,
  normalizeTransaction,
  BroadcastAPI,
  DatabaseAPI,
  HexBuffer,
  VOTING_MANA_REGENERATION_SECONDS_PRE_HF32,
  getVotingManaRegenerationSeconds,
  getVestingSharePrice,
  getVests,
  RCAPI,
  AccountByKeyAPI,
  NftAPI,
  PixamindAPI,
  TransactionStatusAPI,
  VError,
  VERSION,
  DEFAULT_CHAIN_ID,
  DEFAULT_ADDRESS_PREFIX,
  Client
};
//# sourceMappingURL=chunk-267YZ5ST.mjs.map
