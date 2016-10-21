'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const valenceUnitSchema = mongoose.Schema({ // eslint-disable-line new-cap
  FE: { type: String, index: true },
  PT: { type: String, index: true },
  GF: { type: String, index: true },
});
valenceUnitSchema.index({ FE: 1, PT: 1, GF: 1 }, { unique: true });

export default mongoose.model('ValenceUnit', valenceUnitSchema);
