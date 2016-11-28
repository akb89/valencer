import { AnnotationSet } from 'noframenet-core';
import getController from './getController';
import config from '../config';

const logger = config.logger;
// TODO : Discuss what should be populated
async function getAll(context) {
  logger.info(`Querying for all annotationSets with a valence pattern matching: ${context.query.vp}`);
  let startTime = process.hrtime();
  const patternSet = await getController.getPatternSet(context.query.preprocessed);
  logger.debug(`PatternSet created in ${process.hrtime(startTime)[1] / 1000000}ms`);
  startTime = process.hrtime();
  context.body = await AnnotationSet
    .find()
    .where('pattern')
    .in(patternSet.toArray())
    .populate({
      path: 'pattern',
      populate: {
        path: 'valenceUnits',
      },
    })
    .populate({
      path: 'sentence',
    })
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
  logger.debug(`Patterns retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

export default {
  getAll,
};
