'use strict'

import mongoose from 'mongoose';
import bluebird from 'bluebird';
import shortid from 'shortid';
import uuid from 'node-uuid';
import crypto from 'crypto';
import moment from 'moment';


mongoose.Promise = bluebird;

function generate_key() {
    let key = uuid.v4() + shortid.generate();
    return key;
}

function generate_secret() {
    let key = shortid.generate() + shortid.generate() + shortid.generate();
    let time = +moment();
    let hash = crypto.createHmac('sha256', `${time}`).update(key).digest('hex');
    return hash;
}

var userSchema = mongoose.Schema({
    key: { type: String, default: generate_key, index: true },
    secret: { type: String, default: generate_secret },
    timestamp: { type: Number, default: 0 }
});

export default mongoose.model('User', userSchema);
