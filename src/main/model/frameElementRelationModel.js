'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';
import './frameElementModel';

mongoose.Promise = bluebird;

var frameElementRelationSchema = mongoose.Schema({
    type: {type: String},
    frameElements: [{type: mongoose.Schema.Types.ObjectId, ref: 'FrameElement'}]
});

export default mongoose.model('FERelation', frameElementRelationSchema);