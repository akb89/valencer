'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';
import './frameModel';

mongoose.Promise = bluebird;

class FrameRelation extends mongoose.Schema {
    constructor() {
        super({
            type: {type: String},
            frames: [{type: mongoose.Schema.Types.ObjectId, ref: 'Frame'}]
        })
    }
}

export default mongoose.model('FrameRelation', new FrameRelation);