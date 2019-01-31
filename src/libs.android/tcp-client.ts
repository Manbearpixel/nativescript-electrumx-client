import { Observable, EventData } from "tns-core-modules/data/observable";
import * as EventEmitter from 'events';

declare let cz: any;

/**
 * @file nativescript-simple-networking
 * @author https://github.com/yaqwsx
 * @module cz.honzamrazek.simplenetworking
 * @license MIT
 * 
 * Source:  https://github.com/yaqwsx/nativescript-simple-networking
 * License: https://github.com/yaqwsx/nativescript-simple-networking/blob/master/LICENSE
 */

class UnexpectedResponseError extends Error {
  public rawResponse: string;

  constructor(rawResponse: string, ...args) {
    super(...args);

    this.name = 'UnexpectedResponseError';
    this.message = args[0];
    this.rawResponse = rawResponse;
  }
}

class TCPClientError extends Error {

  constructor(rawResponse: string, ...args) {
    super(...args);

    this.name = 'TCPClientError';
    this.message = args[0];
  }
}

export class TcpClient {
  private client;

  public onData: { (data: string): void; };
  public onError: { (id: number, message: string): void; };
  public onFinished: { (id: number): void; };

  public host: string;
  public port: number;
  public callbackQueue: any;
  public status: number;
  public actions: number;
  public subscribe: EventEmitter;
  public atomicInteger: number;

  constructor(host: string, port: number, options?: any) {
    if (typeof options === 'undefined') options = {};

    this.host = host;
    this.port = port;
    this.status = 0;
    this.atomicInteger = 0;
    this.callbackQueue = {};
    this.subscribe = new EventEmitter();

    let self = this;
    let listener = new cz.honzamrazek.simplenetworking.TcpClientListener({

      onData: (data: string) => {
        let dataArr = data.split('\n'); // split data input by newlines (multiple calls returning at once)
        dataArr.pop(); // remove last arr element (always empty)

        dataArr.forEach((_raw) => {
          try {
            let data = JSON.parse(_raw);
            if (data.id !== undefined) self.handleResponse(data);
            else self.subscribe.emit(data.method, data.params);

          } catch (err) { self.subscribe.emit('error', new UnexpectedResponseError(_raw, 'Invalid JSON')); }

          self.subscribe.emit('data', _raw);
        });
      },

      onError: (id, message) => {
        // if (self.onError !== null) self.onError(id, message);
        self.subscribe.emit('error', new TCPClientError(`TCPClient encountered an issue with (#${id}):${message}`));
      },

      onFinished: (id) => {
        // if (self.onFinished !== null) self.onFinished(id);
        self.subscribe.emit('finished', id);
      }
    });

    this.client = new cz.honzamrazek.simplenetworking.TcpClient(listener);
  }

  public async connect(): Promise<any> {
    let callback;
    return new Promise(async (resolve, reject) => {
      if (this.status) return resolve(true);

      this.status = 1;
      let id = await this.client.start(this.host, this.port);
      setTimeout(() => {
        resolve(id);
      }, 2000);
    });
  }

  public async close() {
    if (!this.status) return true;
    this.status = 0;
    Object.keys(this.callbackQueue).forEach((key) => {
      this.callbackQueue[key](new Error('close connect'));
      delete this.callbackQueue[key];
    });

    await this.client.stop();
    return Promise.resolve();
  }

  public async send(content: string) {
    return this.client.send(content);
  }

  public handleResponse(data: any) {
    let callback = this.callbackQueue[data.id];
    if (!callback) return;

    delete this.callbackQueue[data.id];
    if (data.error) callback(data.error);
    else callback(null, data.result);
  }
}
