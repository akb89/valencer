import { AnnotationSet } from 'noframenet-core';
import { getPatternSet } from './getController';
import config from '../config';

const logger = config.logger;
// TODO : Discuss what should be populated
async function getAll(context) {
  const query = context.query.vp;
  logger.info(`Querying for all annotationSets with a valence pattern matching: ${query}`);
  let startTime = process.hrtime();
  // let patternSet = await getPatternSet(query);
  logger.info(`PatternSet created in ${process.hrtime(startTime)[1] / 1000000}ms`);
  startTime = process.hrtime();
  // console.log(patternSet);
  context.body = await AnnotationSet
    .find()
    // .where('pattern')
    // .in(patternSet.toArray())
    .where('_id')
    .equals(1632555)
    .populate({
      path: 'pattern',
      populate: {
        path: 'valenceUnits',
      },
    })
    .populate({
      path: 'sentence',
    })
    // .select('sentence')
    .populate({
      path: 'lexUnit',
      populate: {
        path: 'frame',
        populate: [{
          path: 'lexUnits',
          select: 'name',
        }, {
          path: 'frameElements',
        }],
      },
    })
    .populate({
      path: 'labels',
    });
  logger.info(`Patterns retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

export default {
  getAll,
};
