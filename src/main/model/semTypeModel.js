'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

class SemType extends mongoose.Schema {
    constructor() {
        super({
            fn_id: {type: Number, unique: true},
            name: {type: String}
        })
    }
}

export default mongoose.model('SemType', new SemType);