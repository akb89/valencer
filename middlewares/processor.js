/**
 * The core middleware to retrieve FrameNet patterns from the database.
 * This is where the core Valencer algorithm lies.
 * All other FrameNet middlewares are wrappers around core to pass parameters
 * and process the output
 */
const FrameElement = require('noframenet-core').FrameElement;
const Pattern = require('noframenet-core').Pattern;
const ValenceUnit = require('noframenet-core').ValenceUnit;
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
async function getValenceUnitsIDs(valenceUnitAsArrayWithFEids) {
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
  const valenceUnits = await ValenceUnit.find(expVU);
  return valenceUnits.map(vu => vu._id);
}

async function getArrayOfArrayOfValenceUnitsIDs(formattedValencePatternArrayWithFEids) {
  return Promise.all(formattedValencePatternArrayWithFEids.map(
    async valenceUnitAsArrayWithFEids => getValenceUnitsIDs(valenceUnitAsArrayWithFEids))
  );
}

/**
 * Returns an array of array of valenceUnit objects.
 */
async function retrieveValenceUnitsIDs(context, next) {
  context.valencer.results = {};
  context.valencer.results.valenceUnits = await getArrayOfArrayOfValenceUnitsIDs(context.valencer.query.vp.withFEids);
  return next();
}

async function getPatternsIDs(arrayOfArrayOfValenceUnitIDs) {
  let patternsIDs = await Pattern.collection.aggregate([{
    $match: {
      valenceUnits: {
        $in: arrayOfArrayOfValenceUnitIDs[0],
      },
    } }, {
      $project: {
        _id: true,
      },
    }], {
      cursor: {},
    }).map(pattern => pattern._id).toArray();
  //console.log(patternsIDs);
  if (!patternsIDs) {
    return [];
  }
  if (arrayOfArrayOfValenceUnitIDs.length > 1) {
    for (let i = 0; i < arrayOfArrayOfValenceUnitIDs.length; i += 1) {
      for (let j = i + 1; j < arrayOfArrayOfValenceUnitIDs.length; j += 1) {
        const merge = new Set(arrayOfArrayOfValenceUnitIDs[i]);
        for (let k = i + 1; k < j + 1; k += 1) {
          merge.addEach(arrayOfArrayOfValenceUnitIDs[k]);
        }
        const merge = new Set(arrayOfArrayOfValenceUnitIDs[i]);
        merge.addEach(arrayOfArrayOfValenceUnitIDs[j]);
        console.log(`i = ${i} and j = ${j}`);
        console.log([...merge]);
        const test2 = await Pattern.collection.aggregate([{
          $match: {
            _id: {
              $in: patternsIDs,
            },
            $and: [{
              valenceUnits: {
                $in: arrayOfArrayOfValenceUnitIDs[i],
              },
            }, {
              valenceUnits: {
                $in: arrayOfArrayOfValenceUnitIDs[j],
              },
            }],
          },
        }, {
          $unwind: '$valenceUnits',
        }, {
          $match: {
            valenceUnits: {
              $in: [...merge],
            },
          },
        }], {
          cursor: {},
        }).toArray();
        console.log(test2);
        const test = await Pattern.collection.aggregate([{
          $match: {
            _id: {
              $in: patternsIDs,
            },
            $and: [{
              valenceUnits: {
                $in: arrayOfArrayOfValenceUnitIDs[i],
              },
            }, {
              valenceUnits: {
                $in: arrayOfArrayOfValenceUnitIDs[j],
              },
            }],
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
            _id: '$_id',
            count: { $sum: 1 },
          },
        }, {
          $match: {
            count: {
              $gt: k + 1,
            },
          },
        }], {
          cursor: {},
        }).toArray();
        console.log(test);
        const patternsIDsWithCount = await Pattern.collection.aggregate([{
          $match: {
            _id: {
              $in: patternsIDs,
            },
            $and: [{
              valenceUnits: {
                $in: arrayOfArrayOfValenceUnitIDs[i],
              },
            }, {
              valenceUnits: {
                $in: arrayOfArrayOfValenceUnitIDs[j],
              },
            }],
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
            _id: '$_id',
            count: { $sum: 1 },
          },
        }, {
          $match: {
            count: {
              $gte: 2, // replace 2 by n
            },
          },
        }, {
          $group: {
            _id: null,
            patterns: { $addToSet: '$_id' },
            count: { $sum: '$count' },
          },
        }, {
          $match: {
            count: {
              $gt: j,
            },
          },
        }], {
          cursor: {},
        }).toArray();
        console.log(patternsIDsWithCount);
        if (patternsIDsWithCount.length === 0) {
          return [];
        }
        patternsIDs = patternsIDsWithCount[0].patterns;
        const patterns = await Pattern.find().where('_id').in(patternsIDs).populate('valenceUnits');
        console.log(JSON.stringify(patterns, null, 2));
      }
    }
  }
  return patternsIDs;
}

async function _getPatternsIDs(arrayOfArrayOfValenceUnitIDs, queryIdentifier) {
  let tmpatterns = await Pattern.collection.aggregate([{
    $match: {
      valenceUnits: {
        $in: arrayOfArrayOfValenceUnitIDs[0],
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
  if (!tmpatterns) {
    return [];
  }
  if (arrayOfArrayOfValenceUnitIDs.length > 1) {
    await TMPattern.collection.insertMany(tmpatterns, {
      ordered: false,
    });
    let patternsIDs;
    for (let i = 1; i < arrayOfArrayOfValenceUnitIDs.length; i += 1) {
      const merge = new Set(arrayOfArrayOfValenceUnitIDs[i - 1]);
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
      merge.addEach(arrayOfArrayOfValenceUnitIDs[i]);
      patternsIDs = await TMPattern
        .collection
        .aggregate([{
          $match: {
            query: queryIdentifier,
            valenceUnits: {
              $in: arrayOfArrayOfValenceUnitIDs[i],
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
        }).map(tmp => tmp._id).toArray();
      if (!patternsIDs) {
        await TMPattern.deleteMany({
          query: queryIdentifier,
        });
        return [];
      }
    }
    await TMPattern.deleteMany({
      query: queryIdentifier,
    });
    return patternsIDs;
  }
  return tmpatterns.map(tmpattern => tmpattern.pattern);
}

async function retrievePatternsIDs(context, next) {
  const queryIdentifier = new mongoose.Types.ObjectId();
  context.valencer.results.patternsIDs =
    await getPatternsIDs(context.valencer.results.valenceUnitsIDs,
                         queryIdentifier);
  return next();
}

function filterByStrictVUMatching(allPatterns, arrayOfArrayOfValenceUnitIDs) {
  return allPatterns.reduce((filteredPatternsIDs, pattern) => {
    if (pattern.valenceUnits.length === arrayOfArrayOfValenceUnitIDs.length) {
      filteredPatternsIDs.push(pattern._id);
    }
    return filteredPatternsIDs;
  }, []);
}

async function containsExtraCoreFEs(frameElements, frameElementsNames) {
  frameElements.reduce((isExtraCoreFE, frameElement) => !frameElementsNames.has(frameElement.name) && frameElement.coreType === 'Core', false);
}

async function getFrameElements(pattern) {
  return Promise.all(pattern.valenceUnits.map(async (valenceUnitID) => {
    const frameElementID = ValenceUnit.findById(valenceUnitID, { _id: 0, FE: 1 });
    return FrameElement.findById(frameElementID);
  }));
}

function filterByExtraCoreFEs(allPatterns, arrayOfArrayOfValenceUnitIDs) {
  const frameElementsIDs = new Set(
    arrayOfArrayOfValenceUnitIDs.map(async valenceUnitsIDs => await ValenceUnit.findById(valenceUnitsIDs[0]._id, { _id: 0, FE: 1 }))
  );
  const frameElementsNames = new Set(
    frameElementsIDs.map(async frameElementID => await FrameElement.findById(frameElementID, { _id: 0, name: 1 }))
  );
  return allPatterns.reduce(async (filteredPatternsIDs, pattern) => {
    const frameElements = await getFrameElements(pattern);
    if (!containsExtraCoreFEs(frameElements, frameElementsNames)) {
      filteredPatternsIDs.push(pattern._id);
    }
    return filteredPatternsIDs;
  }, []);
}

/**
 * 3 cases have to be taken into account:
 *  - strictVUMatching === true (withExtraCoreFEs not taken into consideration)
 *  - withExtraCoreFEs === true
 *  - withExtraCoreFEs === false
 *  Note that previous validation guarantees that in a
 *  strictVUMatching === false && withExtraCoreFEs === false
 *  configuration there are no unspecified FE in the input valence pattern
 */
async function getFilteredPatternsIDs(allPatternsIDs,
                                      arrayOfArrayOfValenceUnitIDs,
                                      strictVUMatching, withExtraCoreFEs) {
  if (withExtraCoreFEs && !strictVUMatching) {
    // This is the default case: Return all possibilities, regardless of
    // whether or not FEs are core or non-core
    return allPatternsIDs;
  }
  const allPatterns = await Pattern.find().where('_id').in(allPatternsIDs);
  if (!withExtraCoreFEs && !strictVUMatching) {
    // Allow returning patterns with more than the specified VUs, only if
    // those VUs contain non-core FEs. Ex: Donor.NP.Ext Recipient.NP.Obj ->
    // Donor.NP.Ext Recipient.NP.Obj Time.PP[at].Dep as Time is a non-core FE
    // in this particular case
    return filterByExtraCoreFEs(allPatterns, arrayOfArrayOfValenceUnitIDs);
  }
  // strictVUMatching === true
  return filterByStrictVUMatching(allPatterns, arrayOfArrayOfValenceUnitIDs)
}

async function filterPatternsIDs(context, next) {
  context.valencer.results.filteredPatternsIDs = await getFilteredPatternsIDs(context.valencer.results.patternsIDs,
                         context.valencer.results.valenceUnitsIDs,
                         context.query.strictVUMatching,
                         context.query.withExtraCoreFEs);
  return next();
}

module.exports = {
  retrieveValenceUnitsIDs,
  retrievePatternsIDs,
  filterPatternsIDs,
};
