const config = require('./../../config');
const utils = require('./../../utils/utils');

const logger = config.logger;

function getAnnotationSetWithAnnotationSetModel(AnnotationSet) {
  return async function getAnnotationSet(id) {
    return AnnotationSet.findById(id);
  };
}

async function getByID(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for AnnotationSet with _id = ${context.params.id}`);
  context.body = await getAnnotationSetWithAnnotationSetModel(
    context.valencer.models.AnnotationSet)(context.params.id);
  logger.verbose(`AnnotationSet with _id = ${context.params.id} retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByID,
};
