
# CSPromise [![Build Status](https://travis-ci.org/tejasmanohar/cspromise.svg?branch=master)](https://travis-ci.org/tejasmanohar/cspromise) [![Coverage Status](https://coveralls.io/repos/github/tejasmanohar/cspromise/badge.svg?branch=master)](https://coveralls.io/github/tejasmanohar/cspromise?branch=master)

CSPromise implements CSP constructs (found in e.g. Go, Clojure, etc.) on top of JavaScript
(Node.js or browser) Promises.


# Features

- **Easy.** Designed (but not required!) to be used with Promise-based coroutines.
- **Standard.** Drop-in alongside existing Promises (native or polyfilled).
- **Fast.** As performant as a Promise.


# Usage

```js
import csp from 'cspromise'
```

Ping Pong (ported from [js-csp] and further, [Go](https://talks.golang.org/2013/advconc.slide#6)).

```js
import delay from 'delay'

async function main () {
  const table = new csp.Channel()

  play(table, 'ping')
  play(table, 'pong')

  await table.put({ hits: 0 })
  await delay(1000)
  table.close()
}

async function play (table, name) {
  while (true) {
    const ball = await table.take()
    if (ball === csp.CLOSED) {
      console.log(`${name}: table's gone.`)
      break
    }
    ball.hits++

    console.log(`${name}: ${ball.hits}`)
    await delay(100)
    await table.put(ball)
  }
}

main()
```

To try it out yourself,
```
$ git clone https://github.com/tejasmanohar/cspromise.git
$ cd cspromise
$ npm install
$ ./node_modules/.bin/babel-node examples/ping_pong.js
ping: 1
pong: 2
ping: 3
pong: 4
ping: 5
pong: 6
ping: 7
pong: 8
ping: 9
pong: 10
ping: table's gone.
pong: table's gone.
```


# API

## const csp = require('cspromise')
Returns the module.

## new csp.Channel(size=null)
Instantiates a new CSP channel with an optional fixed size.

## Chan.prototype.put(val)
Put an item in the channel, blocking until space is available, and then, resolve.

## Chan.prototype.take()
Take an item from the channel, blocking until a value is sent, and then, resolve.

## Chan.prototype.close()
Close channel. `put()`ing on this channel will be noop, and `take()`ing will return `csp.CLOSED`.


# FAQ

## Why CSP?
CSP makes it easy to communicate between Promise coroutines and moreover,
"control flows". Read more on [why CSP matters](https://reaktor.com/blog/why-csp-matters-i-keeping-things-in-sync/).

## Why not use [js-csp]?
[js-csp] and CSPromise align conceptually, but [js-csp] invents its
own asynchronous control flow, leaving a community of Promise-based code behind.

## Do I have to use Babel?
Nope, you do not have to use Babel or moreover, transpile to use CSPromise! All source code has
already been transpiled before published to NPM. If you'd like an _async/await_-like experience
without transpiling or waiting on platform compatibility, try [Bluebird], [co], etc. Then, you can
even use really old Node (though you really shouldn't)--

```
$ node --version
v0.11.16
$ node --harmony examples/ping_pong_co.js examples/ping_pong_co
ping: 1
pong: 2
ping: 3
# ...
```

## Is it production-ready?
Probably not. The API is in early stages (v0.x.x) and likely to change. Feedback is appreciated.


[async/await]: https://zeit.co/blog/async-and-await
[Bluebird]: http://bluebirdjs.com/docs/api/promise.coroutine.html
[co]: https://github.com/tj/co
[js-csp]: https://github.com/ubolonton/js-csp
