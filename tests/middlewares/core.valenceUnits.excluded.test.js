const chai = require('chai');
const mongoose = require('mongoose');
const rewire = require('rewire');
const FrameElement = require('noframenet-core').FrameElement;
const ValenceUnit = require('noframenet-core').ValenceUnit;
const config = require('./../../config');
mongoose.Promise = require('bluebird');

const should = chai.should();
const getFrameElementNamesSet = rewire('./../../middlewares/core/valenceUnits').__get__('getFrameElementNamesSet');
const getExcludedFEids = rewire('./../../middlewares/core/valenceUnits').__get__('getExcludedFEidsWithFEmodel')(FrameElement);
const getExcludedVUids = rewire('./../../middlewares/core/valenceUnits').__get__('getExcludedVUidsWithVUmodel')(ValenceUnit);

describe('core.valenceUnits.excluded', () => {
  let aFE;
  let bFE;
  let cFE;
  let aNPObj;
  let bNPObj;
  let cNPExt;
  let dPPaboutExt;
  let eSfinADJ;
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.dbUri, { useMongoClient: true });
    }
    aFE = new FrameElement({ _id: 1, name: 'A', coreType: 'Core' });
    await aFE.save();
    bFE = new FrameElement({ _id: 2, name: 'B', coreType: 'Core' });
    await bFE.save();
    cFE = new FrameElement({ _id: 3, name: 'C', coreType: 'Peripheral' });
    await cFE.save();
    const dFE = new FrameElement({ _id: 4, name: 'D', coreType: 'Core' });
    await dFE.save();
    const a5FE = new FrameElement({ _id: 5, name: 'A', coreType: 'Peripheral' });
    await a5FE.save();
    const b6FE = new FrameElement({ _id: 6, name: 'B', coreType: 'Peripheral' });
    await b6FE.save();
    const c7FE = new FrameElement({ _id: 7, name: 'C', coreType: 'Peripheral' });
    await c7FE.save();
    const d8FE = new FrameElement({ _id: 8, name: 'D', coreType: 'Core' });
    await d8FE.save();
    const a9FE = new FrameElement({ _id: 9, name: 'A', coreType: 'Peripheral' });
    await a9FE.save();
    const b10FE = new FrameElement({ _id: 10, name: 'B', coreType: 'Peripheral' });
    await b10FE.save();
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
  });
  after(async () => {
    await mongoose.connection.dropDatabase();
  });
  it('#getFrameElementNamesSet should return the correct set of FrameElement names', async () => {
    const formattedVPquery = [['A', 'NP', 'Obj'], ['NP', 'D', 'Ext'], ['PP[about]', 'Dep', 'C']];
    const vpQueryWithFEids = [[[1], 'NP', 'Obj'], ['NP', [4], 'Ext'], ['PP[about]', 'Dep', [3]]];
    const feNamesSet = await getFrameElementNamesSet(formattedVPquery,
                                                     vpQueryWithFEids);
    feNamesSet.size.should.equal(3);
    feNamesSet.has('A').should.be.true;
    feNamesSet.has('C').should.be.true;
    feNamesSet.has('D').should.be.true;
  });
  it('#getExcludedFEids should return an array of Numbers', async () => {
    const excludedFEids = await getExcludedFEids(new Set(['A', 'B', 'C']));
    excludedFEids.forEach(excludedFEid => (typeof excludedFEid).should.equal(
      'number'));
  });
  it('#getExcludedFEids should return the correct FrameElement ids', async () => {
    const excludedFEids = await getExcludedFEids(new Set(['A', 'B', 'C']));
    excludedFEids.length.should.equal(2);
    excludedFEids.includes(4).should.be.true;
    excludedFEids.includes(8).should.be.true;
  });
  it('#getExcludedFEids should return the correct FrameElement ids', async () => {
    const excludedFEids = await getExcludedFEids(new Set(['C', 'D']));
    excludedFEids.length.should.equal(2);
    excludedFEids.includes(1).should.be.true;
    excludedFEids.includes(2).should.be.true;
  });
  it('#getExcludedVUids should return an array of ObjectIDs', async () => {
    const excludedVUids = await getExcludedVUids([aFE._id, bFE._id, cFE._id]);
    excludedVUids.forEach(excludedVUid => mongoose.Types.ObjectId.isValid(
      excludedVUid).should.be.true);
  });
  it('#getExcludedVUids should return the correct ValenceUnit ids', async () => {
    const excludedVUids = await getExcludedVUids([aFE._id, bFE._id, cFE._id]);
    excludedVUids.length.should.equal(3);
  });
});
