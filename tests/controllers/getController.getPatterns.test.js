import chai from 'chai';
import mongoose from 'mongoose';
import mockgoose from 'mockgoose';
import { Pattern, ValenceUnit } from 'noframenet-core';
import getController from './../../controllers/getController';

const should = chai.should();

describe('getController#getPatterns', () => {
  before(async () => {
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
    const dPPaboutExt = new ValenceUnit({
      FE: 'D',
      PT: 'PP[about]',
      GF: 'Ext',
    });
    await dPPaboutExt.save();
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
      valenceUnits: [aNPObj, bNPObj, cNPExt, dPPaboutExt],
    });
    await pattern4.save();
    const pattern5 = new Pattern({
      valenceUnits: [aNPObj, cNPExt, dPPaboutExt],
    });
    await pattern5.save();
    const pattern6 = new Pattern({
      valenceUnits: [aNPObj, bNPObj, aNPObj, cNPExt],
    });
    await pattern6.save();
  });
  after(() => {
    mongoose.disconnect();
    mockgoose.reset();
  });
  it('#getPatterns should return the correct number of patterns when processing FE.PT.GF combinations', async () => {
    const patterns = await getController.getPatterns([['A', 'NP', 'Obj'], ['B', 'NP', 'Obj']]);
    patterns.length.should.equal(4);
  });
  it('#getPatterns should return the correct number of patterns when processing long FE.PT.GF combinations', async () => {
    const patterns = await getController.getPatterns([['A', 'NP', 'Obj'], ['B', 'NP', 'Obj'], ['C', 'NP', 'Ext'], ['D', 'PP[about]', 'Ext']]);
    patterns.length.should.equal(1);
  });
  it('#getPatterns should return the correct number of patterns when processing FE PT.GF', async () => {
    const patterns = await getController.getPatterns([['A'], ['NP', 'Ext']]);
    patterns.length.should.equal(4);
  });
  it('#getPatterns should return the correct number of patterns when processing FE combinations', async () => {
    const patterns = await getController.getPatterns([['D'], ['A']]);
    patterns.length.should.equal(3);
  });
  it('#getPatterns should return the correct number of patterns when processing single PT', async () => {
    const patterns = await getController.getPatterns([['NP']]);
    patterns.length.should.equal(6);
  });
  it('#getPatterns should return the correct number of patterns when processing PT GF', async () => {
    const patterns = await getController.getPatterns([['NP'], ['Obj']]);
    patterns.length.should.equal(5);
  });
  it('#getPatterns should return the correct number of patterns when processing PT GF PT', async () => {
    const patterns = await getController.getPatterns([['NP'], ['Obj'], ['NP']]);
    patterns.length.should.equal(3);
  });
  it('#getPatterns should return the correct number of patterns when processing up to two PT.GF', async () => {
    const patterns = await getController.getPatterns([['NP', 'Obj'], ['NP', 'Obj']]);
    patterns.length.should.equal(4);
  });
  it('#getPatterns should return the correct number of patterns when processing up to three PT.GF', async () => {
    const patterns = await getController.getPatterns([['NP', 'Obj'], ['NP', 'Obj'], ['NP', 'Obj']]);
    patterns.length.should.equal(1);
  });
  it('#getPatterns should return the correct number of patterns when processing FE PT GF', async () => {
    const patterns = await getController.getPatterns([['A'], ['PP[about]'], ['Ext']]);
    patterns.length.should.equal(2);
  });
  it('#getPatterns should return the correct number of patterns when processing long tokenArrays', async () => {
    const patterns = await getController.getPatterns([['Ext'], ['NP'], ['NP'], ['NP']]);
    patterns.length.should.equal(2);
  });
});
