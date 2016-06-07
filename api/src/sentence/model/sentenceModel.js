'use strict';

const mongoose = require('mongoose');

var sentenceSchema = mongoose.Schema({
    annotationSets: [{type: mongoose.Schema.Types.ObjectId, ref: 'AnnotationSet'}]
});

var Sentence = mongoose.model('Sentence', sentenceSchema);

module.exports = Sentence;