'use strict';

const mongoose = require('mongoose');

var frameElementIndexSchema = mongoose.Schema({
    name: {type: String, index:true}
});

var phraseTypeIndexSchema = mongoose.Schema({
    name: {type: String, index:true}
});

var grammaticalFunctionIndexSchema = mongoose.Schema({
    name: {type: String, index:true}
});

var FrameElementIndex = mongoose.model('FrameElementIndex', frameElementIndexSchema);
var PhraseTypeIndex = mongoose.model('PhraseTypeIndex', phraseTypeIndexSchema);
var GrammaticalFunctionIndex = mongoose.model('GrammaticalFunctionIndex', grammaticalFunctionIndexSchema);

module.exports = {
    FrameElementIndex,
    PhraseTypeIndex,
    GrammaticalFunctionIndex
};