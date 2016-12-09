import { AnnotationSet } from 'noframenet-core';
import getController from './getController';
import config from '../config';

const logger = config.logger;
// TODO : Discuss what should be populated

async function getByID(context) {
  logger.info(`Querying for AnnotationSet with _id = ${context.params.id}`);
  const startTime = process.hrtime();
  context.body = await AnnotationSet
    .findOne()
    .where('_id')
    .equals(context.params.id);
  logger.verbose(`AnnotationSets retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByNoPopulateVP(context) {
  const patterns = await getController.getPatterns(context.query.preprocessed);
  const startTime = process.hrtime();
  context.body = await AnnotationSet
    .find()
    .where('pattern')
    .in(patterns);
  logger.verbose(`AnnotationSets retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByPopulateVP(context) {
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
  logger.verbose(`AnnotationSets retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByVP(context) {
  logger.info(`Querying for all AnnotationSets with a valence pattern matching: ${context.query.vp}`);
  logger.info(`Return populated documents: ${context.query.populate}`);
  if (context.query.populate) {
    await getByPopulateVP(context);
  } else {
    await getByNoPopulateVP(context);
  }
}

export default {
  getByID,
  getByVP,
};
