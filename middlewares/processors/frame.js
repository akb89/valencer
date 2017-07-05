const config = require('./../../config');
const utils = require('./../../utils/utils');

const logger = config.logger;

function getFrameWithFrameModel(Frame) {
  return async function getFrame(id) {
    return Frame.findById(id);
  };
}

async function getByID(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for Frame with _id = ${context.params.id}`);
  context.body = await getFrameWithFrameModel(
    context.valencer.models.Frame)(context.params.id);
  logger.verbose(`Frame with _id = ${context.params.id} retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByID,
};
