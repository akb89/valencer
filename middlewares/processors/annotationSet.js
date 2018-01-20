const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getAnnoSetWithAnnoSetModel(AnnotationSet) {
  return async function getAnnotationSet(id, projections = {}, populations = []) {
    const q = AnnotationSet.findById(id, projections);
    return populations.reduce((query, p) => query.populate(p), q);
  };
}

async function getByID(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for AnnotationSet with _id = ${context.params.id}`);
  const annoSetModel = context.valencer.models.AnnotationSet;
  context.body = await getAnnoSetWithAnnoSetModel(annoSetModel)(context.params.id,
                                                                context.valencer.query.projections,
                                                                context.valencer.query.populations);
  logger.verbose(`AnnotationSet with _id = ${context.params.id} retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByID,
};
