'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';
import './sentenceModel';
import './lexUnitModel';
import './patternModel';
import './labelModel';

mongoose.Promise = bluebird;

var annoSetSchema = mongoose.Schema({
    //fn_id: {type: Number, unique: true},
    sentence: {type: mongoose.Schema.Types.ObjectId, ref: 'Sentence'},
    lexUnit: {type: mongoose.Schema.Types.ObjectId, ref: 'LexUnit'},
    pattern: {type: mongoose.Schema.Types.ObjectId, ref: 'Pattern'},
    labels: [{type: mongoose.Schema.Types.ObjectId, ref: 'Label'}]
});

export default mongoose.model('AnnotationSet', annoSetSchema);