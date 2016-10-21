'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const sentenceSchema = mongoose.Schema({ // eslint-disable-line new-cap
  _id: { type: Number, unique: true },
  text: { type: String },
  paragraphNumber: { type: Number, index: true },
  sentenceNumber: { type: Number, index: true },
  aPos: { type: Number },
});

export default mongoose.model('Sentence', sentenceSchema);