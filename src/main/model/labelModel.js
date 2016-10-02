'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

class Label extends mongoose.Schema {
    constructor() {
        super({
            name:  {type: String},
            type:  {type: String},
            startPos:   {type: Number},
            endPos:     {type: Number}
        })
    }
}

export default mongoose.model('Label', new Label);