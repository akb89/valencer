'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

var annoSetSchema = mongoose.Schema({
    _id: {type: Number},
    sentence: {type: Number, ref: 'Sentence'},
    lexUnit: {type: Number, ref: 'LexUnit'},
    pattern: {type: mongoose.Schema.Types.ObjectId, ref: 'Pattern'},
    labels: [{type: mongoose.Schema.Types.ObjectId, ref: 'Label'}]
});

export default mongoose.model('AnnotationSet', annoSetSchema);