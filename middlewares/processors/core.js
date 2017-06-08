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
const TMPattern = require('./../../models/tmpattern');
const ApiError = require('./../../exceptions/apiException');
const config = require('./../../config');

const Promise = bluebird.Promise;
const logger = config.logger;

async function getUnitWithFEIDs(unit) {
  const unitWithFEIDs = [];
  for (const token of unit) {
    const fes = await FrameElement.find().where('name').equals(token);
    if (fes.length) {
      unitWithFEIDs.add(fes.map(fe => fe._id));
    } else {
      unitWithFEIDs.add(token);
    }
  }
  return unitWithFEIDs;
}

/**
 * Retrieve valenceUnit objects from the db matching any combination of
 * FE.PT.GF, in any order, and with potentially unspecified elements:
 * FE.PT.GF / PT.FE.GF / PT.GF / GF.FE / FE / GF etc.
 * @param unit: an array of FE/PT/GF tags: ['FE', 'PT', 'GF'] corresponding to a
 * single valenceUnit inside a tokenArray pattern (@see processor:process)
 */
async function getValenceUnits(unitWithFEIDs) {
  const valenceUnit = {
    FE: undefined,
    PT: undefined,
    GF: undefined,
  };
  for (const token of unitWithFEIDs) {
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

async function _getValenceUnits(unit) {
  const unitWithFEIDs = await getUnitWithFEIDs(unit);
  return $getValenceUnits(unitWithFEIDs);
}

function isFullyFormedFEVU(unitWithFEIDs) {
  for (const token of unitWithFEIDs) {
    if (typeof token !== 'string' && (typeof token === 'number' || !token.some(isNaN))) {
      return true;
    }
  }
  return false;
}

async function setValenceUnits(context) {
  context.query.containsUnspecifiedFE = false;
  context.valenceUnits = await Promise
    .all(tokenArray
      .map(async (unit) => {
        const unitWithFEIDs = await getUnitWithFEIDs(unit);
        if (!isFullyFormedFEVU(unitWithFEIDs)) {
          context.query.containsUnspecifiedFE = true;
        }
        return getValenceUnits(unitWithFEIDs);
      }));
}

async function $getPatterns(valenceUnitsArray, queryIdentifier) {
  const $tmpatterns = await Pattern
    .collection
    .aggregate([{
      $match: {
        valenceUnits: {
          $in: valenceUnitsArray[0].map(vu => vu._id),
        },
      },
    }], {
      cursor: {},
    }).toArray();
  await TMPattern.insertMany($tmpatterns.map(($tmpattern) => {
    const tmpinstance = new TMPattern({
      valenceUnits: $tmpattern.valenceUnits,
      query: queryIdentifier,
      pattern: $tmpattern._id,
    });
    return tmpinstance;
  }));
  const patterns = await TMPattern.find({
    query: queryIdentifier,
  });
  if (valenceUnitsArray.length > 1) {
    let tmpatterns;
    for (let i = 1; i < valenceUnitsArray.length; i += 1) {
      const merge = new Set();
      for (let j = 0; j < i + 1; j += 1) {
        merge.addEach(valenceUnitsArray[j]);
      }
      const tmp = await TMPattern
        .collection
        .aggregate([{
          $match: {
            query: queryIdentifier,
            valenceUnits: {
              $in: valenceUnitsArray[i].map(vu => vu._id),
            },
          },
        }, {
          $unwind: '$valenceUnits',
        }, {
          $match: {
            valenceUnits: {
              $in: merge.toArray()
                .map(vu => vu._id),
            },
          },
        }, {
          $group: {
            _id: {
              pattern: '$pattern',
            },
            count: {
              $sum: 1,
            },
          },
        }, {
          $match: {
            count: {
              $gte: i + 1,
            },
          },
        }], {
          cursor: {},
        }).toArray();
      const $patterns = await Pattern
        .collection
        .aggregate([{
          $match: {
            _id: {
              $in: tmp.map(t => t._id.pattern),
            },
          },
        }], {
          cursor: {},
        }).toArray();
      await TMPattern.deleteMany({
        query: queryIdentifier,
      });
      await TMPattern.insertMany($patterns.map(($pattern) => {
        const tmpinstance = new TMPattern({
          valenceUnits: $pattern.valenceUnits,
          query: queryIdentifier,
          pattern: $pattern._id,
        });
        return tmpinstance;
      }));
      tmpatterns = await TMPattern.find({
        query: queryIdentifier,
      });
    }
    await TMPattern.deleteMany({
      query: queryIdentifier,
    });
    return tmpatterns;
  }
  await TMPattern.deleteMany({
    query: queryIdentifier,
  });
  return patterns;
}

async function getTMPatterns(tokenArray, strictVUMatching, withExtraCoreFEs) {
  let startTime = process.hrtime();
  const fullyFormedFEVU = [];
  const valenceUnitsArray = await Promise
    .all(tokenArray
      .map(async (unit) => {
        const unitWithFEIDs = await getUnitWithFEIDs(unit);
        fullyFormedFEVU.add(isFullyFormedFEVU(unitWithFEIDs));
        return $getValenceUnits(unitWithFEIDs);
      }));
  logger.verbose(`ValenceUnits retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
  logger.debug(`Number of valenceUnits = ${valenceUnitsArray.length}`);
  startTime = process.hrtime();
  const queryIdentifier = new mongoose.Types.ObjectId();
  const patterns = await $getPatterns(valenceUnitsArray, queryIdentifier);
  logger.debug(`Number of unfiltered patterns = ${patterns.length}`);
  if (patterns.length === 0) {
    const vp = tokenArray.map(unitArray => unitArray.join('.')).join(' ');
    logger.warn(`No patterns found for valence pattern = ${vp}`);
  }
  if (strictVUMatching) {
    const strictMatchingPatterns = patterns
      .filter(pattern => pattern.valenceUnits.length === tokenArray.length);
    logger.info(`Retrieving patterns stricly matching number of valenceUnits specified in input (#${tokenArray.length})`);
    logger.info(`Number of filtered patterns = ${strictMatchingPatterns.length}`);
    logger.verbose(`Patterns retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
    return strictMatchingPatterns;
  }
  if (!fullyFormedFEVU.includes(false)) {
    if (withExtraCoreFEs) {
      // Return all possibilities, regardless of whether or not
      // FEs are core or non-core
      logger.info('Retrieving patterns with non-strict matching and all extra FEs (core and non-core)');
      logger.info(`Number of filtered patterns = ${patterns.length}`);
      logger.verbose(`Patterns retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
      return patterns;
    }
    // We allow returning patterns with more than the specified VUs, only if
    // those VUs contain non-core FEs. Ex: Donor.NP.Ext Recipient.NP.Obj ->
    // Donor.NP.Ext Recipient.NP.Obj Time.PP[at].Dep as Time is a non-core FE
    // in this particular case
    const flatTokenArray = Array.prototype.concat.apply([], tokenArray);
    const validPatterns = [];
    for (const pattern of patterns) {
      let isValidPattern = true;
      for (const vuID of pattern.valenceUnits) {
        const valenceUnit = await ValenceUnit.findOne().where('_id').equals(vuID);
        const fe = await FrameElement.findOne().where('_id').equals(valenceUnit.FE);
        if (!flatTokenArray.includes(fe.name) && fe.coreType === 'Core') {
          isValidPattern = false;
        }
      }
      if (isValidPattern) {
        validPatterns.add(pattern);
      }
    }
    logger.info('Retreiving patterns with non-strict matching and non-core FEs');
    logger.info(`Number of patterns = ${validPatterns.length}`);
    logger.verbose(`Patterns retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
    return validPatterns;
  }
  if (withExtraCoreFEs) {
    // Default case: returns all FEs regardless of core or non-core if at
    // least one FE is not specified: fullyFormedFEVU.includes(false) --> true
    logger.info('Retrieving patterns with non-strict matching and all extra FEs (core and non-core)');
    logger.info(`Number of patterns = ${patterns.length}`);
    logger.verbose(`Patterns retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
    return patterns;
  }
  // In this case user asked for non-strict matching of vus with only extra
  // non-core FEs, but there is at least one unspecified FE.
  throw ApiError.InvalidQueryParams('The Valencer API cannot process queries with strictVUMatching parameter set to false and withExtraCoreFEs parameter set to false if at least one FE is unspecified in the input Valence Pattern');
}

async function getPatterns(tokenArray, strictVUMatching, withExtraCoreFEs) {
  const tmpatterns = await getTMPatterns(tokenArray, strictVUMatching, withExtraCoreFEs);
  return Pattern.find().where('_id').in(tmpatterns.map(tmpattern => tmpattern.pattern));
}

module.exports = {
  getPatterns,
  getValenceUnits,
};
