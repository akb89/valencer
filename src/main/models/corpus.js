'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

var corpusSchema = mongoose.Schema({
    _id: {type: Number, unique: true},
    name: {type: String, index: true},
    description: {type: String},
    documents: [{type: Number, ref: 'Document'}]
});

corpusSchema.index({documents: 1});

export default mongoose.model('Corpus', corpusSchema);