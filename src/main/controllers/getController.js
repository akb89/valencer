'use strict';

import Pattern from '../models/pattern';
import ValenceUnit from '../models/valenceUnit';
import { NotFoundException } from '../exceptions/valencerException';
import { Set } from './../utils/setUtils';
import config from '../config';

const logger = config.logger;

/**
 * Retrieve valenceUnit objects from the db matching any combination of FE.PT.GF, in any order,
 * and with potentially unspecified elements:
 * FE.PT.GF / PT.FE.GF / PT.GF / GF.FE / FE / GF etc.
 * @param unit an array of FE/PT/GF tags: ['FE', 'PT', 'GF'] corresponding to a single
 * valenceUnit inside a tokenArray pattern (@see processor:process)
 */
async function getValenceUnitSet(unit) {
  logger.debug(`Fetching valence units for unit: ${unit}`);
  let set = new Set(null);
  const valenceUnit = {
    fe: undefined,
    pt: undefined,
    gf: undefined,
  };
  for (const token of unit) {
    logger.debug(`Processing token: ${token}`);
    if (valenceUnit.fe === undefined) {
      const dbFE = await ValenceUnit.find().where('FE').equals(token);
      if (dbFE.length !== 0) {
        const FE = new Set(dbFE);
        set = set.length === 0 ? FE : set.intersection(FE);
        valenceUnit.fe = token;
        continue; // TODO: find a way to get rid of continue?
      }
    }
    if (valenceUnit.pt === undefined) {
      const dbPT = await ValenceUnit.find().where('PT').equals(token);
      if (dbPT.length !== 0) {
        const PT = new Set(dbPT);
        set = set.length === 0 ? PT : set.intersection(PT);
        valenceUnit.pt = token;
        continue;
      }
    }
    if (valenceUnit.gf === undefined) {
      const dbGF = await ValenceUnit.find().where('GF').equals(token);
      if (dbGF.length !== 0) {
        const GF = new Set(dbGF);
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
  let patternSet = new Set(null);
  for (const unit of processedQuery.tokenArray) {
    const valenceUnitSet = await getValenceUnitSet(unit);
    logger.debug(`ValenceUnitSet.length = ${valenceUnitSet.length}`);
    const dbPatterns = await Pattern.find().where('valenceUnits').in(valenceUnitSet.toArray());
    logger.debug(`Pattern.length = ${dbPatterns.length}`);
    if (dbPatterns.length === 0) {
      throw new NotFoundException(`Could not find patters matching given input in FrameNet database:
                ${processedQuery.query}`);
    }
    const dbPatternSet = new Set(dbPatterns);
    logger.debug(`PatternSet.length = ${dbPatternSet.length}`);
    patternSet = patternSet.length === 0 ? dbPatternSet : patternSet.intersection(dbPatternSet);
  }
  return patternSet;
}

export {
  getValenceUnitSet,
  getPatternSet,
};
