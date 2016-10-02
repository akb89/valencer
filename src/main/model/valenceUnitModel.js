'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

class ValenceUnit extends mongoose.Schema {
    constructor() {
        super({
            FE: {type: String, index:true},
            PT: {type: String, index:true},
            GF: {type: String, index:true}
        })
    }
}

// TODO: add a unique index
// valenceUnitSchema.index({FE: 1, PT: 1, GF: 1}, {unique: true});

export default mongoose.model('ValenceUnit', new ValenceUnit);