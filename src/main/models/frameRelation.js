'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const frameRelationSchema = mongoose.Schema({ // eslint-disable-line new-cap
  type: { type: String, index: true },
  frames: [{ type: Number, ref: 'Frame' }],
});

frameRelationSchema.index({ frames: 1 });

export default mongoose.model('FrameRelation', frameRelationSchema);
