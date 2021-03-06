/// <reference path="node_modules/tns-platform-declarations/android.d.ts" />
import * as EventEmitter from 'events';
export declare class UnexpectedResponseError extends Error {
    rawResponse: string;
    constructor(rawResponse: string, ...args: any[]);
}
export declare class TCPClientError extends Error {
    constructor(rawResponse: string, ...args: any[]);
}
export declare function makeRequest(method: string, params: object, id?: number): string;
export declare function createPromiseResult(resolve: any, reject: any): (err: ErrorEvent, result: any) => void;
export declare class TcpClient {
    private client;
    onData: {
        (data: string): void;
    };
    onError: {
        (id: number, message: string): void;
    };
    onFinished: {
        (id: number): void;
    };
    host: string;
    port: number;
    callbackQueue: any;
    status: number;
    actions: number;
    subscribe: EventEmitter;
    atomicInteger: number;
    constructor(host: string, port: number, options?: any);
    connect(): Promise<any>;
    close(): Promise<true | void>;
    send(content: string): Promise<any>;
    handleResponse(data: any): void;
}
export declare class ElectrumxClient extends TcpClient {
    constructor(host: string, port: number, options?: any);
    private _request(method, params);
    close(): Promise<any>;
    server_version(client_name: string, protocol_version: string): Promise<string[]>;
    server_banner(): Promise<string>;
    server_ping(): Promise<null>;
    server_addPeer(features: any): Promise<boolean>;
    serverDonation_address(): Promise<string>;
    serverPeers_subscribe(): Promise<object[]>;
    blockchainScripthash_getBalance(scripthash: string): Promise<object>;
    blockchainScripthash_getHistory(scripthash: string): Promise<object[]>;
    blockchainScripthash_history(scripthash: string, start_height: number): Promise<object[]>;
    blockchainScripthash_utxos(scripthash: string, start_height: number): Promise<object[]>;
    blockchainScripthash_getMempool(scripthash: string): Promise<object[]>;
    blockchainScripthash_listunspent(scripthash: string): Promise<object[]>;
    blockchainScripthash_subscribe(scripthash: string): Promise<string>;
    blockchainBlock_header(height: number, cp_height: number): Promise<any>;
    blockchainBlock_headers(start_height: number, count: number): Promise<object>;
    blockchainEstimatefee(numBlocks: number): Promise<number>;
    blockchainHeaders_subscribe(): Promise<object>;
    blockchain_relayfee(): Promise<number>;
    blockchainTransaction_broadcast(rawtx: string): Promise<string>;
    blockchainTransaction_get(txHash: string, verbose?: boolean, merkle?: boolean): Promise<any>;
    blockchainTransaction_getMerkle(txHash: string, height: number): Promise<any>;
    mempool_getFeeHistogram(): Promise<any[]>;
    blockchainBlock_getHeader(height: any): Promise<any>;
    blockchainBlock_getChunk(index: any): Promise<any>;
    blockchainAddress_getBalance(address: any): Promise<any>;
    blockchainAddress_getHistory(address: any): Promise<any>;
    blockchainAddress_getMempool(address: any): Promise<any>;
    blockchainAddress_listunspent(address: any): Promise<any>;
    blockchainAddress_subscribe(address: any): Promise<any>;
    blockchainUtxo_getAddress(tx_hash: any, index: any): Promise<any>;
    blockchainNumblocks_subscribe(): Promise<any>;
}
