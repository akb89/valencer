'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';
import './valenceUnit';

mongoose.Promise = bluebird;

const patternSchema = mongoose.Schema({ // eslint-disable-line new-cap
  valenceUnits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ValenceUnit' }],
});

patternSchema.index({ valenceUnits: 1 });

export default mongoose.model('Pattern', patternSchema);
