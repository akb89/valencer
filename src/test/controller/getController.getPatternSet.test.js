'use strict';

import bluebird from 'bluebird';
import chai from 'chai';
import mongoose from 'mongoose';
import mockgoose from 'mockgoose';
import { getPatternSet } from './../../main/controllers/getController';
import mochAsync from './../async.test';
import Pattern from './../../main/models/pattern';
import ValenceUnit from './../../main/models/valenceUnit';

mongoose.Promise = bluebird;
const should = chai.should(); // eslint-disable-line no-unused-vars

describe('getController', () => {
  before(mochAsync(async() => {
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
  }));
  after(() => {
    mongoose.disconnect();
    mockgoose.reset();
  });
  it('#getPatternSet should return the correct number of patterns when processing FE.PT.GF' +
  ' combinations', mochAsync(async() => {
    const pQuery = {
      query: 'A.NP.Obj B.NP.Obj',
      tokenArray: [['A', 'NP', 'Obj'], ['B', 'NP', 'Obj']],
    };
    const patterns = await getPatternSet(pQuery);
    patterns.length.should.equal(3);
  }));
  it('#getPatternSet should return the correct number of patterns when processing FE PT.GF',
  mochAsync(async() => {
    const pQuery = {
      query: 'A NP.Ext',
      tokenArray: [['A'], ['NP', 'Ext']],
    };
    const patterns = await getPatternSet(pQuery);
    patterns.length.should.equal(2);
  }));
  it('#getPatternSet should return the correct number of patterns when processing PT GF',
  mochAsync(async() => {
    const pQuery = {
      query: 'NP Obj',
      tokenArray: [['NP'], ['Obj']],
    };
    const patterns = await getPatternSet(pQuery);
    patterns.length.should.equal(3);
  }));
  it('#getPatternSet should return the correct number of patterns when processing FE' +
  ' combinations', mochAsync(async() => {
    const pQuery = {
      query: 'D A',
      tokenArray: [['D'], ['A']],
    };
    const patterns = await getPatternSet(pQuery);
    patterns.length.should.equal(2);
  }));
  it('#getPatternSet should return the correct number of patterns when processing single PT',
  mochAsync(async() => {
    const pQuery = {
      query: 'NP',
      tokenArray: [['NP']],
    };
    const patterns = await getPatternSet(pQuery);
    patterns.length.should.equal(4);
  }));
});
