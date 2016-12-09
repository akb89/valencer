import { Pattern, ValenceUnit, Set } from 'noframenet-core';
import bluebird from 'bluebird';
import TMPattern from './../models/tmpattern';
import { NotFoundException } from './../exceptions/valencerException';
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
  const valenceUnit = {
    FE: undefined,
    PT: undefined,
    GF: undefined,
  };
  for (const token of unit) {
    let found = false;
    for (const key in valenceUnit) {
      if (valenceUnit[key] === undefined) {
        const dbKey = await ValenceUnit
          .findOne({
            [key]: token,
          });
        if (dbKey !== null) {
          valenceUnit[key] = token;
          found = true;
          break;
        }
      }
    }
    if (!found) {
      throw new NotFoundException(`Could not find token in FrameNet database: ${token}`);
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
  return await ValenceUnit
      .find(expVU);
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

async function getPatterns(tokenArray) {
  let startTime = process.hrtime();
  const valenceUnitsArray = await Promise.all(tokenArray
    .map(async unit => await getValenceUnits(unit)));
  logger.verbose(`ValenceUnits created in ${process.hrtime(startTime)[1] / 1000000}ms`);
  startTime = process.hrtime();
  const patterns = await $getPatterns(valenceUnitsArray);
  logger.verbose(`Patterns created in ${process.hrtime(startTime)[1] / 1000000}ms`);
  return patterns;
}

export default {
  getPatterns,
};
