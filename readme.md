# WAMP Router Server

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Greenkeeper badge](https://badges.greenkeeper.io/ivaylopivanov/wamp-server.svg)](https://greenkeeper.io/)

# Implemented by following the [WAMP](https://tools.ietf.org/html/draft-oberstet-hybi-tavendo-wamp-02) standards.

## Compatible with [Autobahn JS](http://autobahn.ws/js/)

## Currently only the [Basic Profile](https://tools.ietf.org/html/draft-oberstet-hybi-tavendo-wamp-02#page-7) is implemented.
 - hello
 - welcome
 - abort
 - goodbye
 - error
 - publish
 - published
 - subscribe
 - subscribed
 - unsubscribe
 - unsubscribed
 - event
 - call
 - result
 - register
 - registered
 - unregister
 - unregistered
 - invocation
 - yield

## Why
The other two node [implementations](http://wamp-proto.org/implementations/#routers) have memory leaks.

## Note
The current [source](https://github.com/ivaylopivanov/wamp-server/tree/master/src) is written in [Typescript](https://www.typescriptlang.org/) and the [release](https://github.com/ivaylopivanov/wamp-server/tree/master/release) is the compiled javascript version. Once [ES6 modules](http://www.ecma-international.org/ecma-262/6.0/#sec-imports) land in node, the only significant difference between the `src/` and the `release/` will be the types. At some point, the implementation may be moved to node completely.

## Installation

```bash
$ npm install wamp-server
```

## Usage

```js
'use strict';
const WAMP_SERVER = require('wamp-server');
const SERVER = new WAMP_SERVER({
  port: 8000,
  realms: ['com.example.inge'], // array or string
});
// to close the server - SERVER.close();
```

## Debugging

For debugging you can use the `DEBUG` variable - `DEBUG=wamp:*`

## Contributing

Any contribution will be highly appreciated

## Development

```bash
$ npm install
$ typings install
$ npm run dev
```

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## License

[MIT](https://github.com/ivaylopivanov/wamp-server/blob/master/LICENSE)

[npm-image]: https://badge.fury.io/js/wamp-server.svg
[npm-url]: https://npmjs.org/package/wamp-server
[travis-image]: https://travis-ci.org/ivaylopivanov/wamp-server.svg?branch=master
[travis-url]: https://travis-ci.org/ivaylopivanov/wamp-server
[coveralls-image]: https://coveralls.io/repos/ivaylopivanov/wamp-server/badge.svg
[coveralls-url]: https://coveralls.io/r/ivaylopivanov/wamp-server
