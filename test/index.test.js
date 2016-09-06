
/**
 * Module dependencies.
 */

import delay from 'delay'
import csp from '../src'
import test from 'ava'

/**
 * Tests.
 */

test(function testDefaultConstructor (t) {
  const chan = new csp.Channel()
  t.is(chan.size, null)
  t.is(chan.closed, false)
  t.deepEqual(chan._buf, [])
})

test(function testSizeConstructor (t) {
  const chan = new csp.Channel(5)
  t.is(chan.size, 5)
})

test(async function testTakeWhileEmpty (t) {
  const chan = new csp.Channel()
  const [val] = await Promise.all([
    chan.take(),
    putAfter(chan, 'ping', 100)
  ])
  t.is(val, 'ping')
  t.is(chan._buf.length, 0)
})

test(async function testTakeWhileAvailable (t) {
  const chan = new csp.Channel()
  await chan.put('ping')
  const val = await chan.take()
  t.is(val, 'ping')
})

test(async function testPut (t) {
  const chan = new csp.Channel(1)

  await chan.put('ping')
  const [res] = await Promise.all([
    takeAfter(chan, 100),
    chan.put('pong')
  ])
  t.is(res, 'ping')

  const res2 = await chan.take()
  t.is(res2, 'pong')
})

test(async function testPutWhileLimited (t) {
  const chan = new csp.Channel(1)
  await chan.put('ping')
  const val = await chan.take()
  t.is(val, 'ping')
})

test(async function testPutWhileClosed (t) {
  const chan = new csp.Channel()
  chan.close()
  await chan.put('ping')
  t.deepEqual(chan._buf.length, 0)
})

/**
 * Helpers.
 */

async function putAfter (chan, val, ms) {
  await delay(ms)
  return chan.put(val)
}

async function takeAfter (chan, ms) {
  await delay(ms)
  return chan.take()
}
