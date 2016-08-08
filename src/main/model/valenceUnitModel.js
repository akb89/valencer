'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var valenceUnitSchema = mongoose.Schema({
    FE: {type: String, index:true},
    PT: {type: String, index:true},
    GF: {type: String, index:true}
});
valenceUnitSchema.index({FE: 1, PT: 1, GF: 1}, {unique: true});

var ValenceUnit = mongoose.model('ValenceUnit', valenceUnitSchema, 'valenceUnits');

module.exports = ValenceUnit;