'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';
mongoose.Promise = bluebird;

var sentenceSchema = mongoose.Schema({
    _id: {type: Number, unique: true},
    text: {type: String},
    paragraphNumber: {type: Number, index: true},
    sentenceNumber: {type: Number, index: true},
    aPos: {type: Number}
});

export default mongoose.model('Sentence', sentenceSchema);