'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';
import './valenceUnitModel';

mongoose.Promise = bluebird;

var patternSchema = mongoose.Schema({
    valenceUnits: [{type: mongoose.Schema.Types.ObjectId, ref: 'ValenceUnit'}]
});

export default mongoose.model('Pattern', patternSchema);