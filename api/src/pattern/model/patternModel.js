'use strict';

const mongoose = require('mongoose');

//TODO: implement mongoose validation to enforce uniqueness of patterns.
var patternSchema = mongoose.Schema({
    valences: [{type: mongoose.Schema.Types.ObjectId, ref: 'Valence'}]
});

var Pattern = mongoose.model('Pattern', patternSchema);

module.exports = Pattern;