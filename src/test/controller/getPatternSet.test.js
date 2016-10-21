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

const Pattern = require('././patternModel');
const ValenceUnit = require('././valenceUnitModel');

const getController = require('././getController');

const PatternUtils = require('./../../main/utils/patternUtils');
const ValenceUnitUtils = require('./../../main/utils/valenceUnitUtils');

function preprocess(query) {
  return ValenceUnitUtils.toTokenArray(PatternUtils.toValenceArray(query));
}

describe('getPatternSet', function () {
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

    var pattern1 = new Pattern({
      valenceUnits: [aNPObj, dPPaExt]
    });
    yield pattern1.save();
    var pattern2 = new Pattern({
      valenceUnits: [aNPObj, bNPObj, cNPExt]
    });
    yield pattern2.save();
    var pattern3 = new Pattern({
      valenceUnits: [aNPObj, bNPObj]
    });
    yield pattern3.save();
    var pattern4 = new Pattern({
      valenceUnits: [aNPObj, bNPObj, cNPExt, dPPaExt]
    });
    yield pattern4.save();

    return done;
  });
  after(function () {
    mongoose.disconnect();
    mockgoose.reset();
  });
  it('#getPatternSet', function *() {
    var patterns = yield getController._getPatternSet(preprocess('A.NP.Obj B.NP.Obj'));
    patterns.length.should.equal(3);
  });
  it('#getPatternSet', function *() {
    var patterns = yield getController._getPatternSet(preprocess('A NP.Ext'));
    patterns.length.should.equal(2);
  });
  //FIXME!
  it('#getPatternSet', function *() {
    var patterns = yield getController._getPatternSet(preprocess('NP Obj'));
    patterns.length.should.equal(3);
  });
  it('#getPatternSet', function *() {
    var patterns = yield getController._getPatternSet(preprocess('D A'));
    patterns.length.should.equal(2);
  });
  it('#getPatternSet', function *() {
    var patterns = yield getController._getPatternSet(preprocess('NP'));
    patterns.length.should.equal(4);
  });
});