'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var lexUnitSchema = mongoose.Schema({
    fn_id: {type: Number, unique: true},
    name: {type: String, index: true},
    pos: {type: String},
    definition: {type: String},
    //frameId: {type: Number, index: true},
    //frame: {type: String, index: true},
    frame: {type: mongoose.Schema.Types.ObjectId, ref: 'Frame'},
    status: {type: String},
    totalAnnotated: {type: Number},
    lemma_id: {type: Number},
    lexemes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Lexeme'}],
    semTypes: [{type: mongoose.Schema.Types.ObjectId, ref: 'SemType'}]
});

//lexUnitSchema.index({fn_id: 1}, {unique: true});

var LexUnit = mongoose.model('LexUnit', lexUnitSchema);

module.exports = LexUnit;