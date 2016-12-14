import { AnnotationSet, LexUnit } from 'noframenet-core';
import getController from './getController';
import config from '../config';

const logger = config.logger;

async function getByNoPopulateID(context) {
  const startTime = process.hrtime();
  const lexUnit = await LexUnit
    .findOne()
    .where('_id')
    .equals(context.params.id);
  context.body = lexUnit;
  logger.verbose(`LexUnit retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByPopulateID(context) {
  const startTime = process.hrtime();
  const lexUnit = await LexUnit
    .findOne()
    .where('_id')
    .equals(context.params.id)
    .populate([{
      path: 'frame',
      populate: [{
        path: 'lexUnits',
        select: 'name',
      }, {
        path: 'frameElements',
      }],
    }, {
      path: 'lexemes',
    }]);
  context.body = lexUnit;
  logger.verbose(`LexUnit retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByID(context) {
  logger.info(`Querying for LexUnit with _id = ${context.params.id}`);
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
  logger.info(`${lexUnitIDs.length} unique LexUnits found for specified valence pattern: ${context.query.vp}`);
  context.body = lexUnitIDs.sort();
  logger.verbose(`LexUnits retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByPopulateVP(context) {
  const patterns = await getController.getPatterns(context.processedQuery);
  const startTime = process.hrtime();
  const lexUnitIDs = await AnnotationSet
    .find()
    .where('pattern')
    .in(patterns)
    .distinct('lexUnit');
  const lexUnits = await LexUnit
    .find()
    .where('_id')
    .in(lexUnitIDs)
    .populate([{
      path: 'frame',
      populate: [{
        path: 'lexUnits',
        select: 'name',
      }, {
        path: 'frameElements',
      }],
    }, {
      path: 'lexemes',
    }]);
  logger.info(`${lexUnits.length} unique LexUnits found for specified valence pattern: ${context.query.vp}`);
  context.body = lexUnits.sort();
  logger.verbose(`LexUnits retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByVP(context) {
  logger.info(`Querying for all LexUnits with a valence pattern matching: ${context.query.vp}`);
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
