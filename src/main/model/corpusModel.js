'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

var corpusSchema = mongoose.Schema({
    //fn_id: {type: Number, unique: true},
    name: {type: String},
    description: {type: String},
    documents: [{type: mongoose.Schema.Types.ObjectId, ref: 'Document'}]
});

export default mongoose.model('Corpus', corpusSchema);