'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var frameElementRelationSchema = mongoose.Schema({
    type: {type: String},
    frameElements: [{type: mongoose.Schema.Types.ObjectId, ref: 'FrameElement'}]
});

var FERelation = mongoose.model('FERelation', frameElementRelationSchema);

module.exports = FERelation;