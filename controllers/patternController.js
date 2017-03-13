import { Pattern } from 'noframenet-core';
import getController from './getController';
import ApiError from './../exceptions/apiException';
import config from '../config';

const logger = config.logger;

async function getByNoPopulateID(context) {
  const startTime = process.hrtime();
  const pattern = await Pattern
    .findOne()
    .where('_id')
    .equals(context.params.id);
  if (!pattern) {
    throw ApiError.NotFoundError(`Could not find Pattern with _id = ${context.params.id}`);
  } else {
    context.body = pattern;
    logger.verbose(`Pattern retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
  }
}

async function getByPopulateID(context) {
  const startTime = process.hrtime();
  const pattern = await Pattern
    .findOne()
    .where('_id')
    .equals(context.params.id)
    .populate({
      path: 'valenceUnits',
    });
  if (!pattern) {
    throw ApiError.NotFoundError(`Could not find Pattern with _id = ${context.params.id}`);
  } else {
    context.body = pattern;
    logger.verbose(`Pattern retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
  }
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
  const strictMatching = context.query.strictMatching !== 'false';
  const patterns = await getController.getPatterns(context.processedQuery, strictMatching);
  const startTime = process.hrtime();
  logger.info(`${patterns.length} unique Patterns found for specified valence pattern: ${context.query.vp}`);
  context.body = patterns.sort();
  logger.verbose(`Patterns retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByPopulateVP(context) {
  const strictMatching = context.query.strictMatching !== 'false';
  const patterns = await getController.getPatterns(context.processedQuery, strictMatching);
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
