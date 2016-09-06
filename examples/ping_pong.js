'use strict'

import delay from 'delay'
import csp from '../src'

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
