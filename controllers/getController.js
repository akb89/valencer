import { FrameElement, Pattern, ValenceUnit, Set } from 'noframenet-core';
import bluebird from 'bluebird';
import TMPattern from './../models/tmpattern';
import ApiError from './../exceptions/apiException';
import config from './../config';

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
async function $getValenceUnits(unitWithFEIDs) {
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

async function getValenceUnits(unit) {
  const unitWithFEIDs = await getUnitWithFEIDs(unit);
  return $getValenceUnits(unitWithFEIDs);
}

async function $getPatterns(valenceUnitsArray) {
  await Pattern
    .aggregate([{
      $match: {
        valenceUnits: {
          $in: valenceUnitsArray[0].map(vu => vu._id),
        },
      },
    }, {
      $out: '_tmpatterns',
    }]);
  const patterns = await TMPattern.find();
  if (valenceUnitsArray.length > 1) {
    let tmpatterns;
    for (let i = 1; i < valenceUnitsArray.length; i += 1) {
      const merge = new Set();
      for (let j = 0; j < i + 1; j += 1) {
        merge.addEach(valenceUnitsArray[j]);
      }
      const tmp = await TMPattern
        .aggregate([{
          $match: {
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
            _id: '$_id',
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
        }]);
      await Pattern.aggregate([{
        $match: {
          _id: {
            $in: tmp.map(t => t._id),
          },
        },
      }, {
        $out: '_tmpatterns',
      }]);
      tmpatterns = await TMPattern.find();
    }
    return tmpatterns;
  }
  return patterns;
}

function isFullyFormedFEVU(unitWithFEIDs) {
  for (const token of unitWithFEIDs) {
    if (typeof token !== 'string' && (typeof token === 'number' || !token.some(isNaN))) {
      return true;
    }
  }
  return false;
}

// TODO: add unit tests for strictMatching
async function getPatterns(tokenArray, strictVUMatching, withExtraCoreFEs) {
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
  logger.debug(`ValenceUnits.length = ${valenceUnitsArray.length}`);
  startTime = process.hrtime();
  const patterns = await $getPatterns(valenceUnitsArray);
  logger.debug(`Unfiltered patterns length = ${patterns.length}`);
  if (strictVUMatching) {
    const strictMatchingPatterns = patterns.filter(pattern => pattern.valenceUnits.length === tokenArray.length);
    logger.info(`Retrieving patterns stricly matching number of valenceUnits specified in input (#${tokenArray.length})`);
    logger.info(`Filtered patterns length = ${strictMatchingPatterns.length}`);
    logger.verbose(`Patterns retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
    return strictMatchingPatterns;
  }
  if (!fullyFormedFEVU.includes(false)) {
    if (withExtraCoreFEs) {
      // Return all possibilities, regardless of whether or not
      // FEs are core or non-core
      logger.info('Retrieving patterns with non-strict matching and all extra FEs (core and non-core)');
      logger.info(`Filtered patterns length = ${patterns.length}`);
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
    logger.info(`Patterns length = ${validPatterns.length}`);
    logger.verbose(`Patterns retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
    return validPatterns;
  }
  if (withExtraCoreFEs) {
    // Default case to returning all FEs regardless of core or non-core if at
    // least one FE is not specified: fullyFormedFEVU.includes(false) --> true
    logger.info('Retrieving patterns with non-strict matching and all extra FEs (core and non-core)');
    logger.info(`Patterns length = ${patterns.length}`);
    logger.verbose(`Patterns retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
    return patterns;
  }
  // In this case user asked for non-strict matching of vus with only extra
  // non-core FEs, but there is at least one unspecified FE.
  throw ApiError.InvalidQueryParams('The Valencer API cannot process queries with strictVUMatching parameter set to false and withExtraCoreFEs parameter set to false if at least one FE is unspecified in the input Valence Pattern');
}

export default {
  getPatterns,
  getValenceUnits,
};
