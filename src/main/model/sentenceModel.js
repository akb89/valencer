'use strict';

import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');

var sentenceSchema = mongoose.Schema({
    //fn_id: {type: Number},
    text: {type: String},
    paragraphNumber: {type: Number},
    sentenceNumber: {type: Number},
    aPos: {type: Number}
});

export default mongoose.model('Sentence', sentenceSchema);