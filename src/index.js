
'use strict';

/**
 * Module dependencies.
 */

import Emitter from 'qevented';
import errors from './errors';


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
  constructor(size=null) {
    this.size = size;
    this.closed = false;
    this._buf = [];
    this._events = new Emitter();
  }

  /**
   * Push value to channel.
   *
   * @param {*} val - value to push to channel.
   * @param {Boolean} [block=true] - wait till available or throw?
   * @returns {Promise}
   * @throws
   *
   * @public
   */
  put(val, block=true) {
    return new Promise((resolve, reject) => {
      const done = () => {
        this._buf.push(val);
        this._events.emit('data');
        resolve();
      };

      if (this.closed) {
        reject(new errors.Closed('Cannot set on closed channel.'));
      } else if (this.size === null || this._buf.length < this.size) {
        done();
      } else if (block) {
        this._events.on('space', done);
      } else {
        reject(new errors.Full('Cannot put on full channel.'))
      }
    });
  }


  /**
   * Shift value off channel.
   *
   * @param  {Boolean} [block=true] - wait till available or throw?
   * @returns {Promise} - done
   *
   * @public
   */
  take(block=true) {
    return new Promise((resolve, reject) => {
      const done = () => {
        const val = this._buf.shift();
        this._events.emit('space');
        resolve(val);
      };

      if (this._buf.length) {
        done();
      } else if (block) {
        this._events.on('data', done);
      } else {
        reject(new errors.Empty('Cannot take on empty channel.'));
      }
    });
  }

  /**
   * Close channel.
   *
   * @public
   */
  close() {
    this.closed = true;
  }

}


/**
 * Exports.
 */

export default {
  Channel,
  errors
}
