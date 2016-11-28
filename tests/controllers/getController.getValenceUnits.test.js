import chai from 'chai';
import mongoose from 'mongoose';
import mockgoose from 'mockgoose';
import { ValenceUnit } from 'noframenet-core';
import getController from './../../controllers/getController';

const should = chai.should(); // eslint-disable-line no-unused-vars

describe('getController#getValenceUnits', () => {
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
  it('#getValenceUnits should be able to process a single unit tokenArray', async () => {
    const valenceUnits = await getController.getValenceUnits([['A', 'NP', 'Obj']]);
    valenceUnits.length.should.equal(1);
    valenceUnits[0].toArray().length.should.equal(1);
    valenceUnits[0].toArray()[0].FE.should.equal('A');
    valenceUnits[0].toArray()[0].PT.should.equal('NP');
    valenceUnits[0].toArray()[0].GF.should.equal('Obj');
  });
  it('#getValenceUnits should be able to process a double unit tokenArray', async () => {
    const valenceUnits = await getController.getValenceUnits([['A', 'NP', 'Obj'], ['C', 'NP', 'Ext']]);
    valenceUnits.length.should.equal(2);
    valenceUnits[0].toArray().length.should.equal(1);
    valenceUnits[1].toArray().length.should.equal(1);
    valenceUnits[1].toArray()[0].FE.should.equal('C');
    valenceUnits[1].toArray()[0].PT.should.equal('NP');
    valenceUnits[1].toArray()[0].GF.should.equal('Ext');
  });
  it('#getValenceUnits should be able to process a triple unit tokenArray', async () => {
    const valenceUnits = await getController.getValenceUnits([['A', 'NP', 'Obj'], ['C', 'NP', 'Ext'],
      ['D', 'PP[about]', 'Ext']]);
    valenceUnits.length.should.equal(3);
    valenceUnits[0].toArray().length.should.equal(1);
    valenceUnits[1].toArray().length.should.equal(1);
    valenceUnits[2].toArray().length.should.equal(1);
    valenceUnits[2].toArray()[0].FE.should.equal('D');
    valenceUnits[2].toArray()[0].PT.should.equal('PP[about]');
    valenceUnits[2].toArray()[0].GF.should.equal('Ext');
  });
  it('#getValenceUnits should be able to retrieve all valenceUnits matching a PT', async () => {
    const valenceUnits = await getController.getValenceUnits([['NP']]);
    valenceUnits.length.should.equal(1);
    valenceUnits[0].length.should.equal(3);
  });
  it('#getValenceUnits should be able to retrieve all valenceUnits matching a PT GF', async () => {
    const valenceUnits = await getController.getValenceUnits([['NP'], ['Ext']]);
    valenceUnits.length.should.equal(2);
    valenceUnits[0].length.should.equal(3);
    valenceUnits[1].length.should.equal(2);
  });
});
