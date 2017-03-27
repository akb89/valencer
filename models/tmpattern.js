const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

const patternSchema = mongoose.Schema({
  valenceUnits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ValenceUnit',
  }],
});

patternSchema.index({
  valenceUnits: 1,
});

module.exports = mongoose.model('TMPattern', patternSchema, '_tmpatterns');
