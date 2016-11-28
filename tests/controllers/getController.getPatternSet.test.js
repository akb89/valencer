import bluebird from 'bluebird';
import chai from 'chai';
import mongoose from 'mongoose';
import mockgoose from 'mockgoose';
import { Pattern, ValenceUnit } from 'noframenet-core';
import getController from './../../controllers/getController';

mongoose.Promise = bluebird;
const should = chai.should(); // eslint-disable-line no-unused-vars

describe('getController#getPatternSet', () => {
  before(async() => {
    await mockgoose(mongoose);
    await mongoose.connect('mongodb://valencer.io/tests');
    mockgoose.reset();
    const aNPObj = new ValenceUnit({
      FE: 'A',
      PT: 'NP',
      GF: 'Obj',
    });
    await aNPObj.save();
    const bNPObj = new ValenceUnit({
      FE: 'B',
      PT: 'NP',
      GF: 'Obj',
    });
    await bNPObj.save();
    const cNPExt = new ValenceUnit({
      FE: 'C',
      PT: 'NP',
      GF: 'Ext',
    });
    await cNPExt.save();
    const dPPaExt = new ValenceUnit({
      FE: 'D',
      PT: 'PP[about]',
      GF: 'Ext',
    });
    await dPPaExt.save();
    const pattern1 = new Pattern({
      valenceUnits: [aNPObj, dPPaExt],
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
      valenceUnits: [aNPObj, bNPObj, cNPExt, dPPaExt],
    });
    await pattern4.save();
  });
  after(() => {
    mongoose.disconnect();
    mockgoose.reset();
  });
  it('#getPatternSet should return the correct number of patterns when processing FE.PT.GF combinations', async () => {
    const patterns = await getController.getPatternSet([['A', 'NP', 'Obj'], ['B', 'NP', 'Obj']]);
    patterns.length.should.equal(3);
  });
  it('#getPatternSet should return the correct number of patterns when processing FE PT.GF', async () => {
    const patterns = await getController.getPatternSet([['A'], ['NP', 'Ext']]);
    patterns.length.should.equal(2);
  });
  it('#getPatternSet should return the correct number of patterns when processing FE combinations', async () => {
    const patterns = await getController.getPatternSet([['D'], ['A']]);
    patterns.length.should.equal(2);
  });
  it('#getPatternSet should return the correct number of patterns when processing PT GF', async () => {
    const patterns = await getController.getPatternSet([['NP'], ['Obj']]);
    patterns.length.should.equal(3);
  });
  it('#getPatternSet should return the correct number of patterns when processing single PT', async () => {
    const patterns = await getController.getPatternSet([['NP']]);
    patterns.length.should.equal(4);
  });
});
