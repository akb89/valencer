const chai = require('chai');
const mongoose = require('mongoose');
const rewire = require('rewire');
const FrameElement = require('noframenet-core').FrameElement;
const Pattern = require('noframenet-core').Pattern;
const ValenceUnit = require('noframenet-core').ValenceUnit;
const config = require('./../../config');

const should = chai.should();
const getPatterns = rewire('./../../middlewares/processor').__get__('getPatterns');
mongoose.Promise = require('bluebird');

describe('processor.patterns.filtered', () => {
  let aNPObj;
  let bNPObj;
  let cNPExt;
  let dPPaboutExt;
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.dbUri);
    }
  });
  after(async () => {
    await mongoose.connection.dropDatabase();
  });
  it('#getPatterns should return the correct number of patterns when querying non-strictVUMatching with no-withExtraCoreFEs', async () => {
    const patterns = await getPatterns([['A', 'NP', 'Obj'], ['B', 'NP', 'Obj'], ['C', 'NP', 'Ext']], false, false);
    patterns.length.should.equal(3);
  });
});
