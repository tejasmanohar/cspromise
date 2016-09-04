
# CSPromise [![Build Status](https://travis-ci.org/tejasmanohar/cspromise.svg?branch=master)](https://travis-ci.org/tejasmanohar/cspromise) [![Coverage Status](https://coveralls.io/repos/github/tejasmanohar/cspromise/badge.svg?branch=master)](https://coveralls.io/github/tejasmanohar/cspromise?branch=master)

CSPromise implements CSP constructs (found in e.g. Go, Clojure, etc.) on top of
JavaScript (Node.js or browser) Promises.


# Features

- *Easy.* Designed (but not required!) to be used with Promise-based coroutines
(e.g. [async/await], [Bluebird], [co]).
- *Standard.* Drop-in alongside existing Promises (native or polyfilled).
- *Fast.* As performant as a Promise.


# API

## var csp = require('cspromise')
Returns the module.

## new csp.Channel(size=0)
Instantiates a new CSP channel with an optional fixed size.

## Chan.prototype.put(val, [block=true])
Put an item in the channel, optionally blocking until space is available, and
then, resolve. If `block == false` and no space is available, reject.

## Chan.prototype.take([block=true])
Take an item from the channel, optionally blocking until a value is sent, and
then, resolve. If `block == false` and no space is available, reject.

## Chan.prototype.close()
Close channel. Receiving or sending on this channel will reject.


# FAQ

## Why CSP?
CSP makes it easy to communicate between Promise coroutines and moreover,
"control flows". Read more on [why CSP matters](https://reaktor.com/blog/why-csp-matters-i-keeping-things-in-sync/).

## Why not use [js-csp]?
[js-csp] and CSPromise align conceptually, but [js-csp] invents its
own asynchronous control flow, leaving a community of Promise-based code behind.


[async/await]: https://zeit.co/blog/async-and-await
[Bluebird]: http://bluebirdjs.com/docs/api/promise.coroutine.html
[co]: https://github.com/tj/co
[js-csp]: https://github.com/ubolonton/js-csp
