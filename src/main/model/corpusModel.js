'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

var corpusSchema = mongoose.Schema({
    _id: {type: Number},
    name: {type: String},
    description: {type: String},
    documents: [{type: Number, ref: 'Document'}]
});

export default mongoose.model('Corpus', corpusSchema);