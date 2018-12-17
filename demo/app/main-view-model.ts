import { Observable } from 'tns-core-modules/data/observable';
import { ElectrumxClient } from 'nativescript-electrumx-client';
import { setTimeout, clearTimeout } from "tns-core-modules/timer";

export class HelloWorldModel extends Observable {
  private _message: string;
  private electrumxClient: ElectrumxClient;

  constructor() {
    super();

    this.updateMessage('LOADING');
    this.electrumxClient = new ElectrumxClient('electrumx.odinblockchain.org', 50001);

    this.setupSubscriptions();
    this.init();
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    if (this._message !== value) {
      this._message = value;
      this.notifyPropertyChange("message", value);
    }
  }

  private updateMessage(msg: string) {
    this.message = msg;
  }

  public setupSubscriptions() {
    let _client = this.electrumxClient;

    /**
     * Subscribe to all incoming data from the ElectrumX server
     * to your application.
     * @param rawData Is the raw string response.
     */
    _client.subscribe.on('data', (rawData: string) => {
    });

    /**
     * Subscribe to all finished actions.
     * @param tcpActionId Is a unique, incremented ID assigned to each action.
     */
    _client.subscribe.on('finished', (tcpActionId: number) => {
    });

    /**
     * Subscribe to any errors streamed from this plugin.
     * There are two primary error types to watch out for:
     *
     * err.name === "UnexpectedResponseError"
     * This error comes from an unexpected response from ElectrumX as
     * ElectrumX should always return a JSON.parse-able string response.
     *
     * err.name === "TCPClientError"
     * This error comes from the base class TcpClient when a connection
     * fails.
     */
    _client.subscribe.on('error', async (err) => {
      if (err.name === 'UnexpectedResponseError') {
        console.log('===- BAD SERVER RESPONSE -===');
        console.log(`Response::${err.rawResponse}`);
        return;
      } else if (err.name === 'TCPClientError') {
        console.log('===- BAD TCP CONNECTION -===');
        console.log(err);
        return;
      }

      console.log('===- GENERIC ERROR -===');
      console.log(err);
    });
    
    /**
     * Subscribe to a particular "subscribable" event from ElectrumX.
     * @param args Contains the parsed result from the ElectrumX server.
     * Results may vary (heh) view more from ElectrumX Server Docs.
     */
    _client.subscribe.on('blockchain.scripthash.subscribe', (...args) => {
      console.log('===- Scripthash Subscribe -===');
      console.dir(args);
    });
  }

  public async init() {
    try {
      // Connect to the host/port set earlier
      await this.electrumxClient.connect();
        
      // Fetch the version of the remote ElectrumX Server
      let version = await this.electrumxClient.server_version('2.7.11', '1.1');
      console.log(`Remote Version: ${version[0]}`);
    } catch (err) {
      console.log('Unable to connect');
      console.log(err);
    }
  }
}
