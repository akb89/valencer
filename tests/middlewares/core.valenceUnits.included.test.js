const chai = require('chai');
const mongoose = require('mongoose');
const rewire = require('rewire');
const FrameElement = require('noframenet-core').FrameElement;
const ValenceUnit = require('noframenet-core').ValenceUnit;
const config = require('./../../config');
mongoose.Promise = require('bluebird');

const should = chai.should();
const getValenceUnitsIDs = rewire('./../../middlewares/core/valenceUnits').__get__('getValenceUnitsIDsWithValenceUnitModel')(ValenceUnit);
const getArrayOfArrayOfValenceUnitsIDs = rewire('./../../middlewares/core/valenceUnits').__get__('getArrayOfArrayOfValenceUnitsIDsWithValenceUnitModel')(ValenceUnit);

describe('core.valenceUnits.included', () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.dbUri, { useMongoClient: true });
    }
    const aFE = new FrameElement({ _id: 1, name: 'A' });
    await aFE.save();
    const bFE = new FrameElement({ _id: 2, name: 'B' });
    await bFE.save();
    const cFE = new FrameElement({ _id: 3, name: 'C' });
    await cFE.save();
    const dFE = new FrameElement({ _id: 4, name: 'D' });
    await dFE.save();
    const d1FE = new FrameElement({ _id: 5, name: 'D' });
    await d1FE.save();
    const d2FE = new FrameElement({ _id: 6, name: 'D' });
    await d2FE.save();
    const aNPObj = new ValenceUnit({ FE: 1, PT: 'NP', GF: 'Obj' });
    await aNPObj.save();
    const bNPObj = new ValenceUnit({ FE: 2, PT: 'NP', GF: 'Obj' });
    await bNPObj.save();
    const cNPExt = new ValenceUnit({ FE: 3, PT: 'NP', GF: 'Ext' });
    await cNPExt.save();
    const dPPaExt = new ValenceUnit({ FE: 4, PT: 'PP[about]', GF: 'Ext' });
    await dPPaExt.save();
    const dPPaExt2 = new ValenceUnit({ FE: 5, PT: 'PP[about]', GF: 'Ext' });
    await dPPaExt2.save();
    const dPPaExt3 = new ValenceUnit({ FE: 6, PT: 'PP[about]', GF: 'Ext' });
    await dPPaExt3.save();
  });
  after(async () => {
    await mongoose.connection.dropDatabase();
  });
  it('#getValenceUnitsIDs should return an array of ObjectIDs', async () => {
    const vusIDs = await getValenceUnitsIDs([[1], 'NP', 'Obj']);
    vusIDs.forEach(
      vusID => mongoose.Types.ObjectId.isValid(vusID).should.be.true);
  });
  it('#getValenceUnitsIDs should be able to process FE.PT.GF', async () => {
    const vusIDs = await getValenceUnitsIDs([[1], 'NP', 'Obj']);
    const vus = await ValenceUnit.find().where('_id').in(vusIDs);
    vusIDs.length.should.equal(1);
    vus[0].FE.should.equal(1);
    vus[0].PT.should.equal('NP');
    vus[0].GF.should.equal('Obj');
  });
  it('#getValenceUnitsIDs should be able to process FE.PT.GF with multiple FE ids', async () => {
    const vusIDs = await getValenceUnitsIDs([[4, 5, 6], 'PP[about]', 'Ext']);
    const vus = await ValenceUnit.find().where('_id').in(vusIDs);
    vusIDs.length.should.equal(3);
    vus.forEach((vu) => {
      [4, 5, 6].includes(vu.FE).should.be.true;
      vu.PT.should.equal('PP[about]');
      vu.GF.should.equal('Ext');
    });
  });
  it('#getValenceUnitsIDs should be able to process PT.FE.GF', async () => {
    const vusIDs = await getValenceUnitsIDs(['NP', [1], 'Obj']);
    const vus = await ValenceUnit.find().where('_id').in(vusIDs);
    vusIDs.length.should.equal(1);
    vus[0].FE.should.equal(1);
    vus[0].PT.should.equal('NP');
    vus[0].GF.should.equal('Obj');
  });
  it('#getValenceUnitsIDs should be able to process GF.PT.FE', async () => {
    const vusIDs = await getValenceUnitsIDs(['Obj', 'NP', [1]]);
    const vus = await ValenceUnit.find().where('_id').in(vusIDs);
    vusIDs.length.should.equal(1);
    vus[0].FE.should.equal(1);
    vus[0].PT.should.equal('NP');
    vus[0].GF.should.equal('Obj');
  });
  it('#getValenceUnitsIDs should be able to process FE', async () => {
    const vusIDs = await getValenceUnitsIDs([[1]]);
    vusIDs.length.should.equal(1);
  });
  it('#getValenceUnitsIDs should be able to process multiple FE ids', async () => {
    const vusIDs = await getValenceUnitsIDs([[4, 5, 6]]);
    vusIDs.length.should.equal(3);
  });
  it('#getValenceUnitsIDs should be able to process PT', async () => {
    const vusIDs = await getValenceUnitsIDs(['NP']);
    vusIDs.length.should.equal(3);
  });
  it('#getValenceUnitsIDs should be able to process PT.GF', async () => {
    const vusIDs = await getValenceUnitsIDs(['NP', 'Obj']);
    vusIDs.length.should.equal(2);
  });
  it('#getValenceUnitsIDs should be able to process FE.GF', async () => {
    const vusIDs = await getValenceUnitsIDs([[1], 'Obj']);
    vusIDs.length.should.equal(1);
  });
  it('#getValenceUnitsIDs should return an empty array when all tokens are found in the database but not in the given configuration', async () => {
    const vusIDs = await getValenceUnitsIDs([[3], 'PP[about]', 'Obj']);
    vusIDs.length.should.equal(0);
    vusIDs.should.deep.equal([]);
  });
  it('#getValenceUnitsIDs should throw a NotFoundError when a given PT and/or GF is not in the database', async () => {
    try {
      await getValenceUnitsIDs([[3], 'Test']);
    } catch (err) {
      err.name.should.equal('NotFoundError');
      err.message.should.equal('Could not find token in FrameNet database: Test');
    }
  });
  it('#getArrayOfArrayOfValenceUnitsIDs should return an array of ObjectIDs', async () => {
    const vuidss = await getArrayOfArrayOfValenceUnitsIDs([[[1], 'NP', 'Obj'], [[3], 'NP', 'Ext'], [[4], 'PP[about]', 'Ext']]);
    vuidss.forEach(
      vuids => vuids.forEach(
        vuid => mongoose.Types.ObjectId.isValid(vuid).should.be.true));
  });
});
