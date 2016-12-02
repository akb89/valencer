import { Pattern, ValenceUnit, Set } from 'noframenet-core';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import { NotFoundException } from './../exceptions/valencerException';
import config from './../config';

const Promise = bluebird.Promise;
const logger = config.logger;

async function getValenceUnits(unit) {
  logger.debug(`Fetching valence units for unit: ${unit}`);
  const vus = await Promise.all(
    unit.map(
      async token => await ValenceUnit
          .find({
            $or: [{
              FE: token,
            }, {
              PT: token,
            }, {
              GF: token,
            }],
          })));
  const notFound = [];
  for (let i = 0; i < vus.length; i += 1) {
    if (vus[i].length === 0) {
      notFound.push(unit[i]);
    }
  }
  if (notFound.length !== 0) {
    // FIXME: unit tests
    /*
    return new Promise.reject(new NotFoundException(`Could not find token(s) in FrameNet database: ${notFound}`));
    throw new NotFoundException(`Could not find token(s) in FrameNet database: ${notFound}`);*/
  }
  return vus.reduce((a, b) => {
    const aSet = new Set(a);
    const bSet = new Set(b);
    return aSet.intersection(bSet).toArray();
  });
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

async function _getPatterns(valenceUnitsArray) {
  await Pattern
    .aggregate([{
      $match: {
        valenceUnits: {
          $in: valenceUnitsArray[0].map(vu => vu._id),
        },
      },
    }, {
      $out: 'tmpatterns',
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
  const patterns = await _getPatterns(valenceUnitsArray);
  logger.verbose(`Patterns created in ${process.hrtime(startTime)[1] / 1000000}ms`);
  return patterns;
}

export default {
  getPatterns,
};
