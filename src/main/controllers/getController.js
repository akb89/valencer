'use strict';

import FastSet from 'collections/fast-set';
import Pattern from '../models/pattern';
import ValenceUnit from '../models/valenceUnit';
import { NotFoundException } from '../exceptions/valencerException';
import config from '../config';

const logger = config.logger;

async function getValenceUnitSet(unit) {
  logger.debug(`Fetching valence units for unit: ${unit}`);
  let set = new FastSet(null, (a, b) => {
    return a._id.equals(b._id);
  }, (object) => {
    return object._id.toString();
  });
  const valenceUnit = {
    fe: undefined,
    pt: undefined,
    gf: undefined,
  };
  for (const token of unit) {
    logger.debug(`Processing token: ${token}`);
    if (valenceUnit.fe === undefined) {
      var _FE = await ValenceUnit.find().where('FE').equals(token);
      if (_FE.length !== 0) {
        var FE = new FastSet(_FE, function (a, b) {
          return a._id.equals(b._id);
        }, function (object) {
          return object._id.toString();
        });
        set = set.length === 0 ? FE : set.intersection(FE);
        valenceUnit.fe = token;
        continue;
      }
    }
    if (valenceUnit.pt === undefined) {
      var _PT = await ValenceUnit.find().where('PT').equals(token);
      if (_PT.length !== 0) {
        var PT = new FastSet(_PT, function (a, b) {
          return a._id.equals(b._id);
        }, function (object) {
          return object._id.toString();
        });
        set = set.length === 0 ? PT : set.intersection(PT);
        valenceUnit.pt = token;
        continue;
      }
    }
    if (valenceUnit.gf === undefined) {
      var _GF = await ValenceUnit.find().where('GF').equals(token);
      if (_GF.length !== 0) {
        var GF = new FastSet(_GF, function (a, b) {
          return a._id.equals(b._id);
        }, function (object) {
          return object._id.toString();
        });
        set = set.length === 0 ? GF : set.intersection(GF);
        valenceUnit.gf = token;
        continue;
      }
    }
    throw new NotFoundException(`Could not find token in FrameNet database: ${token}`);
  }
  return set;
}

// FIXME for NP ... Obj queries <-- This is a major concern
async function getPatternSet(processedQuery) {
  logger.debug(`Fetching patterns for tokenArray: ${processedQuery.tokenArray.toString()}`);
  var patternSet = new PatternSet();
  for (let unit of processedQuery.tokenArray) {
    var valenceUnitSet = await getValenceUnitSet(unit);
    logger.debug(`ValenceUnitSet.length = ${valenceUnitSet.length}`);
    var _patterns = await Pattern.find().where('valenceUnits').in(valenceUnitSet.toArray());
    logger.debug(`Pattern.length = ${_patterns.length}`);
    if (_patterns.length === 0) {
      throw new NotFoundException(`Could not find patters matching given input in FrameNet database:
                ${processedQuery.query}`);
    }
    var _patternSet = new PatternSet(_patterns);
    logger.debug(`PatternSet.length = ${_patternSet.length}`);
    patternSet = patternSet.length === 0 ? _patternSet : patternSet.intersection(_patternSet);
  }
  return patternSet;
}

export {
  getValenceUnitSet,
  getPatternSet,
};
