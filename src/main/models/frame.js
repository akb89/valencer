'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const frameSchema = mongoose.Schema({ // eslint-disable-line new-cap
  _id: { type: Number, unique: true },
  name: { type: String, index: true },
  definition: { type: String },
  cDate: { type: String },
  cBy: { type: String },
  frameElements: [{ type: Number, ref: 'FrameElement' }],
  feCoreSets: [[{ type: Number, ref: 'FrameElement' }]],
  frameRelations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FrameRelation' }],
  lexUnits: [{ type: Number, ref: 'LexUnit' }],
  semTypes: [{ type: Number, ref: 'SemType' }],
});

frameSchema.index({ frameElements: 1 });
frameSchema.index({ feCoreSets: 1 });
frameSchema.index({ frameRelations: 1 });
frameSchema.index({ semTypes: 1 });
// No index on lexUnits as a lexUnit is frame-specific

export default mongoose.model('Frame', frameSchema);
