import { AnnotationSet, Pattern } from 'noframenet-core';
import getController from './getController';
import config from '../config';

const logger = config.logger;

async function getByNoPopulateID(context) {

}

async function getByPopulateID(context) {

}

async function getByID(context) {
  logger.info(`Querying for Pattern with _id = ${context.params.id}`);
  const populate = context.query.populate === 'true';
  logger.info(`Return populated documents: ${populate}`);
  if (populate) {
    await getByPopulateID(context);
  } else {
    await getByNoPopulateID(context);
  }
}

async function getByNoPopulateVP(context) {
  const patterns = await getController.getPatterns(context.processedQuery);
  const startTime = process.hrtime();
  logger.info(`${patterns.length} unique Patterns found for specified valence pattern: ${context.query.vp}`);
  context.body = patterns.sort();
  logger.verbose(`Patterns retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByPopulateVP(context) {
  const patterns = await getController.getPatterns(context.processedQuery);
  const startTime = process.hrtime();
  const outpatterns = await Pattern
    .find()
    .where('_id')
    .in(patterns)
    .populate({
      path: 'valenceUnits',
    });
  logger.info(`${outpatterns.length} unique Patterns found for specified valence pattern: ${context.query.vp}`);
  context.body = outpatterns.sort();
  logger.verbose(`Patterns retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByVP(context) {
  logger.info(`Querying for all Patterns matching: ${context.query.vp}`);
  const populate = context.query.populate === 'true';
  logger.info(`Return populated documents: ${populate}`);
  if (populate) {
    await getByPopulateVP(context);
  } else {
    await getByNoPopulateVP(context);
  }
}

export default {
  getByID,
  getByVP,
};
