'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var annoSetSchema = mongoose.Schema({
    fn_id: {type: Number, unique: true},
    sentence: {type: mongoose.Schema.Types.ObjectId, ref: 'Sentence', index: true},
    lexUnit: {type: mongoose.Schema.Types.ObjectId, ref: 'LexUnit', index: true},
    pattern: {type: mongoose.Schema.Types.ObjectId, ref: 'Pattern', index: true}, //TODO Check if AnnoSet refers to
    // only one pattern
    labels: [{type: mongoose.Schema.Types.ObjectId, ref: 'Label'}]
});

annoSetSchema.static('findByFNId', function(fnId){
   return AnnotationSet.findOne().where('fn_id').equals(fnId);
});

var AnnotationSet = mongoose.model('AnnotationSet', annoSetSchema);

module.exports = AnnotationSet;