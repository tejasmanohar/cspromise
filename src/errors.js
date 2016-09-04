
'use strict';

/**
 * Module dependencies.
 */

import createError from 'create-error';


/**
 * Errors.
 */

const Closed = createError('ChannelClosedError', 'Channel has been closed.');
const Empty = createError('EmptyChannelError', 'Channel is empty.');
const Full = createError('FullChannelError', 'Channel is full.');


/**
 * Exports.
 */

export default {
  Closed,
  Empty,
  Full
}
