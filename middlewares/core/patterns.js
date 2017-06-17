/**
 * The core middleware to retrieve FrameNet patterns from the database.
 * This is where the core Valencer algorithm lies.
 * All other FrameNet middlewares are wrappers around core to pass parameters
 * and process the output
 */
const Pattern = require('noframenet-core').Pattern;
const config = require('./../../config');
const utils = require('./../../utils/utils');

const logger = config.logger;

async function getPatternsIDs(arrayOfArrayOfValenceUnitIDs) {
  if (arrayOfArrayOfValenceUnitIDs.length === 1) {
    return Pattern.collection.aggregate([{
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
  }
  let patternsIDs;
  for (let i = arrayOfArrayOfValenceUnitIDs.length; i > 1; i -= 1) {
    const combinations = utils.getKNCombinations(i, arrayOfArrayOfValenceUnitIDs.length);
    for (const combination of combinations) {
      const merge = new Set();
      for (let k = 0; k < combination.length; k += 1) {
        merge.addEach(arrayOfArrayOfValenceUnitIDs[combination[k]]);
        if (!patternsIDs) {
          patternsIDs = await Pattern.collection.aggregate([{
            $match: { valenceUnits: { $in: arrayOfArrayOfValenceUnitIDs[combination[k]] } } }, {
              $project: { _id: true },
            }]).map(tmp => tmp._id).toArray();
          if (patternsIDs.length === 0) {
            return patternsIDs;
          }
        } else {
          patternsIDs = await Pattern.collection.aggregate([{
            $match: {
              _id: { $in: patternsIDs },
              valenceUnits: { $in: arrayOfArrayOfValenceUnitIDs[combination[k]] } } }, {
                $project: { _id: true },
              }]).map(tmp => tmp._id).toArray();
          if (patternsIDs.length === 0) {
            return patternsIDs;
          }
        }
      }
      const mergeArray = [...merge];
      patternsIDs = await Pattern.collection.aggregate([{
        $match: { _id: { $in: patternsIDs } },
      }, {
        $unwind: '$valenceUnits',
      }, {
        $match: { valenceUnits: { $in: mergeArray } },
      }, {
        $group: {
          _id: '$_id',
          count: { $sum: 1 },
        },
      }, {
        $match: { count: { $gte: i } },
      }, {
        $project: { _id: true },
      }], {
        cursor: {},
      }).map(tmp => tmp._id).toArray();
      if (patternsIDs.length === 0) {
        return patternsIDs;
      }
    }
  }
  return patternsIDs;
}

async function retrievePatternsIDs(context, next) {
  context.valencer.results.patternsIDs =
    await getPatternsIDs(context.valencer.results.valenceUnitsIDs);
  return next();
}

module.exports = {
  retrievePatternsIDs,
};
