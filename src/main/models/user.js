'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';
import shortid from 'shortid';
import uuid from 'node-uuid';
import crypto from 'crypto';
import moment from 'moment';

mongoose.Promise = bluebird;

function generateKey() {
  return uuid.v4() + shortid.generate();
}

function generateSecret() {
  const key = shortid.generate() + shortid.generate() + shortid.generate();
  const time = +moment();
  return crypto.createHmac('sha256', `${time}`).update(key).digest('hex');
}

const userSchema = mongoose.Schema({ // eslint-disable-line new-cap
  key: { type: String, default: generateKey, index: true },
  secret: { type: String, default: generateSecret },
  timestamp: { type: Number, default: 0 },
});

export default mongoose.model('User', userSchema);
