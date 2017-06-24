const chai = require('chai');
const mongoose = require('mongoose');
const rewire = require('rewire');
const FrameElement = require('noframenet-core').FrameElement;
const config = require('./../../config');

const should = chai.should();
const getFrameElementNamesSet = rewire('./../../middlewares/core/valenceUnits').__get__('getFrameElementNamesSet');
const getExcludedFEids = rewire('./../../middlewares/core/valenceUnits').__get__('getExcludedFEids');
mongoose.Promise = require('bluebird');

describe('core.valenceUnits.excluded', () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.dbUri);
    }
    const aFE = new FrameElement({ _id: 1, name: 'A', coreType: 'Core' });
    await aFE.save();
    const bFE = new FrameElement({ _id: 2, name: 'B', coreType: 'Core' });
    await bFE.save();
    const cFE = new FrameElement({ _id: 3, name: 'C', coreType: 'Peripheral' });
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
  });
  after(async () => {
    await mongoose.connection.dropDatabase();
  });
  it('#getFrameElementNamesSet should return the correct set of FE names', async () => {
    const feNamesSet = await getFrameElementNamesSet([[[1], 'NP', 'Obj'], ['NP', [4], 'Ext'], ['PP[about]', 'Dep', [3]]]);
    feNamesSet.size.should.equal(3);
    feNamesSet.has('A').should.be.true;
    feNamesSet.has('C').should.be.true;
    feNamesSet.has('D').should.be.true;
  });
  it('#getExcludedFEids should return the correct Frame Element ids', async () => {
    const excludedFEids = await getExcludedFEids(new Set(['A', 'B', 'C']));
    excludedFEids.length.should.equal(2);
    excludedFEids.includes(4).should.be.true;
    excludedFEids.includes(8).should.be.true;
  });
  it('#getExcludedFEids should return the correct Frame Element ids', async () => {
    const excludedFEids = await getExcludedFEids(new Set(['C', 'D']));
    excludedFEids.length.should.equal(2);
    excludedFEids.includes(1).should.be.true;
    excludedFEids.includes(2).should.be.true;
  });
});
