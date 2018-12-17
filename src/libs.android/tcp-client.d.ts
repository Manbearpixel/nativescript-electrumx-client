import * as EventEmitter from 'events';
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
  subscribe: any;
  atomicInteger: number;
  constructor(host: string, port: number, options?: any);
  connect(): Promise<any>;
  close(): Promise<true | void>;
  send(content: string): Promise<number>;
  handleResponse(data: any): void;
}
