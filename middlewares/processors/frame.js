const Frame = require('noframenet-core').Frame;
const config = require('./../../config');
const utils = require('./../../utils/utils');

const logger = config.logger;

async function getFrame(id) {
  return Frame.findById(id);
}

async function getByID(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for Frame with _id = ${context.params.id}`);
  context.body = await getFrame(context.params.id);
  logger.verbose(`Frame with _id = ${context.params.id} retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByID,
};
