'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const lexUnitSchema = mongoose.Schema({ // eslint-disable-line new-cap
  _id: { type: Number, unique: true },
  name: { type: String, index: true },
  pos: { type: String, index: true },
  definition: { type: String },
  frame: { type: Number, ref: 'Frame', index: true },
  status: { type: String, index: true },
  totalAnnotated: { type: Number, index: true },
  lemma_id: { type: Number, index: true },
  lexemes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lexeme' }],
  semTypes: [{ type: Number, ref: 'SemType' }],
});

lexUnitSchema.index({ lexemes: 1 });
lexUnitSchema.index({ semTypes: 1 });

export default mongoose.model('LexUnit', lexUnitSchema);
