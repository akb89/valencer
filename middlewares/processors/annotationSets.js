const AnnotationSet = require('noframenet-core').AnnotationSet;
const config = require('./../../config');
const utils = require('./../../utils/utils');

const logger = config.logger;

async function getAnnotationSets(filteredPatternsIDs) {
  return AnnotationSet.find().where('pattern').in(filteredPatternsIDs);
}

async function getByValencePattern(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all AnnotationSets with a valence pattern matching: '${context.query.vp}'`);
  context.valencer.results.annotationSets = await getAnnotationSets(context.valencer.results.tmp.filteredPatternsIDs);
  logger.verbose(`${context.valencer.results.annotationSets.length} unique AnnotationSets retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByValencePattern,
};
