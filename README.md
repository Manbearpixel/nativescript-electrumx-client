# NativeScript ElectrumX-Client ![android-support](https://camo.githubusercontent.com/e77a0a1454be63dbb168e7be9c81c5889ae1b0c8/68747470733a2f2f63646e342e69636f6e66696e6465722e636f6d2f646174612f69636f6e732f6c6f676f732d332f3232382f616e64726f69642d33322e706e67)

 [![ODIN Powered](https://odin.nyc3.digitaloceanspaces.com/badges/ODIN-Badge-PoweredBy.png)](https://odinblockchain.org/)
 
 [![npm version](https://img.shields.io/npm/v/nativescript-electrumx-client.svg?colorA=1d2323&colorB=41C0D1&style=flat-square)](https://npmjs.org/package/nativescript-electrumx-client) [![license](https://img.shields.io/npm/l/nativescript-electrumx-client.svg?colorA=1d2323&colorB=41C0D1&style=flat-square)](https://choosealicense.com/licenses/gpl-3.0/)



[![NPM](https://nodei.co/npm/nativescript-electrumx-client.png?downloads=true)](https://nodei.co/npm/nativescript-electrumx-client/)



The ElectrumX-Client NativeScript plugin allows your application to communicate with an [ElectrumX Server](https://electrumx.readthedocs.io/en/latest/). ElectrumX servers act as middleware allowing remote clients to fetch and send blockchain requests via TCP and TLS sockets to fetch and send blockchain related information.



## Requirements

This plugin requires `android.permission.INTERNET` to work properly. This must be added to your `AndroidManifest.xml` file.



## Installation

```bash
$ tns plugin add nativescript-electrumx-client
```



## Usage

Simply import the `ElectrumxClient` from this plugin and start using in your application. This plugin supports `async/await/promises` for a callback structure and utilizes the [events](https://github.com/Gozala/events#readme) to allow for a subscription service for specific events and streams from an ElectrumX Server. 

Example usage is listed below:

```typescript
import { ElectrumxClient } from 'nativescript-electrumx-client';

export class HelloWorldModel {
  	private electrumxClient: ElectrumxClient;
    
    constructor() {
    	this.electrumxClient = new ElectrumxClient('server.example.com', 50001);
        this.setupSubscriptions(); // subscription examples
        this.initClient(); // initialization example
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
        });
        
        /**
         * Subscribe to a particular "subscribable" event from ElectrumX.
         * @param args Contains the parsed result from the ElectrumX server.
         * Results may vary (heh) view more from ElectrumX Server Docs.
         */
        _client.subscribe.on('blockchain.scripthash.subscribe', (...args) => {
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
          console.log('Connection error');
        }
    }
}
```



## Limitations

This plugin is currently not available for iOS devices (Contributions for iOS support are welcomed and desired!) and socket connections are currently only supported via TCP. TLS support would be great, but would require further enhancements of the SimpleNetworking plugin we're working off of



## Acknowledgements

This plugin contains modified code based on the following sources:

| **node-electrum-client**           | https://github.com/you21979/node-electrum-client             |
| ---------------------------------- | ------------------------------------------------------------ |
| **nativescript-simple-networking** | **https://github.com/yaqwsx/nativescript-simple-networking** |

I'd like to give thanks to the contributors and authors of the works above as their solved headaches made this plugin less of a headache (sort of 😅).
