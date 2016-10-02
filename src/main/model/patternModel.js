'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var patternSchema = mongoose.Schema({
    valenceUnits: [{type: mongoose.Schema.Types.ObjectId, ref: 'ValenceUnit'}]
});

var Pattern = mongoose.model('Pattern', patternSchema);

module.exports = Pattern;