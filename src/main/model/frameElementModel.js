'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';
import './frameElementRelationModel';
import './semTypeModel';

mongoose.Promise = bluebird;

var frameElementSchema = mongoose.Schema({
    _id: {type: Number},
    name: {type: String},
    definition: {type: String},
    coreType: {type: String},
    cDate: {type: String},
    cBy: {type: String},
    fgColor: {type: String},
    bgColor: {type: String},
    abbrev: {type: String},
    feRelations: [{type: mongoose.Schema.Types.ObjectId, ref: 'FERelation'}],
    semTypes: [{type: Number, ref: 'SemType'}]
});

export default mongoose.model('FrameElement', frameElementSchema);