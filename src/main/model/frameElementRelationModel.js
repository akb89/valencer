'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';
import './frameElementModel';

mongoose.Promise = bluebird;

class FERelation extends mongoose.Schema {
    constructor() {
        super({
            type: {type: String},
            frameElements: [{type: mongoose.Schema.Types.ObjectId, ref: 'FrameElement'}]
        })
    }
}

export default mongoose.model('FERelation', new FERelation);