'use strict';

import bluebird from 'bluebird';
import chai from 'chai';
import mongoose from 'mongoose';
import mockgoose from 'mockgoose';
import { getValenceUnitSet } from './../../main/controllers/getController';
import mochAsync from './../async.test';
import ValenceUnit from './../../main/models/valenceUnit';

mongoose.Promise = bluebird;
const should = chai.should(); // eslint-disable-line no-unused-vars

describe('getController', () => {
  before(mochAsync(async () => {
    await mockgoose(mongoose);
    await mongoose.connect('mongodb://valencer.io/test');
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
  }));
  after(() => {
    mongoose.disconnect();
    mockgoose.reset();
  });
  it('#getValenceUnit should be able to process FE.PT.GF', mochAsync(async () => {
    const set = await getValenceUnitSet(['A', 'NP', 'Obj']);
    set.length.should.equal(1);
    set.toArray()[0].FE.should.equal('A');
    set.toArray()[0].PT.should.equal('NP');
    set.toArray()[0].GF.should.equal('Obj');
  }));
  it('#getValenceUnit should be able to process PT.FE.GF', mochAsync(async () => {
    const set = await getValenceUnitSet(['NP', 'A', 'Obj']);
    set.length.should.equal(1);
    set.toArray()[0].FE.should.equal('A');
    set.toArray()[0].PT.should.equal('NP');
    set.toArray()[0].GF.should.equal('Obj');
  }));
  it('#getValenceUnit should be able to process GF.PT.FE', mochAsync(async () => {
    const set = await getValenceUnitSet(['Obj', 'NP', 'A']);
    set.length.should.equal(1);
    set.toArray()[0].FE.should.equal('A');
    set.toArray()[0].PT.should.equal('NP');
    set.toArray()[0].GF.should.equal('Obj');
  }));
  it('#getValenceUnit should be able to process FE', mochAsync(async () => {
    const set = await getValenceUnitSet(['A']);
    set.length.should.equal(1);
  }));
  it('#getValenceUnit should be able to process PT', mochAsync(async () => {
    const set = await getValenceUnitSet(['NP']);
    set.length.should.equal(3);
  }));
  it('#getValenceUnit should be able to process PT.GF', mochAsync(async () => {
    const set = await getValenceUnitSet(['NP', 'Obj']);
    set.length.should.equal(2);
  }));
  it('#getValenceUnit should be able to process FE.GF', mochAsync(async () => {
    const set = await getValenceUnitSet(['A', 'Obj']);
    set.length.should.equal(1);
  }));
});
