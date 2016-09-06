'use strict'

var fmt = require('util').format
var delay = require('delay')
// MUST RUN `make build` FIRST
var csp = require('../lib')
var co = require('co')

var main = co.wrap(function* () {
  var table = new csp.Channel()

  play(table, 'ping')
  play(table, 'pong')

  yield table.put({ hits: 0 })
  yield delay(1000)
  table.close()
})

var play = co.wrap(function* (table, name) {
  while (true) {
    var ball = yield table.take()
    if (ball === csp.CLOSED) {
      console.log(fmt('%s: table\'s gone', name))
      break
    }
    ball.hits++

    console.log(fmt('%s: %s', name, ball.hits))
    yield delay(100)
    yield table.put(ball)
  }
})

main()
