'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var frameRelationSchema = mongoose.Schema({
    type: {type: String},
    frames: [{type: mongoose.Schema.Types.ObjectId, ref: 'Frame'}]
});

var FrameRelation = mongoose.model('FrameRelation', frameRelationSchema);

module.exports = FrameRelation;