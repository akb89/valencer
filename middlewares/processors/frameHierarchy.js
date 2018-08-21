const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getFrameHierarchyWithModel(FrameHierarchy) {
  return async function getFrameHierarchy(frameName, projections = {}) {
    return FrameHierarchy.findOne({}, projections).where('name').equals(frameName);
  };
}

async function getByName(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for FrameHierarchy for Frame with name = ${context.query.frameName}`);
  const frameHierarchyModel = context.valencer.models.FrameHierarchy;
  const projections = context.valencer.query.projections;
  context.body = await getFrameHierarchyWithModel(frameHierarchyModel)(context.query.frameName,
                                                                       projections);
  logger.verbose(`FrameHierarchy retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByName,
};
