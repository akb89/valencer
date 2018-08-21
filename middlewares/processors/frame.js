const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getFrameWithFrameModel(Frame) {
  return async function getFrame(id, projections = {}, populations = []) {
    const q = Frame.findById(id, projections);
    return populations.reduce((query, p) => query.populate(p), q);
  };
}

async function getByID(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for Frame with _id = ${context.params.id}`);
  const frameModel = context.valencer.models.Frame;
  context.body = await getFrameWithFrameModel(frameModel)(context.params.id,
                                                          context.valencer.query.projections,
                                                          context.valencer.query.populations);
  logger.verbose(`Frame with _id = ${context.params.id} retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByID,
};
