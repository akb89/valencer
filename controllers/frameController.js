import { AnnotationSet, Frame, LexUnit } from 'noframenet-core';
import getController from './getController';
import ApiError from './../exceptions/apiException';
import config from '../config';

const logger = config.logger;

async function getByNoPopulateID(context) {
  const startTime = process.hrtime();
  const frame = await Frame
    .findOne()
    .where('_id')
    .equals(context.params.id);
  if (!frame) {
    throw ApiError.NotFoundError(`Could not find Frame with _id = ${context.params.id}`);
  } else {
    context.body = frame;
    logger.verbose(`Frame retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
  }
}

async function getByPopulateID(context) {
  const startTime = process.hrtime();
  const frame = await Frame
    .findOne()
    .where('_id')
    .equals(context.params.id)
    .populate([{
      path: 'lexUnits',
      select: 'name',
    }, {
      path: 'frameElements',
    }, {
      path: 'semTypes',
    }]);
  if (!frame) {
    throw ApiError.NotFoundError(`Could not find Frame with _id = ${context.params.id}`);
  } else {
    context.body = frame;
    logger.verbose(`Frame retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
  }
}

async function getByID(context) {
  logger.info(`Querying for Frame with _id = ${context.params.id}`);
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
  const lexUnitIDs = await AnnotationSet
    .find()
    .where('pattern')
    .in(patterns)
    .distinct('lexUnit');
  const frameIDs = await LexUnit
    .find()
    .where('_id')
    .in(lexUnitIDs)
    .distinct('frame');
  logger.info(`${frameIDs.length} unique Frames found for specified valence pattern: ${context.query.vp}`);
  context.body = frameIDs.sort();
  logger.verbose(`Frames retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByPopulateVP(context) {
  const patterns = await getController.getPatterns(context.processedQuery);
  const startTime = process.hrtime();
  const lexUnitIDs = await AnnotationSet
    .find()
    .where('pattern')
    .in(patterns)
    .distinct('lexUnit');
  const frameIDs = await LexUnit
    .find()
    .where('_id')
    .in(lexUnitIDs)
    .distinct('frame');
  const frames = await Frame
    .find()
    .where('_id')
    .in(frameIDs)
    .populate([{
      path: 'lexUnits',
      select: 'name',
    }, {
      path: 'frameElements',
    }, {
      path: 'semTypes',
    }]);
  logger.info(`${frames.length} unique Frames found for specified valence pattern: ${context.query.vp}`);
  context.body = frames.sort();
  logger.verbose(`Frames retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByVP(context) {
  logger.info(`Querying for all Frames with a valence pattern matching: ${context.query.vp}`);
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
