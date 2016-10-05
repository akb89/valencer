'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';
import './frameElementModel';
import './frameRelationModel';
import './lexUnitModel';
import './semTypeModel';

mongoose.Promise = bluebird;

var frameSchema = mongoose.Schema({
    _id: {type: Number},
    name: {type: String},
    definition: {type: String},
    cDate: {type: String},
    cBy: {type: String},
    frameElements: [{type: Number, ref: 'FrameElement'}],
    feCoreSets: [[{type: Number, ref: 'FrameElement'}]],
    frameRelations: [{type: mongoose.Schema.Types.ObjectId, ref: 'FrameRelation'}],
    lexUnits: [{type: Number, ref: 'LexUnit'}],
    semTypes: [{type: Number, ref: 'SemType'}]
});

export default mongoose.model('Frame', frameSchema);