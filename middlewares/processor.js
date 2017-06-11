/**
 * The core middleware to retrieve FrameNet patterns from the database.
 * This is where the core Valencer algorithm lies.
 * All other FrameNet middlewares are wrappers around core to pass parameters
 * and process the output
 */
const FrameElement = require('noframenet-core').FrameElement;
const Pattern = require('noframenet-core').Pattern;
const ValenceUnit = require('noframenet-core').ValenceUnit;
//const Set = require('noframenet-core').Set;
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const TMPattern = require('./../models/tmpattern');
const ApiError = require('./../exceptions/apiException');
const config = require('./../config');

const Promise = bluebird.Promise;
const logger = config.logger;

/**
 * Retrieve an array of valenceUnit objects from the db matching any combination of
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

async function getValenceUnitsArray(formattedValencePatternArrayWithFEids) {
  return Promise.all(formattedValencePatternArrayWithFEids.map(
    async valenceUnitAsArrayWithFEids => getValenceUnits(valenceUnitAsArrayWithFEids))
  );
}

/**
 * Returns an array of array of valenceUnit objects.
 */
async function retrieveValenceUnits(context, next) {
  context.valencer.results = {};
  context.valencer.results.valenceUnits = await getValenceUnitsArray(context.valencer.query.vp.withFEids);
  return next();
}

async function getPatternsIDs(arrayOfArrayOfValenceUnitObjectIDs, queryIdentifier) {
  let tmpatterns = await Pattern.collection.aggregate([{
    $match: {
      valenceUnits: {
        $in: arrayOfArrayOfValenceUnitObjectIDs[0],
      },
    } }, {
      $project: {
        _id: false,
        valenceUnits: true,
        query: queryIdentifier,
        pattern: '$_id',
      },
    }], {
      cursor: {},
    }).toArray();
  console.log(tmpatterns);
  if (arrayOfArrayOfValenceUnitObjectIDs.length > 1) {
    await TMPattern.collection.insertMany(tmpatterns, {
      ordered: false,
    });
    const merge = new Set(arrayOfArrayOfValenceUnitObjectIDs[0]);
    let patternsIDs;
    for (let i = 1; i < arrayOfArrayOfValenceUnitObjectIDs.length; i += 1) {
      if (patternsIDs) {
        await TMPattern.deleteMany({
          query: queryIdentifier,
        });
        tmpatterns = await Pattern.collection.aggregate([{
          $match: {
            _id: {
              $in: patternsIDs,
            },
          } }, {
            $project: {
              _id: false,
              valenceUnits: true,
              query: queryIdentifier,
              pattern: '$_id',
            },
          }], {
            cursor: {},
          }).toArray();
        await TMPattern.collection.insertMany(tmpatterns, {
          ordered: false,
        });
      }
      merge.addEach(arrayOfArrayOfValenceUnitObjectIDs[i]);
      patternsIDs = await TMPattern
        .collection
        .aggregate([{
          $match: {
            query: queryIdentifier,
            valenceUnits: {
              $in: arrayOfArrayOfValenceUnitObjectIDs[i],
            },
          },
        }, {
          $unwind: '$valenceUnits',
        }, {
          $match: {
            valenceUnits: {
              $in: [...merge],
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
        }, {
          $project: {
            _id: '$_id.pattern',
          },
        }], {
          cursor: {},
        }).toArray();
      console.log(patternsIDs);
    }
    await TMPattern.deleteMany({
      query: queryIdentifier,
    });
    return patternsIDs;
  }
  return tmpatterns.map(tmpattern => tmpattern.pattern);
}

async function getPatterns(valenceUnitsArrayOfArray, strictVUMatching, withExtraCoreFEs) {
  const queryIdentifier = new mongoose.Types.ObjectId();
  const patternIDs = await getPatternsIDs(valenceUnitsArrayOfArray, queryIdentifier);
  return Pattern.find().where('_id').in(patternIDs);
}

async function retrievePatterns(context, next) {
  context.valencer.results.patterns =
    await getPatterns(context.valencer.results.valenceUnits,
                      context.query.strictVUMatching,
                      context.query.withExtraCoreFEs);
  return next();
}

module.exports = {
  retrieveValenceUnits,
  retrievePatterns,
};
