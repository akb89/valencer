'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

class AnnotationSet extends mongoose.Schema {
    constructor() {
        super({
            sentence: {type: mongoose.Schema.Types.ObjectId, ref: 'Sentence'},
            lexUnit: {type: mongoose.Schema.Types.ObjectId, ref: 'LexUnit'},
            pattern: {type: mongoose.Schema.Types.ObjectId, ref: 'Pattern'},
            labels: [{type: mongoose.Schema.Types.ObjectId, ref: 'Label'}]
        })
    }
}

export default mongoose.model('AnnotationSet', new AnnotationSet);