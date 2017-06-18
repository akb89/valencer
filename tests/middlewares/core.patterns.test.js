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
  let fPPinDep;
  let gPPtoObj;
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
    const fFE = new FrameElement({
      _id: 6,
      name: 'F',
      coreType: 'Core',
    });
    await fFE.save();
    const gFE = new FrameElement({
      _id: 7,
      name: 'G',
      coreType: 'Core',
    });
    await gFE.save();
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
    await eNPObj.save();
    fPPinDep = new ValenceUnit({
      FE: 6,
      PT: 'PP[in]',
      GF: 'Dep',
    });
    await fPPinDep.save();
    gPPtoObj = new ValenceUnit({
      FE: 7,
      PT: 'PP[to]',
      GF: 'Obj',
    });
    await gPPtoObj.save();
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
    const pattern10 = new Pattern({
      valenceUnits: [aNPObj, bNPObj, eNPDep, fPPinDep],
    });
    await pattern10.save();
    const pattern11 = new Pattern({
      valenceUnits: [aNPObj, dPPaboutExt, eNPDep, fPPinDep],
    });
    await pattern11.save();
    const pattern12 = new Pattern({
      valenceUnits: [aNPObj, bNPObj, cNPExt, eNPDep, fPPinDep],
    });
    await pattern12.save();
    const pattern13 = new Pattern({
      valenceUnits: [aNPObj, bNPObj, cNPExt, eNPDep, fPPinDep, eNPDep, eNPDep],
    });
    await pattern13.save();
    const pattern14 = new Pattern({
      valenceUnits: [fPPinDep, gPPtoObj, fPPinDep, fPPinDep, gPPtoObj, fPPinDep, gPPtoObj],
    });
    await pattern14.save();
    const pattern15 = new Pattern({
      valenceUnits: [fPPinDep, fPPinDep, gPPtoObj, gPPtoObj, fPPinDep],
    });
    await pattern15.save();
    const pattern16 = new Pattern({
      valenceUnits: [fPPinDep, fPPinDep, gPPtoObj, gPPtoObj, fPPinDep, gPPtoObj],
    });
    await pattern16.save();
  });
  after(async () => {
    await mongoose.connection.dropDatabase();
  });
  it('#getPatternsIDs should return correct patterns when processing a single arrayOfValenceUnitIDs', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id, bNPObj._id, cNPExt._id]]);
    patterns.length.should.equal(12);
  });
  it('#getPatternsIDs should return correct patterns when processing a single arrayOfValenceUnitIDs', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id, bNPObj._id, eSfinADJ._id, dPPaboutExt._id]]);
    patterns.length.should.equal(11);
  });
  it('#getPatternsIDs should return an empty array when processing a single arrayOfValenceUnitIDs not matching any pattern in the database', async () => {
    const patterns = await getPatternsIDs([[eNPNP._id]]);
    patterns.length.should.equal(0);
    patterns.should.deep.equal([]);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 2', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id], [bNPObj._id, cNPExt._id]]);
    patterns.length.should.equal(7);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 2', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id, bNPObj._id], [cNPExt._id, dPPaboutExt._id]]);
    patterns.length.should.equal(9);
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
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 3', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id], [bNPObj._id], [cNPExt._id, dPPaboutExt._id]]);
    patterns.length.should.equal(4);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 3', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id, bNPObj._id, cNPExt._id], [dPPaboutExt._id, eSfinADJ._id], [eSfinADJ._id]]);
    patterns.length.should.equal(1);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 3', async () => {
    const patterns = await getPatternsIDs([[eNPDep._id], [eNPDep._id], [eNPDep._id]]);
    patterns.length.should.equal(1);
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
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 4', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id, bNPObj._id, cNPExt._id], [dPPaboutExt._id, eNPDep._id], [fPPinDep._id], [eNPDep._id]]);
    patterns.length.should.equal(2);
  });
  it('#getPatternsIDs should return an empty array when processing an arrayOfArrayOfValenceUnitIDs of length 4 not matching any pattern in the database', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id, bNPObj._id, cNPExt._id], [dPPaboutExt._id, eNPDep._id], [fPPinDep._id], [gPPtoObj._id]]);
    patterns.length.should.equal(0);
    patterns.should.deep.equal([]);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 5', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id, bNPObj._id, cNPExt._id], [dPPaboutExt._id, eNPDep._id], [fPPinDep._id], [eNPDep._id], [gPPtoObj._id, eNPDep._id]]);
    patterns.length.should.equal(1);
  });
  it('#getPatternsIDs should return an empty array when processing an arrayOfArrayOfValenceUnitIDs of length 5 not matching any pattern in the database', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id, bNPObj._id, cNPExt._id], [cNPExt._id], [dPPaboutExt._id, eNPDep._id], [gPPtoObj._id, eNPDep._id], [cNPExt._id]]);
    patterns.length.should.equal(0);
    patterns.should.deep.equal([]);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 5', async () => {
    const patterns = await getPatternsIDs([[gPPtoObj._id], [gPPtoObj._id], [fPPinDep._id], [fPPinDep._id], [fPPinDep._id]]);
    patterns.length.should.equal(3);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 6', async () => {
    const patterns = await getPatternsIDs([[gPPtoObj._id], [gPPtoObj._id], [gPPtoObj._id], [fPPinDep._id], [fPPinDep._id], [fPPinDep._id]]);
    patterns.length.should.equal(2);
  });
  it('#getPatternsIDs should return an empty array when processing an arrayOfArrayOfValenceUnitIDs of length 6 not matching any pattern in the database', async () => {
    const patterns = await getPatternsIDs([[fPPinDep._id, gPPtoObj._id], [eNPDep._id, cNPExt._id, aNPObj._id, gPPtoObj._id], [fPPinDep._id], [aNPObj._id], [gPPtoObj._id, fPPinDep._id], [aNPObj._id, fPPinDep._id, eNPDep._id, dPPaboutExt._id], [gPPtoObj._id, fPPinDep._id]]);
    patterns.length.should.equal(0);
    patterns.should.deep.equal([]);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 7', async () => {
    const patterns = await getPatternsIDs([[gPPtoObj._id], [gPPtoObj._id], [gPPtoObj._id], [fPPinDep._id], [fPPinDep._id], [fPPinDep._id], [fPPinDep._id]]);
    patterns.length.should.equal(1);
  });
  it('#getPatternsIDs should return correct patterns when processing an arrayOfArrayOfValenceUnitIDs of length 7', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id, dPPaboutExt._id, gPPtoObj._id], [fPPinDep._id, gPPtoObj._id], [eNPDep._id, cNPExt._id, aNPObj._id, gPPtoObj._id], [fPPinDep._id], [gPPtoObj._id, fPPinDep._id], [aNPObj._id, fPPinDep._id, eNPDep._id, dPPaboutExt._id], [gPPtoObj._id, fPPinDep._id]]);
    patterns.length.should.equal(1);
  });
  it('#getPatternsIDs should return an empty array when processing an arrayOfArrayOfValenceUnitIDs of length 7 not matching any pattern in the database', async () => {
    const patterns = await getPatternsIDs([[aNPObj._id, dPPaboutExt._id, gPPtoObj._id], [fPPinDep._id, gPPtoObj._id], [eNPDep._id, cNPExt._id, aNPObj._id, gPPtoObj._id], [cNPExt._id], [gPPtoObj._id, fPPinDep._id], [aNPObj._id, fPPinDep._id, eNPDep._id, dPPaboutExt._id], [gPPtoObj._id, fPPinDep._id]]);
    patterns.length.should.equal(0);
    patterns.should.deep.equal([]);
  });
});
