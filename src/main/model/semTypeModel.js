'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

var semTypeModelSchema = mongoose.Schema({
    //fn_id: {type: Number, unique: true},
    name: {type: String}
});

export default mongoose.model('SemType', semTypeModelSchema);