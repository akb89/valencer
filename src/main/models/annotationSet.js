'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

var annoSetSchema = mongoose.Schema({
    _id: {type: Number, unique: true},
    sentence: {type: Number, ref: 'Sentence', index: true},
    lexUnit: {type: Number, ref: 'LexUnit', index: true},
    pattern: {type: mongoose.Schema.Types.ObjectId, ref: 'Pattern', index: true},
    labels: [{type: mongoose.Schema.Types.ObjectId, ref: 'Label'}]
});

export default mongoose.model('AnnotationSet', annoSetSchema);