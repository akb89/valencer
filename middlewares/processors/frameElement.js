const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getFrameElementWithFrameElementModel(FrameElement) {
  return async function getFrameElement(id, projections = {}, populations = []) {
    const q = FrameElement.findById(id, projections);
    return populations.reduce((query, p) => query.populate(p), q);
  };
}

async function getByID(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for FrameElement with _id = ${context.params.id}`);
  context.body = await getFrameElementWithFrameElementModel(
          context.valencer.models.FrameElement)(context.params.id,
                                                context.valencer.query.projections,
                                                context.valencer.query.populations);
  logger.verbose(`FrameElement with _id = ${context.params.id} retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByID,
};
