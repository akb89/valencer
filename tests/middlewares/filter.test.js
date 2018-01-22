const chai = require('chai');
const mongoose = require('mongoose');
const rewire = require('rewire');
const FrameElement = require('noframenet-core').FrameElement;
const Pattern = require('noframenet-core').Pattern;
const ValenceUnit = require('noframenet-core').ValenceUnit;
const config = require('./../../config');

const should = chai.should();
const filterByStrictVUMatching = rewire('./../../middlewares/filter').__get__('filterByStrictVUMatching');

describe('filter', () => {
  let aFE;
  let bFE;
  let cFE;
  let dFE;
  let eFE;
  let fFE;
  let ggFE;
  let aNPObj;
  let bNPObj;
  let cNPExt;
  let dPPaboutExt;
  let eSfinADJ;
  let eNPNP;
  let eNPDep;
  let eNPObj;
  let fPPinDep;
  let gPPtoObj;
  let pattern2;
  let pattern8;
  let pattern9;
  let pattern10;
  let pattern11;
  let pattern12;
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.dbUri);
    }
    aFE = new FrameElement({ _id: 1, name: 'A', coreType: 'Core' });
    await aFE.save();
    bFE = new FrameElement({ _id: 2, name: 'B', coreType: 'Peripheral' });
    await bFE.save();
    cFE = new FrameElement({ _id: 3, name: 'C', coreType: 'Core' });
    await cFE.save();
    dFE = new FrameElement({ _id: 4, name: 'D', coreType: 'Peripheral' });
    await dFE.save();
    eFE = new FrameElement({ _id: 5, name: 'E', coreType: 'Core' });
    await eFE.save();
    fFE = new FrameElement({ _id: 6, name: 'F', coreType: 'Peripheral' });
    await fFE.save();
    const gFE = new FrameElement({ _id: 7, name: 'G', coreType: 'Core' });
    await gFE.save();
    ggFE = new FrameElement({ _id: 8, name: 'G', coreType: 'Peripheral' });
    await ggFE.save();
    aNPObj = new ValenceUnit({ FE: 1, PT: 'NP', GF: 'Obj' });
    await aNPObj.save();
    bNPObj = new ValenceUnit({ FE: 2, PT: 'NP', GF: 'Obj' });
    await bNPObj.save();
    cNPExt = new ValenceUnit({ FE: 3, PT: 'NP', GF: 'Ext' });
    await cNPExt.save();
    dPPaboutExt = new ValenceUnit({ FE: 4, PT: 'PP[about]', GF: 'Ext' });
    await dPPaboutExt.save();
    eSfinADJ = new ValenceUnit({ FE: 5, PT: 'Sfin', GF: 'Adj' });
    await eSfinADJ.save();
    eNPNP = new ValenceUnit({ FE: 5, PT: 'NoPatternPT', GF: 'NoPatternGF' });
    await eNPNP.save();
    eNPDep = new ValenceUnit({ FE: 5, PT: 'NP', GF: 'Dep' });
    await eNPDep.save();
    eNPObj = new ValenceUnit({ FE: 5, PT: 'NP', GF: 'Obj' });
    await eNPObj.save();
    fPPinDep = new ValenceUnit({ FE: 6, PT: 'PP[in]', GF: 'Dep' });
    await fPPinDep.save();
    gPPtoObj = new ValenceUnit({ FE: 7, PT: 'PP[to]', GF: 'Obj' });
    await gPPtoObj.save();
    pattern2 = new Pattern({
      valenceUnits: [aNPObj, bNPObj, cNPExt],
    });
    await pattern2.save();
    pattern8 = new Pattern({
      valenceUnits: [aNPObj, bNPObj, cNPExt, eSfinADJ],
    });
    await pattern8.save();
    pattern9 = new Pattern({
      valenceUnits: [aNPObj, bNPObj, cNPExt, eSfinADJ, gPPtoObj],
    });
    await pattern9.save();
    pattern10 = new Pattern({
      valenceUnits: [aNPObj, bNPObj, cNPExt, dPPaboutExt, bNPObj],
    });
    await pattern10.save();
    pattern11 = new Pattern({
      valenceUnits: [aNPObj, dPPaboutExt, eNPDep, fPPinDep],
    });
    await pattern11.save();
    pattern12 = new Pattern({
      valenceUnits: [aNPObj, bNPObj, cNPExt, dPPaboutExt],
    });
    await pattern12.save();
  });
  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
  it('#filterByStrictVUMatching should return a correct array of patterns ids filtered by strict #valenceUnit matching', async () => {
    (await filterByStrictVUMatching([pattern2, pattern8, pattern12],
                                    [[aNPObj._id],
                                     [bNPObj._id],
                                     [cNPExt._id]])).length.should.equal(1);
    (await filterByStrictVUMatching([pattern8, pattern12],
                                    [[aNPObj._id],
                                     [bNPObj._id],
                                     [cNPExt._id]])).length.should.equal(0);
  });
});
