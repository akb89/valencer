'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

var frameRelationSchema = mongoose.Schema({
    type: {type: String, index: true},
    frames: [{type: Number, ref: 'Frame'}]
});

frameRelationSchema.index({frames: 1});

export default mongoose.model('FrameRelation', frameRelationSchema);