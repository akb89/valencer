'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

var documentSchema = mongoose.Schema({
    _id: {type: Number, unique: true},
    name: {type: String, index: true},
    description: {type: String},
    sentences: [{type: Number, ref: 'Sentence'}]
});

documentSchema.index({sentences: 1});

export default mongoose.model('Document', documentSchema);