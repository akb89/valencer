const AnnotationSet = require('noframenet-core').AnnotationSet;
const config = require('./../../config');
const utils = require('./../../utils/utils');

const logger = config.logger;

async function getAnnotationSets(filteredPatternsIDs) {
  // This is slightly faster than with mongoose
  return AnnotationSet.collection.aggregate([{
    $match: {
      pattern: {
        $in: filteredPatternsIDs,
      },
    } }]).toArray();
}

async function getByValencePattern(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all AnnotationSets with a valence pattern matching: '${context.query.vp}'`);
  context.body = await getAnnotationSets(context.valencer.results.filteredPatternsIDs);
  logger.debug(`${context.body.length} unique AnnotationSets retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByValencePattern,
};
