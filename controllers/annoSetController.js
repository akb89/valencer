import { AnnotationSet } from 'noframenet-core';
import getController from './getController';
import config from '../config';

const logger = config.logger;
// TODO : Discuss what should be populated
async function getAll(context) {
  logger.info(`Querying for all annotationSets with a valence pattern matching: ${context.query.vp}`);
  const patterns = await getController.getPatterns(context.query.preprocessed);
  const startTime = process.hrtime();
  context.body = await AnnotationSet
    .find()
    .where('pattern')
    .in(patterns)
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
  logger.verbose(`Patterns retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

export default {
  getAll,
};
