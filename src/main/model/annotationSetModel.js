'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var annoSetSchema = mongoose.Schema({
    fn_id: {type: Number, unique: true},
    sentence: {type: mongoose.Schema.Types.ObjectId, ref: 'Sentence'},
    lexUnit: {type: mongoose.Schema.Types.ObjectId, ref: 'LexUnit'},
    pattern: {type: mongoose.Schema.Types.ObjectId, ref: 'Pattern'},
    labels: [{type: mongoose.Schema.Types.ObjectId, ref: 'Label'}]
});

annoSetSchema.static('findByFNId', function(fnId){
   return AnnotationSet.findOne().where('fn_id').equals(fnId);
});

var AnnotationSet = mongoose.model('AnnotationSet', annoSetSchema, 'annotationSets');

module.exports = AnnotationSet;