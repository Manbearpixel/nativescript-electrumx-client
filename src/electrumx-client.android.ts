import { TcpClient } from './libs.android/tcp-client';
import { makeRequest, createPromiseResult } from './libs.android/util';

export class ElectrumxClient extends TcpClient {
  constructor(host: string, port: number, options?: any) {
    super(host, port, options);
  }

  private async _request(method: string, params: any[]): Promise<any> {
    if (!this.status) return Promise.reject(new Error('ESOCKET'));

    return new Promise(async (resolve, reject) => {
      const id = ++this.atomicInteger;
      const content = makeRequest(method, params, id);

      this.callbackQueue[id] = createPromiseResult(resolve, reject);
      await this.send(content + '\n');
    });
  }

  public async close(): Promise<any> {
    await super.close();

    const list = [
      'blockchain.headers.subscribe',
      'blockchain.address.subscribe'
    ];

    list.forEach(eventName => this.subscribe.removeAllListeners(eventName));
    return Promise.resolve(true);
  }

  // ---------------------------------
  // protocol 1.8.x available methods
  // ---------------------------------

  /**
   * Identify the client to the server and negotiate the protocol version.
   * @param client_name A string identifying the connecting client software.
   * @param protocol_version An array `[protocol_min, protocol_max]`, each of which is a string.
   * @returns An array of 2 strings: `[server_software_version, protocol_version]`
   * identifying the server and the protocol version that will be used for future communication.
   * 
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#server-version Source}
   */
  public server_version(client_name: string, protocol_version: string): Promise<string[]> {
    return this._request('server.version', [client_name, protocol_version]);
  }

  /**
   * Return a banner to be shown in the Electrum console.
   * @returns A string
   * 
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#server-banner Source}
   */
  public server_banner(): Promise<string> {
    return this._request('server.banner', []);
  }

  /**
   * Ping the server to ensure it is responding, and to keep the session alive.
   * The server may disconnect clients that have sent no requests for roughly **10 minutes**.
   * @returns null
   * 
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#server-ping Source}
   */
  public server_ping(): Promise<null> {
    return this._request('server.ping', []);
  }

  /**
   * A newly-started server uses this call to get itself into other servers’ peers lists.
   * It sould not be used by wallet clients.
   * @param features Array of features...?
   * @returns A boolean indicating whether the request was tentatively accepted.
   * The requesting server will appear in `server.peers.subscribe()` when further
   * sanity checks complete successfully.
   * 
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#server-add-peer Source}
   */
  public server_addPeer(features): Promise<boolean> {
    return this._request('server.add_peer', [features]);
  }

  /**
   * Return a server donation address.
   * @returns A string.
   * 
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#server-donation-address Source}
   */
  public serverDonation_address(): Promise<string> {
    return this._request('server.donation_address', []);
  }

  /**
   * Return a list of peer servers. Despite the name **this is not a subscription**
   * and the server *must send no notifications*.
   * @returns An array of peer servers, each returned as a 3-element array.
   * 
   * For example: `["107.150.45.210", "e.anonyhost.org", ["v1.0", "p10000", "t", "s995"]]`
   * 
   * **Where**
   * ```
   * "107.150.45.210" is the IP address
   * "e.anonyhost.org" is the host name
   * ["v1.0", "p10000", "t", "s995"] is a list of server features
   * ```
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#server-peers-subscribe Source}
   */
  public serverPeers_subscribe(): Promise<object[]> {
    return this._request('server.peers.subscribe', []);
  }

  /**
   * Return the confirmed and unconfirmed balances of a script hash.
   * @param scripthash The script hash as a hexadecimal string.
   * @returns A dictionary with keys `confirmed` and `unconfirmed`.
   * The value of each is the appropriate balance in coin units as a *string*.
   * 
   * **Example**
   * ```
   * {
   *   "confirmed": "1.03873966",
   *   "unconfirmed": "0.236844"
   * }
   * ```
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-scripthash-get-balance Source}
   */
  public blockchainScripthash_getBalance(scripthash: string): Promise<object> {
    return this._request('blockchain.scripthash.get_balance', [scripthash]);
  }

  /**
   * Return the confirmed and unconfirmed history of a script hash.
   * @param scripthash The script hash as a hexadecimal string.
   * @returns A list of confirmed transactions in blockchain order, with the
   * output of `blockchain.scripthash.get_mempool()` appended to the list. 
   * Each confirmed transaction is a dictionary with the following keys:
   * 
   * ```
   * [{
   *   "height": block the transaction was confirmed in
   *   "tx_hash": transaction hash in hexadecimal
   *  },
   * ```
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-scripthash-get-history Source}
   */
  public blockchainScripthash_getHistory(scripthash: string): Promise<object[]> {
    return this._request('blockchain.scripthash.get_history', [scripthash]);
  }

  /**
   * Return part of the confirmed history of a script hash.
   * @param scripthash The script hash as a hexadecimal string.
   * @param start_height History will be returned starting from this height.
   * @returns A dictionary with the following keys.
   * 
   * ```
   * more - true indicates that there may be more history available.
   * history - A list ot transactions.
   * ```
   * History list has two elements: `block_height`, and `tx_hash`.
   * 
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-scripthash-history Source}
   */
  public blockchainScripthash_history(scripthash: string, start_height: number): Promise<object[]> {
    return this._request('blockchain.scripthash.history', [scripthash, start_height]);
  }

  /**
   * Return some confirmed UTXOs sent to a script hash.
   * @param scripthash The script hash as a hexadecimal string.
   * @param start_height UTXOs will be returned starting from this height,
   * @returns A dictionary with the following keys.
   * 
   * ```
   * more - true indicates that there may be more history available.
   * utxos - A list of UTXOs.
   * ```
   * UTXOs list has four elements: `block_height`, `tx_hash`, `vout_pos`, `value (minimum coin units)` 
   * 
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-scripthash-utxos Source}
   */
  public blockchainScripthash_utxos(scripthash: string, start_height: number): Promise<object[]> {
    return this._request('blockchain.scripthash.utxos', [scripthash, start_height]);
  }

  /**
   * Return the unconfirmed transactions of a script hash.
   * @param scripthash The script hash as a hexadecimal string.
   * @returns A list of mempool transactions in arbitrary order.
   * Each mempool transaction is a dictionary with the following keys:
   * 
   * ```
   * [{
   *    "tx_hash": transaction hash in hexadecimal.
   *    "height": `0` if all inputs are confirmed, and `-1` otherwise.
   *    "fee": transaction fee in minimum coin units (satoshi)
   *  },
   * ```
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-scripthash-get-mempool Source}
   */
  public blockchainScripthash_getMempool(scripthash: string): Promise<object[]> {
    return this._request('blockchain.scripthash.get_mempool', [scripthash]);
  }

  /**
   * Return an ordered list of UTXOs sent to a script hash.
   * @param scripthash The script hash as a hexadecimal string.
   * @returns A list of unspent outputs in blockchain order. 
   * This function takes the mempool into account. Mempool transactions
   * paying to the address are included at the end of the list in an undefined order.
   * Any output that is spent in the mempool does not appear.
   * Each output is a dictionary with the following keys:
   * 
   * ```
   * [{
   *   "tx_pos": zero-based index of the output
   *   "value": value in minimum coin units (satoshis)
   *   "tx_hash": transaction hash as a hexadecimal string.
   *   "height": block the transaction was confirmed in. 0 if the transaction is in the mempool.
   * },
   * ```
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-scripthash-listunspent Source}
   */
  public blockchainScripthash_listunspent(scripthash: string): Promise<object[]> {
    return this._request('blockchain.scripthash.listunspent', [scripthash]);
  }

  /**
   * Subscribe to a script hash.
   * @param scripthash The script hash as a hexadecimal string.
   * @returns Transaction hash of the last confirmed transaction in
   * blockchain order, or null if there are none.
   * 
   * **SUBSCRIBED**
   * Subscription method; the client receives notifications when the
   * confirmed transaction history and/or associated mempool transactions change.
   * 
   * Returns:
   * ```
   * (scripthash, tx_hash)
   * tx_hash is the hash of the last confirmed transaction in blockchain order
   * ```
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-scripthash-subscribe Source}
   */
  public blockchainScripthash_subscribe(scripthash: string): Promise<string> {
    return this._request('blockchain.scripthash.subscribe', [scripthash]);
  }

  /**
   * Return the block header at the given height.
   * @param height The height of the block, a non-negative integer.
   * @param cp_height Checkpoint height, a non-negative integer.
   * @returns If cp_height is zero, the raw block header as a hexadecimal string.
   * Otherwise a dictionary with the following keys:
   * 
   * ```
   * branch - The merkle branch of header up to root, deepest pairing first.
   * header - The raw block header as a hexadecimal string.
   * root - The merkle root of all blockchain headers up to and including `cp_height`.
   * ```
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-block-header Source}
   */
  public blockchainBlock_header(height: number, cp_height: number): Promise<any> {
    return this._request('blockchain.block.header', [height, cp_height]);
  }

  /**
   * Return a concatenated chunk of block headers from the main chain.
   * @param start_height The height of the first header requested, a non-negative integer.
   * @param count The number of headers requested, a non-negative integer.
   * @returns A dictionary with the following members:
   * 
   * ```
   * count - number of headers returned
   * hex - binary block headers concatenated together in-order as a hexadecimal string.
   * max - maximum number of headers the server will return in a single request.
   * ```
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-block-headers Source}
   */
  public blockchainBlock_headers(start_height: number, count: number): Promise<object> {
    return this._request('blockchain.block.headers', [start_height, count]);
  }

  /**
   * Return the estimated transaction fee per kilobyte **(kB)** for
   * a transaction to be confirmed within a certain number of blocks.
   * @param numBlocks number of blocks to target for confirmation.
   * @returns The estimated transaction fee in coin units per kilobyte,
   * as a floating point number. If the daemon does not have enough information
   * to make an estimate, the integer `-1` is returned.
   * 
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-estimatefee Source}
   */
  public blockchainEstimatefee(numBlocks: number): Promise<number> {
    return this._request('blockchain.estimatefee', [numBlocks]);
  }

  /**
   * Subscribe to receive block headers when a new block is found.
   * As of **v1.4** responses and notifications pass *raw headers*.
   * @returns The raw header of the current block chain tip.
   * 
   * **Example**
   * ```
   * "height": height of block
   * "hex": raw block in hexadecimal form
   * ```
   * **SUBSCRIBED**
   * Subscription method; the client will receive a notification
   * when a new block is found.
   * 
   * Returns: See above 
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-headers-subscribe Source}
   */
  public blockchainHeaders_subscribe(): Promise<object> {
    return this._request('blockchain.headers.subscribe', [false]);
  }

  /**
   * Return the minimum fee a low-priority transaction must pay in order
   * to be accepted to the daemon’s memory pool.
   * @returns The fee in whole coin units (BTC, not satoshis for Bitcoin)
   * as a floating point number.
   * 
   * **Example**
   * ```
   * 1e-05
   * 0.0
   * ```
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-relayfee Source}
   */
  public blockchain_relayfee(): Promise<number> {
    return this._request('blockchain.relayfee', []);
  }

  /**
   * Broadcast a transaction to the network.
   * @param rawtx The raw transaction as a hexadecimal string.
   * @returns The transaction hash as a hexadecimal string.
   * 
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-transaction-broadcast Source}
   */
  public blockchainTransaction_broadcast(rawtx: string): Promise<string> {
    return this._request('blockchain.transaction.broadcast', [rawtx]);
  }

  /**
   * Return a raw transaction.
   * @param txHash The transaction hash as a hexadecimal string.
   * @param verbose Whether a verbose coin-specific response is required.
   * @param merkle Whether a merkle branch proof should be returned as well.
   * @returns An array of 2 strings: `[server_software_version, protocol_version]`
   * identifying the server and the protocol version that will be used for future communication.
   * 
   * **!Verbose && !Markle**
   * The raw transaction as a hexadecimal string.
   * 
   * **!Verobe && Markle**
   * A dictionary returned by `blockchain.transaction.get_merkle()` with an additional key: `hex`.
   * 
   * **Verbose**
   * The result is a coin-specific dictionary
   * -- whatever the coin daemon returns when asked for a verbose form of the raw transaction.
   * 
   * **Verbose && Merkle**
   * Result above plus an additional key: `merkle`
   * -- `The dictionary returned by blockchain.transaction.get_merkle().`
   * 
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-transaction-get Source}
   */
  public blockchainTransaction_get(txHash: string, verbose?: boolean, merkle?: boolean): Promise<any> {
    return this._request('blockchain.transaction.get', [
      txHash, (verbose ? verbose : false), (merkle ? merkle : false)
    ]);
  }

  /**
   * Return the merkle branch to a confirmed transaction given its hash and height.
   * @param txHash A string identifying the connecting client software.
   * @param height The height at which it was confirmed, an integer.
   * @returns A dictionary with the following keys:
   * 
   * ```
   * block_height: The height of the block the transaction was confirmed in.
   * merkle: A list of transaction hashes the current hash is paired with.
   * pos: The 0-based index of the position of the transaction in order.
   * ```
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-transaction-get-merkle Source}
   */
  public blockchainTransaction_getMerkle(txHash: string, height: number) {
    return this._request('blockchain.transaction.get_merkle', [txHash, height]);
  }

  /**
   * Return a histogram of the fee rates paid by transactions in the memory pool,
   * weighted by transaction size.
   * @returns The histogram is an array of `[fee, vsize]` pairs, where `vsize(n)`
   * is the cumulative virtual size of mempool transactions...
   * 
   * {@link https://electrumx.readthedocs.io/en/latest/protocol-methods.html#mempool-get-fee-histogram Source}
   */
  public mempool_getFeeHistogram(): Promise<any[]> {
    return this._request('mempool.get_fee_histogram', []);
  }

  // ---------------------------------
  // protocol 1.3 deprecated methods
  // ---------------------------------
  public blockchainBlock_getHeader(height) {
    return this._request('blockchain.block.get_header', [height]);
  }

  // ---------------------------------
  // protocol 1.2 deprecated methods
  // ---------------------------------
  public blockchainBlock_getChunk(index) {
    return this._request('blockchain.block.get_chunk', [index]);
  }

  public blockchainAddress_getBalance(address) {
    return this._request('blockchain.address.get_balance', [address]);
  }

  public blockchainAddress_getHistory(address) {
    return this._request('blockchain.address.get_history', [address]);
  }

  public blockchainAddress_getMempool(address) {
    return this._request('blockchain.address.get_mempool', [address]);
  }

  public blockchainAddress_listunspent(address) {
    return this._request('blockchain.address.listunspent', [address]);
  }

  public blockchainAddress_subscribe(address) {
    return this._request('blockchain.address.subscribe', [address]);
  }

  // ---------------------------------
  // protocol 1.1 deprecated methods
  // ---------------------------------
  public blockchainUtxo_getAddress(tx_hash, index) {
    return this._request('blockchain.utxo.get_address', [tx_hash, index]);
  }

  public blockchainNumblocks_subscribe() {
    return this._request('blockchain.numblocks.subscribe', []);
  }
}
