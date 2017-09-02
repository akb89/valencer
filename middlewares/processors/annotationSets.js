const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getAnnotationSetsWithAnnotationSetModel(AnnotationSet) {
  return async function getAnnotationSets(filteredPatternsIDs, projections = {}, populations = []) {
    const q = AnnotationSet.find().select(projections).where('pattern').in(filteredPatternsIDs);
    return populations.reduce((query, p) => query.populate(p), q);
  };
}

async function getByValencePattern(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all AnnotationSets with a valence pattern matching: '${context.query.vp}'`);
  context.valencer.results.annotationSets =
      await getAnnotationSetsWithAnnotationSetModel(
              context.valencer.models.AnnotationSet)(
                  context.valencer.results.tmp.filteredPatternsIDs,
                  context.valencer.query.projections,
                  context.valencer.query.populations);
  logger.verbose(`${context.valencer.results.annotationSets.length} unique AnnotationSets retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByValencePattern,
};
