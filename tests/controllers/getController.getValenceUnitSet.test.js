import chai from 'chai';
import mongoose from 'mongoose';
import mockgoose from 'mockgoose';
import { ValenceUnit } from 'noframenet-core';
import getController from './../../controllers/getController';

const should = chai.should(); // eslint-disable-line no-unused-vars

describe('getController#getValenceUnitSet', () => {
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
    const dPPaExt = new ValenceUnit({
      FE: 'D',
      PT: 'PP[about]',
      GF: 'Ext',
    });
    await dPPaExt.save();
  });
  after(() => {
    mongoose.disconnect();
    mockgoose.reset();
  });
  it('#getValenceUnitSet should be able to process FE.PT.GF', async () => {
    const set = await getController.getValenceUnitSet(['A', 'NP', 'Obj']);
    set.length.should.equal(1);
    set.toArray()[0].FE.should.equal('A');
    set.toArray()[0].PT.should.equal('NP');
    set.toArray()[0].GF.should.equal('Obj');
  });
  it('#getValenceUnitSet should be able to process PT.FE.GF', async () => {
    const set = await getController.getValenceUnitSet(['NP', 'A', 'Obj']);
    set.length.should.equal(1);
    set.toArray()[0].FE.should.equal('A');
    set.toArray()[0].PT.should.equal('NP');
    set.toArray()[0].GF.should.equal('Obj');
  });
  it('#getValenceUnitSet should be able to process GF.PT.FE', async () => {
    const set = await getController.getValenceUnitSet(['Obj', 'NP', 'A']);
    set.length.should.equal(1);
    set.toArray()[0].FE.should.equal('A');
    set.toArray()[0].PT.should.equal('NP');
    set.toArray()[0].GF.should.equal('Obj');
  });
  it('#getValenceUnitSet should be able to process FE', async () => {
    const set = await getController.getValenceUnitSet(['A']);
    set.length.should.equal(1);
  });
  it('#getValenceUnitSet should be able to process PT', async () => {
    const set = await getController.getValenceUnitSet(['NP']);
    set.length.should.equal(3);
  });
  it('#getValenceUnitSet should be able to process PT.GF', async () => {
    const set = await getController.getValenceUnitSet(['NP', 'Obj']);
    set.length.should.equal(2);
  });
  it('#getValenceUnitSet should be able to process FE.GF', async () => {
    const set = await getController.getValenceUnitSet(['A', 'Obj']);
    set.length.should.equal(1);
  });
});
