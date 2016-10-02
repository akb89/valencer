'use strict';

import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');

class Sentence extends mongoose.Schema {
    constructor() {
        super({
            fn_id: {type: Number},
            text: {type: String}
        })
    }
}

export default mongoose.model('Sentence', new Sentence);