/**
 * Module dependencies.
 */

import Semaphore from 'node-semaphore'
import QEmitter from 'qevented'
import Promise from 'bluebird'

/**
 * Constants.
 */

const CLOSED = Symbol('closed')

/**
 * Channel.
 *
 * @class
 * @public
 */
class Channel {

  /**
   * Create a channel.
   *
   * @param  {Number} [size=0] - fixed size of channel.
   * @return {Channel} channel.
   *
   * @public
   */
  constructor (size = null) {
    this.size = size
    this.closed = false
    this._buf = []

    this._queue = new QEmitter()
    Promise.promisifyAll(this._queue)

    this._lock = new Semaphore(1)
    Promise.promisifyAll(this._lock)
  }

  /**
   * Push value to channel.
   *
   * @param {*} val - value to push to channel.
   * @returns {Promise}
   * @throws {ChannelClosedError} - Cannot set on closed channel.
   *
   * @public
   */
  async put (val) {
    if (this.closed) return

    if (this.size !== null && this._buf.length >= this.size) {
      await this._queue.onAsync('space')
    }

    this._buf.push(val)
    this._queue.emit('data')
  }

  /**
   * Shift value off channel.
   *
   * @returns {Promise} - done
   *
   * @public
   */
  async take () {
    if (this.closed) return CLOSED

    try {
      await this._lock.acquireAsync()
      if (!this._buf.length) {
        await this._queue.onAsync('data')
      }

      const val = this._buf.shift()
      this._queue.emit('space')
      return val
    } finally {
      this._lock.release()
    }
  }

  /**
   * Close channel.
   *
   * @public
   */
  close () {
    this.closed = true
  }

}

/**
 * Exports.
 */

export default {
  Channel,
  CLOSED
}
