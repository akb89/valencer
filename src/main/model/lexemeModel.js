'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var lexemeSchema = mongoose.Schema({
    name:   {type: String},
    pos:    {type: String},
    headword:   {type: String},
    order:  {type: Number},
    breakBefore:    {type: String},
});

var Lexeme = mongoose.model('Lexeme', lexemeSchema);

module.exports = Lexeme;