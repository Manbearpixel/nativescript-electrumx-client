import { TcpClient, ElectrumxClient as EClient } from "./index";

export default class ElectrumxClient extends EClient {

  public server_version(client_name: string, protocol_version: string): Promise<string[]> {
    throw new Error("Not implemented");
  }

  public server_banner(): Promise<string> {
    throw new Error("Not implemented");
  }

  public server_ping(): Promise<null> {
    throw new Error("Not implemented");
  }

  public server_addPeer(features): Promise<boolean> {
    throw new Error("Not implemented");
  }

  public serverDonation_address(): Promise<string> {
    throw new Error("Not implemented");
  }

  public serverPeers_subscribe(): Promise<object[]> {
    throw new Error("Not implemented");
  }
  
  public blockchainScripthash_getBalance(scripthash: string): Promise<object> {
    throw new Error("Not implemented");
  }
  
  public blockchainScripthash_getHistory(scripthash: string): Promise<object[]> {
    throw new Error("Not implemented");
  }
  
  public blockchainScripthash_history(scripthash: string, start_height: number): Promise<object[]> {
    throw new Error("Not implemented");
  }
  
  public blockchainScripthash_utxos(scripthash: string, start_height: number): Promise<object[]> {
    throw new Error("Not implemented");
  }
  
  public blockchainScripthash_getMempool(scripthash: string): Promise<object[]> {
    throw new Error("Not implemented");
  }
  
  public blockchainScripthash_listunspent(scripthash: string): Promise<object[]> {
    throw new Error("Not implemented");
  }
  
  public blockchainScripthash_subscribe(scripthash: string): Promise<string> {
    throw new Error("Not implemented");
  }
  
  public blockchainBlock_header(height: number, cp_height: number): Promise<any> {
    throw new Error("Not implemented");
  }
  
  public blockchainBlock_headers(start_height: number, count: number): Promise<object> {
    throw new Error("Not implemented");
  }
  
  public blockchainEstimatefee(numBlocks: number): Promise<number> {
    throw new Error("Not implemented");
  }
  
  public blockchainHeaders_subscribe(): Promise<object> {
    throw new Error("Not implemented");
  }
  
  public blockchain_relayfee(): Promise<number> {
    throw new Error("Not implemented");
  }
  
  public blockchainTransaction_broadcast(rawtx: string): Promise<string> {
    throw new Error("Not implemented");
  }
  
  public blockchainTransaction_get(txHash: string, verbose?: boolean, merkle?: boolean): Promise<any> {
    throw new Error("Not implemented");
  }
  
  public blockchainTransaction_getMerkle(txHash: string, height: number): Promise<object> {
    throw new Error("Not implemented");
  }
  
  public mempool_getFeeHistogram(): Promise<any[]> {
    throw new Error("Not implemented");
  }

  // ---------------------------------
  // protocol 1.3 deprecated methods
  // ---------------------------------
  public blockchainBlock_getHeader(height) {
    throw new Error("Not implemented");
  }

  // ---------------------------------
  // protocol 1.2 deprecated methods
  // ---------------------------------
  public blockchainBlock_getChunk(index) {
    throw new Error("Not implemented");
  }

  public blockchainAddress_getBalance(address) {
    throw new Error("Not implemented");
  }

  public blockchainAddress_getHistory(address) {
    throw new Error("Not implemented");
  }

  public blockchainAddress_getMempool(address) {
    throw new Error("Not implemented");
  }

  public blockchainAddress_listunspent(address) {
    throw new Error("Not implemented");
  }

  public blockchainAddress_subscribe(address) {
    throw new Error("Not implemented");
  }

  // ---------------------------------
  // protocol 1.1 deprecated methods
  // ---------------------------------
  public blockchainUtxo_getAddress(tx_hash, index) {
    throw new Error("Not implemented");
  }

  public blockchainNumblocks_subscribe() {
    throw new Error("Not implemented");
  }
}
