import { FrameElement, Pattern, ValenceUnit, Set } from 'noframenet-core';
import bluebird from 'bluebird';
import TMPattern from './../models/tmpattern';
import ApiError from './../exceptions/apiException';
import config from './../config';

const Promise = bluebird.Promise;
const logger = config.logger;

/**
 * Retrieve valenceUnit objects from the db matching any combination of
 * FE.PT.GF, in any order, and with potentially unspecified elements:
 * FE.PT.GF / PT.FE.GF / PT.GF / GF.FE / FE / GF etc.
 * @param unit: an array of FE/PT/GF tags: ['FE', 'PT', 'GF'] corresponding to a
 * single valenceUnit inside a tokenArray pattern (@see processor:process)
 */
async function getValenceUnits(unit) {
  logger.debug(`Fetching valence units for unit: ${unit}`);
  logger.debug('Looking for Frame Element');
  const unitWithFEIDs = [];
  for (const token of unit) {
    logger.debug(`Processing token = ${token}`);
    const fes = await FrameElement.find().where('name').equals(token);
    if (fes.length) {
      unitWithFEIDs.add(fes.map(fe => fe._id));
    } else {
      unitWithFEIDs.add(token);
    }
  }
  for (const token of unitWithFEIDs) {
    logger.info(`token = ${token}`);
  }
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
  logger.debug(`expVU = ${JSON.stringify(expVU)}`);
  /*
  if(expVU.FE){

  }else{
    return ValenceUnit.find(expVU);
  }
  return ValenceUnit
    .find({
      FE: {
        $in: expVU.FE,
      },
      PT: expVU.PT,
      GF: expVU.GF,
    });*/
  return ValenceUnit.find(expVU);
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

/**
 * Right now getPatterns only returns patterns matching input exactly.
 * Ultimately, inclusion with non-core FEs should be made available
 * @method getPatterns
 * @param  {[type]}    tokenArray [description]
 * @return {Promise}   [description]
 */
async function getPatterns(tokenArray) {
  let startTime = process.hrtime();
  const valenceUnitsArray = await Promise
    .all(tokenArray
      .map(async unit => await getValenceUnits(unit)));

  logger.verbose(`ValenceUnits retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
  logger.debug(`ValenceUnits.length = ${valenceUnitsArray.length}`);

  startTime = process.hrtime();
  const patterns = await $getPatterns(valenceUnitsArray);
  logger.debug(`Patterns length = ${patterns.length}`);
  // Strict matching of patterns
  const strictMatchingPatterns = patterns.filter(pattern => pattern.valenceUnits.length === tokenArray.length);
  logger.debug(`Strict matching patterns length = ${strictMatchingPatterns.length}`);
  logger.verbose(`Patterns retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
  return patterns;
}

export default {
  getPatterns,
  getValenceUnits,
};
