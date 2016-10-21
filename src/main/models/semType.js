'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const semTypeModelSchema = mongoose.Schema({ // eslint-disable-line new-cap
  _id: { type: Number, unique: true },
  name: { type: String, index: true },
  definition: { type: String },
});

export default mongoose.model('SemType', semTypeModelSchema);