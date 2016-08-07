'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var sentenceSchema = mongoose.Schema({
    fn_id: {type: Number},
    text: {type: String}
});

//sentenceSchema.index({fn_id: 1}, {unique: true});

sentenceSchema.static('findByFNId', function(fnId){
    return this.findOne().where('fn_id').equals(fnId);
});

var Sentence = mongoose.model('Sentence', sentenceSchema);

module.exports = Sentence;