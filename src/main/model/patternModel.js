'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';
import './valenceUnitModel';

mongoose.Promise = bluebird;

class Pattern extends mongoose.Schema {
    constructor() {
        super({
            valenceUnits: [{type: mongoose.Schema.Types.ObjectId, ref: 'ValenceUnit'}]
        })
    }
}

export default mongoose.model('Pattern', new Pattern);