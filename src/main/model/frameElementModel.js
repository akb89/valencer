'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';
import './frameElementRelationModel';
import './semTypeModel';

mongoose.Promise = bluebird;

class FrameElement extends mongoose.Schema {
    constructor() {
        super({
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
        })
    }
}

export default mongoose.model('FrameElement', new FrameElement);