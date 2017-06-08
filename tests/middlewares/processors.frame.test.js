const chai = require('chai');
const mongoose = require('mongoose');
const FrameElement = require('noframenet-core').FrameElement;
const Pattern = require('noframenet-core').Pattern;
const ValenceUnit = require('noframenet-core').ValenceUnit;
const config = require('./../../config');
const getPatterns = require('./../../middlewares/framenet/core').getPatterns;

const should = chai.should();
mongoose.Promise = require('bluebird');

describe('frame', () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.dbUri);
    }
    const aFE = new FrameElement({
      _id: 1,
      name: 'A',
      coreType: 'Core',
    });
    await aFE.save();
    const bFE = new FrameElement({
      _id: 2,
      name: 'B',
    });
    await bFE.save();
    const cFE = new FrameElement({
      _id: 3,
      name: 'C',
    });
    await cFE.save();
    const dFE = new FrameElement({
      _id: 4,
      name: 'D',
      coreType: 'Peripheral',
    });
    await dFE.save();
    const eFE = new FrameElement({
      _id: 5,
      name: 'E',
      coreType: 'Core',
    });
    await eFE.save();
    const aNPObj = new ValenceUnit({
      FE: 1,
      PT: 'NP',
      GF: 'Obj',
    });
    await aNPObj.save();
    const bNPObj = new ValenceUnit({
      FE: 2,
      PT: 'NP',
      GF: 'Obj',
    });
    await bNPObj.save();
    const cNPExt = new ValenceUnit({
      FE: 3,
      PT: 'NP',
      GF: 'Ext',
    });
    await cNPExt.save();
    const dPPaboutExt = new ValenceUnit({
      FE: 4,
      PT: 'PP[about]',
      GF: 'Ext',
    });
    await dPPaboutExt.save();
    const eSfinADJ = new ValenceUnit({
      FE: 5,
      PT: 'Sfin',
      GF: 'Adj',
    });
    await eSfinADJ.save();
    const pattern1 = new Pattern({
      valenceUnits: [aNPObj, dPPaboutExt],
    });
    await pattern1.save();
    const pattern2 = new Pattern({
      valenceUnits: [aNPObj, bNPObj, cNPExt],
    });
    await pattern2.save();
  });
  after(async () => {
    await mongoose.connection.dropDatabase();
  });
  it('#getPatterns should return the correct number of patterns when processing FE.PT.GF combinations', async () => {
    const patterns = await getPatterns([['A', 'NP', 'Obj'], ['B', 'NP', 'Obj']], false, true);
    patterns.length.should.equal(5);
  });
});
