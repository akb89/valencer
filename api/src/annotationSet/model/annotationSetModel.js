'use strict';

const mongoose = require('mongoose');

var annoSetSchema = mongoose.Schema({
    pattern: {type: mongoose.Schema.Types.ObjectId, ref: 'Pattern'},
    labels: [{type: mongoose.Schema.Types.ObjectId, ref: 'Label'}]
});

var AnnotationSet = mongoose.model('AnnotationSet', annoSetSchema);

module.exports = AnnotationSet;