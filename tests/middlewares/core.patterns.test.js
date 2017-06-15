const chai = require('chai');
const mongoose = require('mongoose');
const rewire = require('rewire');
const FrameElement = require('noframenet-core').FrameElement;
const Pattern = require('noframenet-core').Pattern;
const ValenceUnit = require('noframenet-core').ValenceUnit;
const config = require('./../../config');

const should = chai.should();
const getPatternsIDs = rewire('./../../middlewares/core/patterns').__get__('getPatternsIDs');
mongoose.Promise = require('bluebird');

describe('core.patterns', () => {
  let aNPObj;
  let bNPObj;
  let cNPExt;
  let dPPaboutExt;
  let eSfinADJ;
  let eNPNP;
  let eNPDep;
  let eNPObj;
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
    aNPObj = new ValenceUnit({
      FE: 1,
      PT: 'NP',
      GF: 'Obj',
    });
    await aNPObj.save();
    bNPObj = new ValenceUnit({
      FE: 2,
      PT: 'NP',
      GF: 'Obj',
    });
    await bNPObj.save();
    cNPExt = new ValenceUnit({
      FE: 3,
      PT: 'NP',
      GF: 'Ext',
    });
    await cNPExt.save();
    dPPaboutExt = new ValenceUnit({
      FE: 4,
      PT: 'PP[about]',
      GF: 'Ext',
    });
    await dPPaboutExt.save();
    eSfinADJ = new ValenceUnit({
      FE: 5,
      PT: 'Sfin',
      GF: 'Adj',
    });
    await eSfinADJ.save();
    eNPNP = new ValenceUnit({
      FE: 5,
      PT: 'NoPatternPT',
      GF: 'NoPatternGF',
    });
    await eNPNP.save();
    eNPDep = new ValenceUnit({
      FE: 5,
      PT: 'NP',
      GF: 'Dep',
    });
    await eNPDep.save();
    eNPObj = new ValenceUnit({
      FE: 5,
      PT: 'NP',
      GF: 'Obj',
    });
    await eNPDep.save();
    const pattern1 = new Pattern({
      valenceUnits: [aNPObj, dPPaboutExt],
    });
    await pattern1.save();
    const pattern2 = new Pattern({
      valenceUnits: [aNPObj, bNPObj, cNPExt],
    });
    await pattern2.save();
    const pattern3 = new Pattern({
      valenceUnits: [aNPObj, bNPObj],
    });
    await pattern3.save();
    const pattern4 = new Pattern({
      valenceUnits: [aNPObj, cNPExt],
    });
    await pattern4.save();
    const pattern5 = new Pattern({
      valenceUnits: [bNPObj, cNPExt],
    });
    await pattern5.save();
    const pattern6 = new Pattern({
      valenceUnits: [dPPaboutExt, eSfinADJ, bNPObj],
    });
    await pattern6.save();
    const pattern7 = new Pattern({
      valenceUnits: [cNPExt],
    });
    await pattern7.save();
    const pattern8 = new Pattern({
      valenceUnits: [aNPObj, bNPObj, cNPExt, eSfinADJ],
    });
    await pattern8.save();
    const pattern9 = new Pattern({
      valenceUnits: [eNPDep, eNPDep, eNPObj, eNPObj],
    });
    await pattern9.save();
  });
  after(async () => {
    await mongoose.connection.dropDatabase();
  });
  it('#getPatternsIDs should return correct patterns when processing a single arrayOfValenceUnitIDs', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id, bNPObj._id, cNPExt._id]]);
    patterns.length.should.equal(8);
  });
  it('#getPatternsIDs should return correct patterns when processing a single arrayOfValenceUnitIDs', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id, bNPObj._id, eSfinADJ._id, dPPaboutExt._id]]);
    patterns.length.should.equal(7);
  });
  it('#getPatternsIDs should return an empty array when processing a single arrayOfValenceUnitIDs not matching any pattern in the database', async () => {
    const patterns = await getPatternsIDs([[eNPNP._id]]);
    patterns.length.should.equal(0);
    patterns.should.deep.equal([]);
  });
  it('#getPatternsIDs should not insert TMPatterns when processing a single arrayOfValenceUnitIDs', async () => {
    await getPatternsIDs([[aNPObj._id, bNPObj._id, cNPExt._id]]);
    //const tmpatterns = await TMPattern.find();
    //tmpatterns.length.should.equal(0);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 2', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id], [bNPObj._id, cNPExt._id]]);
    patterns.length.should.equal(4);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 2', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id, bNPObj._id], [cNPExt._id, dPPaboutExt._id]]);
    patterns.length.should.equal(6);
  });
  it('#getPatternsIDs should return an empty array when processing an arrayOfArrayOfValenceUnitIDs of length 2 not matching any pattern in the database', async () => {
    const patterns = await getPatternsIDs([[dPPaboutExt._id], [eNPObj._id]]);
    patterns.length.should.equal(0);
    patterns.should.deep.equal([]);
  });
  it('#getPatternsIDs should return an empty array when processing an arrayOfArrayOfValenceUnitIDs of length 2 not matching any pattern in the database', async () => {
    const patterns = await getPatternsIDs([[eNPNP._id], [eSfinADJ._id]]);
    patterns.length.should.equal(0);
    patterns.should.deep.equal([]);
  });
  it('#getPatternsIDs should have removed all TMPatterns matching the queryIdentifier when processing an arrayOfArrayOfValenceUnitIDs of length 2', async () => {
    await getPatternsIDs([[aNPObj._id, bNPObj._id], [cNPExt._id, dPPaboutExt._id]]);
    //const tmpatterns = await TMPattern.find();
    //tmpatterns.length.should.equal(0);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 3', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id], [bNPObj._id], [cNPExt._id, dPPaboutExt._id]]);
    patterns.length.should.equal(2);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 3', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id, bNPObj._id, cNPExt._id], [dPPaboutExt._id, eSfinADJ._id], [eSfinADJ._id]]);
    patterns.length.should.equal(1);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 3', async () => {
    const patterns = await getPatternsIDs([[eNPDep._id], [eNPDep._id], [eNPDep._id]]);
    patterns.length.should.equal(0);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 3', async () => {
    const patterns = await getPatternsIDs([[eNPDep._id], [eNPDep._id], [eNPObj._id]]);
    patterns.length.should.equal(1);
  });
  it('#getPatternsIDs should return an empty array when processing an arrayOfArrayOfValenceUnitIDs of length 3 not matching any pattern in the database', async () => {
    const patterns = await getPatternsIDs([[dPPaboutExt._id], [aNPObj._id], [eSfinADJ._id]]);
    patterns.length.should.equal(0);
    patterns.should.deep.equal([]);
  });
  it('#getPatternsIDs should return an empty array when processing an arrayOfArrayOfValenceUnitIDs of length 3 not matching any pattern in the database', async () => {
    const patterns = await getPatternsIDs([[dPPaboutExt._id], [eSfinADJ._id], [eNPNP._id]]);
    patterns.length.should.equal(0);
    patterns.should.deep.equal([]);
  });
  it('#getPatternsIDs should have removed all TMPatterns matching the queryIdentifier when processing an arrayOfArrayOfValenceUnitIDs of length 3', async () => {
    await getPatternsIDs([[aNPObj._id], [bNPObj._id], [cNPExt._id, dPPaboutExt._id]]);
    //const tmpatterns = await TMPattern.find();
    //tmpatterns.length.should.equal(0);
  });
  it('#', async () => {
    //Test pattern of length 1
  });
});
