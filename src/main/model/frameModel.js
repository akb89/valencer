'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';
import './frameElementModel';
import './frameRelationModel';
import './lexUnitModel';
import './semTypeModel';

mongoose.Promise = bluebird;

var frameSchema = mongoose.Schema({
    //fn_id: {type: Number, unique: true},
    //_id: {type: mongoose.Schema.Types.ObjectId},
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

export default mongoose.model('Frame', frameSchema);