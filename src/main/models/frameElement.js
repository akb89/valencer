'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

var frameElementSchema = mongoose.Schema({
    _id: {type: Number, unique: true},
    name: {type: String, index: true},
    definition: {type: String},
    coreType: {type: String},
    cDate: {type: String},
    cBy: {type: String},
    fgColor: {type: String},
    bgColor: {type: String},
    abbrev: {type: String, index: true},
    feRelations: [{type: mongoose.Schema.Types.ObjectId, ref: 'FERelation'}],
    semTypes: [{type: Number, ref: 'SemType'}]
});

frameElementSchema.index({feRelations: 1});
frameElementSchema.index({semTypes: 1});

export default mongoose.model('FrameElement', frameElementSchema);