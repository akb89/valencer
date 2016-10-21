'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const corpusSchema = mongoose.Schema({ // eslint-disable-line new-cap
  _id: { type: Number, unique: true },
  name: { type: String, index: true },
  description: { type: String },
  documents: [{ type: Number, ref: 'Document' }],
});

corpusSchema.index({ documents: 1 });

export default mongoose.model('Corpus', corpusSchema);
