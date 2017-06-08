/**
 * The core middleware to retrieve FrameNet patterns from the database.
 * This is where the core Valencer algorithm lies.
 * All other FrameNet middlewares are wrappers around core to pass parameters
 * and process the output
 */
const FrameElement = require('noframenet-core').FrameElement;
const Pattern = require('noframenet-core').Pattern;
const ValenceUnit = require('noframenet-core').ValenceUnit;
const Set = require('noframenet-core').Set;
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const TMPattern = require('./../models/tmpattern');
const ApiError = require('./../exceptions/apiException');
const config = require('./../config');

const Promise = bluebird.Promise;
const logger = config.logger;

/**
 * Retrieve valenceUnit objects from the db matching any combination of
 * FE.PT.GF, in any order, and with potentially unspecified elements:
 * FE.PT.GF / PT.FE.GF / PT.GF / GF.FE / FE / GF etc.
 * @param unit: an array of FE/PT/GF tags: ['FE', 'PT', 'GF'] corresponding to a
 * single valenceUnit inside a tokenArray pattern (@see formatter)
 */
async function getValenceUnits(valenceUnitAsArrayWithFEids) {
  const valenceUnit = {
    FE: undefined,
    PT: undefined,
    GF: undefined,
  };
  for (const token of valenceUnitAsArrayWithFEids) {
    let found = false;
    for (const key in valenceUnit) {
      if (valenceUnit[key] === undefined) {
        try {
          const dbKey = await ValenceUnit
            .findOne({
              [key]: {
                $in: token,
              },
            });
          if (dbKey !== null) {
            valenceUnit[key] = token;
            found = true;
            break;
          }
        } catch (err) {
          logger.debug('Invalid combination of units');
        }
      }
    }
    if (!found) {
      throw ApiError.NotFoundError(`Could not find token in FrameNet database: ${token}`);
    }
  }
  const expVU = {};
  if (valenceUnit.FE !== undefined) {
    expVU.FE = valenceUnit.FE;
  }
  if (valenceUnit.PT !== undefined) {
    expVU.PT = valenceUnit.PT;
  }
  if (valenceUnit.GF !== undefined) {
    expVU.GF = valenceUnit.GF;
  }
  return ValenceUnit.find(expVU);
}

async function getValenceUnitsArray(formattedValencePatternArrayWithFEids){
  return Promise.all(formattedValencePatternArrayWithFEids.map(
    async valenceUnitAsArrayWithFEids => getValenceUnits(valenceUnitAsArrayWithFEids))
  );
}

/**
 * Returns an array of array of valenceUnit objects.
 * @method retrieveValenceUnits
 * @param  {[type]}             context [description]
 * @param  {Function}           next    [description]
 * @return {[type]}             [description]
 */
async function retrieveValenceUnits(context, next) {
  context.valencer.results.valenceUnitsArray =
    await getValenceUnitsArray(context.valencer.query.vp.withFEids);
  return next();
}

async function getAllPatterns(valenceUnitsArray, queryIdentifier){

}

async function getPatterns(valenceUnitsArray, strictVUMatching, withExtraCoreFEs){
  const queryIdentifier = new mongoose.Types.ObjectId();
  const allPatterns = await getAllPatterns(valenceUnitsArray, queryIdentifier);
  if (strictVUMatching) {
    const strictMatchingPatterns = allPatterns
      .filter(pattern => pattern.valenceUnits.length === valenceUnitsArray.length);
    return strictMatchingPatterns.map(pattern => pattern.pattern);
  }
}

async function retrievePatterns(context, next) {
  context.valencer.results.patterns =
    await getPatterns(context.valencer.results.valenceUnitsArray,
                      context.valencer.query.params.strictVUMatching,
                      context.valencer.query.params.withExtraCoreFEs);
  return next();
}

module.exports = {
  retrieveValenceUnits,
  retrievePatterns,
};
