'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var frameElementSchema = mongoose.Schema({
    fn_id: {type: Number, unique: true},
    name: {type: String},
    definition: {type: String},
    coreType: {type: String},
    cDate: {type: String},
    cBy: {type: String},
    fgColor: {type: String},
    bgColor: {type: String},
    abbrev: {type: String},
    feRelations: [{type: mongoose.Schema.Types.ObjectId, ref: 'FERelation'}],
    semTypes: [{type: mongoose.Schema.Types.ObjectId, ref: 'SemType'}]
});

var FrameElement = mongoose.model('FrameElement', frameElementSchema);

module.exports = FrameElement;