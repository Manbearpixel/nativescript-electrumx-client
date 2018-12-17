# Development Workflow

- [Prerequisites](https://github.com/NativeScript/nativescript-electrumx-client/blob/master/DevelopmentWorkflow.md#prerequisites)
- [Develop locally](https://github.com/NativeScript/nativescript-electrumx-client/blob/master/DevelopmentWorkflow.md#develop-locally)

## Prerequisites

- Install your native toolchain and NativeScript as [described in the docs](https://docs.nativescript.org/start/quick-setup)
  - Local android building requires [Android Studio](https://developer.android.com/studio/)
- Review [NativeScript plugins documentation](https://docs.nativescript.org/plugins/plugins) for more details on plugins development

## Develop locally

For local development we recommend using the npm commands provided in the plugin's `src/package.json`

Basically executing a bunch of commands will be enough for you to start making changes to the plugin and see them live synced in the demo. It's up to you to decide which demo to use for development - TypeScript or TypeScript + Angular.

To run and develop using TypeScript demo:

```bash
$ cd nativescript-electrumx-client/src
$ npm run demo.android
```

To run and develop using TypeScript + Angular demo:

```bash
$ cd nativescript-electrumx-client/src
$ npm run demo.ng.android
```

After all the changes are done make sure to

- test them in all the demo apps

For details on plugins development workflow, read [NativeScript plugins documentation](https://docs.nativescript.org/plugins/building-plugins#step-2-set-up-a-development-workflow) covering that topic.
