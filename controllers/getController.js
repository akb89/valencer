import { Pattern, ValenceUnit, Set } from 'noframenet-core';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import { NotFoundException } from './../exceptions/valencerException';
import config from './../config';

const Promise = bluebird.Promise;
const logger = config.logger;

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

const patternSchema = mongoose.Schema({
  valenceUnits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ValenceUnit',
  }],
});

patternSchema.index({
  valenceUnits: 1,
});

const TMPattern = mongoose.model('TMPattern', patternSchema);

async function getPatterns(tokenArray) {
  const valenceUnitsArray = await Promise.all(tokenArray
    .map(async unit => await getValenceUnits(unit)));
  console.log('Processing = ' + tokenArray);
  const patterns = await Pattern
    .aggregate([{
      $match: {
        valenceUnits: {
          $in: valenceUnitsArray[0].map(vu => vu._id),
        },
      },
    }, {
      $out: 'tmpatterns',
    }]);
  console.log('FIRST ROUND');
  const test = await TMPattern.find().populate({
    path: 'valenceUnits',
  });
  console.log(test.toString());
  if (tokenArray.length > 1) {
    let test3;
    for (let i = 1; i < tokenArray.length; i += 1) {
      console.log('NEXT ROUND = ' + tokenArray[i]);
      const merge = new Set();
      for (let j = 0; j < i + 1; j += 1) {
        merge.addEach(valenceUnitsArray[j]);
      //valenceUnitsArray[j].forEach(vu => merge.add(vu));
      //array.push(...valenceUnitsArray[j].map(vu => vu._id));
      }
      console.log('MERGE = ' + merge.length);
      console.log(merge.toJSON());
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
              $in: merge.toArray().map(vu => vu._id),
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
        $out: 'tmpatterns',
      }]);
      const test2 = await TMPattern.find();
      console.log('TMPatterns');
      console.log(test2);
      test3 = await Pattern.find().where('_id').in(test2).populate({
        path: 'valenceUnits'
      });
      console.log('Patterns');
      console.log(test3.toString());
    }
    console.log('FINAL ROUND');
    console.log(test3.toString());
    return test3;
  }
  return test;
}

export default {
  getPatterns,
};
