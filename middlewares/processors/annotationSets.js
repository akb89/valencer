const config = require('../../config');
const utils = require('../../utils/utils');
const Promise = require('bluebird');

const logger = config.logger;

function getAnnotationSetsWithAnnotationSetModel(AnnotationSet) {
  return async function getAnnotationSets(filteredPatternsIDs, countMode = false,
                                          projections = {}, populations = [],
                                          skip, limit) {
    if (countMode) {
      return AnnotationSet.find().select(projections).where('pattern')
                             .in(filteredPatternsIDs)
                             .count();
    }
    const q = AnnotationSet.find().select(projections).where('pattern')
                           .in(filteredPatternsIDs)
                           .skip(skip)
                           .limit(limit);
    return populations.reduce((query, p) => query.populate(p), q);
  };
}

async function getByValencePattern(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for AnnotationSets with skip =
    '${context.valencer.query.skip}', limit = '${context.valencer.query.limit}'
    and vp = '${context.query.vp}'`);
  const [count, results] = await Promise.all([
    getAnnotationSetsWithAnnotationSetModel(
            context.valencer.models.AnnotationSet)(
                context.valencer.results.tmp.filteredPatternsIDs, true),
    getAnnotationSetsWithAnnotationSetModel(
            context.valencer.models.AnnotationSet)(
                context.valencer.results.tmp.filteredPatternsIDs,
                false,
                context.valencer.query.projections,
                context.valencer.query.populations,
                context.valencer.query.skip,
                context.valencer.query.limit),
  ]);
  context.set({
    'Total-Count': count,
    Skip: context.valencer.query.skip,
    Limit: context.valencer.query.limit,
  });
  context.valencer.results.annotationSets = results;
  logger.verbose(`${results.length} unique AnnotationSets out of ${count}
    retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByValencePattern,
};
