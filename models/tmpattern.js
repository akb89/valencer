const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

const tmpPatternSchema = mongoose.Schema({
  valenceUnits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ValenceUnit',
  }],
  query: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
  pattern: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
});

tmpPatternSchema.index({
  valenceUnits: 1,
});

module.exports = mongoose.model('TMPattern', tmpPatternSchema, '_tmpatterns');
