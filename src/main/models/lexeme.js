'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

var lexemeSchema = mongoose.Schema({
    name:   {type: String, index: true},
    pos:    {type: String, index: true},
    headword:   {type: String, index: true},
    order:  {type: Number},
    breakBefore:    {type: String},
});

export default mongoose.model('Lexeme', lexemeSchema);