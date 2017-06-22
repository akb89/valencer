const ValenceUnit = require('noframenet-core').ValenceUnit;
const getController = require('./getController');
const ApiError = require('./../exceptions/apiException');
const config = require('../config');

const logger = config.logger;

async function getByNoPopulateID(context) {
  const startTime = process.hrtime();
  const vu = await ValenceUnit
    .findOne()
    .where('_id')
    .equals(context.params.id);
  if (!vu) {
    throw ApiError.NotFoundError(`Could not find ValenceUnit with _id = ${context.params.id}`);
  } else {
    context.body = vu;
    logger.verbose(`ValenceUnit retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
  }
}

async function getByID(context) {
  logger.info(`Querying for ValenceUnit with _id = ${context.params.id}`);
  const populate = context.query.populate === 'true';
  logger.info(`Return populated documents: ${populate}`);
  if (populate) {
    throw ApiError.InvalidQueryParams('There is nothing to populate in a ValenceUnit! Try setting populate to false');
  } else {
    await getByNoPopulateID(context);
  }
}

async function getByNoPopulateVP(context) {
  const vus = await getController.getValenceUnits(context.processedQuery[0]);
  const startTime = process.hrtime();
  logger.info(`${vus.length} unique ValenceUnits found for specified valence: ${JSON.stringify(context.processedQuery[0])}`);
  context.body = vus.sort();
  logger.verbose(`ValenceUnits retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByVP(context) {
  logger.info(`Querying for all ValenceUnits matching: ${context.query.vp}`);
  const populate = context.query.populate === 'true';
  logger.info(`Return populated documents: ${populate}`);
  if (populate) {
    throw ApiError.InvalidQueryParams('There is nothing to populate in a ValenceUnit! Try setting populate to false');
  } else {
    await getByNoPopulateVP(context);
  }
}

module.exports = {
  getByID,
  getByVP,
};
