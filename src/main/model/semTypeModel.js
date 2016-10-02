'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var semTypeModelSchema = mongoose.Schema({
    fn_id: {type: Number, unique: true},
    name: {type: String}
});

var SemType = mongoose.model('SemType', semTypeModelSchema);

module.exports = SemType;