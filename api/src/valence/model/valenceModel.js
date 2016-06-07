'use strict';

const mongoose = require('mongoose');

var valenceSchema = mongoose.Schema({
    FE: {type: String, index:true},
    PT: {type: String, index:true},
    GF: {type: String, index:true}
});
valenceSchema.index({FE: 1, PT: 1, GF: 1}, {unique: true});

var Valence = mongoose.model('Valence', valenceSchema);

module.exports = Valence;