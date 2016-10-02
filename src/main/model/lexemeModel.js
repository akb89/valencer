'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

class Lexeme extends mongoose.Schema {
    constructor() {
        super({
            name:   {type: String},
            pos:    {type: String},
            headword:   {type: String},
            order:  {type: Number},
            breakBefore:    {type: String}
        })
    }
}

export default mongoose.model('Lexeme', new Lexeme);