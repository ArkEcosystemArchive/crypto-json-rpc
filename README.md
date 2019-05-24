# @arkecosystem/crypto-json-rpc

<p align="center">
    <img src="https://raw.githubusercontent.com/ARKEcosystem/crypto-json-rpc/master/banner.png" />
</p>

[![Latest Version](https://badgen.now.sh/npm/v/@arkecosystem/crypto-json-rpc)](https://www.npmjs.com/package/@arkecosystem/crypto-json-rpc)
[![Node Engine](https://badgen.now.sh/npm/node/@arkecosystem/crypto-json-rpc)](https://www.npmjs.com/package/@arkecosystem/crypto-json-rpc)
[![Build Status](https://badgen.now.sh/circleci/github/ArkEcosystem/crypto-json-rpc)](https://circleci.com/gh/ArkEcosystem/crypto-json-rpc)
[![Codecov](https://badgen.now.sh/codecov/c/github/ArkEcosystem/crypto-json-rpc)](https://codecov.io/gh/ArkEcosystem/crypto-json-rpc)
[![License: MIT](https://badgen.now.sh/badge/license/MIT/green)](https://opensource.org/licenses/MIT)

## Disclaimer

The purpose of this application is to serve as a server for SDKs to ensure compliance with `@arkecosystem/crypto`, this means there can be many breaking changes without any notice.

**We strongly advise against using this for anything but SDK compliance testing and no support is offered if you do so.**

## Installation

```bash
yarn global add @arkecosystem/crypto-json-rpc
```

## Usage

```sh
$ crypto-json-rpc
A JSON-RPC 2.0 specification compliant server to interact with ARK Cryptography.

VERSION
  @arkecosystem/crypto-json-rpc/0.2.0 darwin-x64 node-v10.15.3

USAGE
  $ crypto-json-rpc [COMMAND]

COMMANDS
  autocomplete  display autocomplete installation instructions
  command
  commands      list all the commands
  help          display help for crypto-json-rpc
  log           Show the log
  restart       Restart the JSON-RPC
  run           Run the JSON-RPC (without pm2)
  start         Start the JSON-RPC
  status        Show the JSON-RPC status
  stop          Stop the JSON-RPC
  update        Update the crypto-json-rpc installation
```

## Testing

```bash
yarn test
```

## Security

If you discover a security vulnerability within this package, please send an e-mail to security@ark.io. All security vulnerabilities will be promptly addressed.

## Credits

This project exists thanks to all the people who [contribute](../../contributors).

## License

[MIT](LICENSE) © [ARK Ecosystem](https://ark.io)
