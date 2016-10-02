'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var frameSchema = mongoose.Schema({
    fn_id: {type: Number, unique: true},
    name: {type: String},
    definition: {type: String},
    cDate: {type: String},
    cBy: {type: String},
    frameElements: [{type: mongoose.Schema.Types.ObjectId, ref: 'FrameElement'}],
    feCoreSets: [[{type: mongoose.Schema.Types.ObjectId, ref: 'FrameElement'}]],
    frameRelations: [{type: mongoose.Schema.Types.ObjectId, ref: 'FrameRelation'}],
    lexUnits: [{type: mongoose.Schema.Types.ObjectId, ref: 'LexUnit'}],
    semTypes: [{type: mongoose.Schema.Types.ObjectId, ref: 'SemType'}]
});

var Frame = mongoose.model('Frame', frameSchema);

module.exports = Frame;