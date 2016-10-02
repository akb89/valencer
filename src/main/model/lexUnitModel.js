'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';
import './frameModel';
import './lexemeModel';
import './semTypeModel';

mongoose.Promise = bluebird;

class LexUnit extends mongoose.Schema {
    constructor() {
        super({
            fn_id: {type: Number, unique: true},
            name: {type: String, index: true},
            pos: {type: String},
            definition: {type: String},
            frame: {type: mongoose.Schema.Types.ObjectId, ref: 'Frame'},
            status: {type: String},
            totalAnnotated: {type: Number},
            lemma_id: {type: Number},
            lexemes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Lexeme'}],
            semTypes: [{type: mongoose.Schema.Types.ObjectId, ref: 'SemType'}]
        })
    }
}

export default mongoose.model('LexUnit', new LexUnit);