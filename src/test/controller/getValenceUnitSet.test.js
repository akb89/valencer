'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const mockgoose = require('mockgoose');
const mochagen = require('mocha-generators');
mochagen.install();
const sinon = require('sinon-es6');
const sinonChai = require("sinon-chai");
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(sinonChai);
const should = chai.should();
const expect = chai.expect;

const FastSet = require('collections/fast-set');

const ValenceUnit = require('././valenceUnitModel');

const getController = require('././getController');


describe('getValenceUnitSet', function () {
  before(function*(done) {
    yield mockgoose(mongoose);
    yield mongoose.connect('mongodb://example.com/testDB');
    mockgoose.reset();

    var aNPObj = new ValenceUnit({
      FE: 'A',
      PT: 'NP',
      GF: 'Obj'
    });
    yield aNPObj.save();
    var bNPObj = new ValenceUnit({
      FE: 'B',
      PT: 'NP',
      GF: 'Obj'
    });
    yield bNPObj.save();
    var cNPExt = new ValenceUnit({
      FE: 'C',
      PT: 'NP',
      GF: 'Ext'
    });
    yield cNPExt.save();
    var dPPaExt = new ValenceUnit({
      FE: 'D',
      PT: 'PP[about]',
      GF: 'Ext'
    });
    yield dPPaExt.save();

    return done;
  });
  after(function () {
    mongoose.disconnect();
    mockgoose.reset();
  });
  it('#getValenceUnit should be able to process FE.PT.GF', function *() {
    var set = yield getController._getValenceUnitSet(['A', 'NP', 'Obj']);
    set.length.should.equal(1);
    set.toArray()[0].FE.should.equal('A');
    set.toArray()[0].PT.should.equal('NP');
    set.toArray()[0].GF.should.equal('Obj');

  });
  it('#getValenceUnit should be able to process PT.FE.GF', function *() {
    var set = yield getController._getValenceUnitSet(['NP', 'A', 'Obj']);
    set.length.should.equal(1);
    set.toArray()[0].FE.should.equal('A');
    set.toArray()[0].PT.should.equal('NP');
    set.toArray()[0].GF.should.equal('Obj');
  });
  it('#getValenceUnit should be able to process GF.PT.FE', function *() {
    var set = yield getController._getValenceUnitSet(['Obj', 'NP', 'A']);
    set.length.should.equal(1);
    set.toArray()[0].FE.should.equal('A');
    set.toArray()[0].PT.should.equal('NP');
    set.toArray()[0].GF.should.equal('Obj');
  });
  it('#getValenceUnit should be able to process FE', function *() {
    var set = yield getController._getValenceUnitSet(['A']);
    set.length.should.equal(1);
  });
  it('#getValenceUnit should be able to process PT', function *() {
    var set = yield getController._getValenceUnitSet(['NP']);
    set.length.should.equal(3);
  });
  it('#getValenceUnit should be able to process PT.GF', function *() {
    var set = yield getController._getValenceUnitSet(['NP', 'Obj']);
    set.length.should.equal(2);
  });
  it('#getValenceUnit should be able to process FE.GF', function *() {
    var set = yield getController._getValenceUnitSet(['A', 'Obj']);
    set.length.should.equal(1);
  });
});