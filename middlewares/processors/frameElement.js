const config = require('./../../config');
const utils = require('./../../utils/utils');

const logger = config.logger;

function getFrameElementWithFrameElementModel(FrameElement) {
  return async function getFrameElement(id) {
    return FrameElement.findById(id);
  };
}

async function getByID(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for FrameElement with _id = ${context.params.id}`);
  context.body = await getFrameElementWithFrameElementModel(
    context.valencer.models.FrameElement)(context.params.id);
  logger.verbose(`FrameElement with _id = ${context.params.id} retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByID,
};
