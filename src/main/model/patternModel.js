'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var patternSchema = mongoose.Schema({
    valenceUnits: [{type: mongoose.Schema.Types.ObjectId, ref: 'ValenceUnit'}]
});

// TODO: in current configuration there are lot of duplicate patterns.
//patternSchema.index({valenceUnits: 1}, {unique: true});

var Pattern = mongoose.model('Pattern', patternSchema);

module.exports = Pattern;