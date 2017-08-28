const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getPatternsWithPatternModel(Pattern) {
  return async function getPatterns(patternIDs, projections = {}, populations = []) {
    const q = Pattern.find({}, projections).where('_id').in(patternIDs);
    return populations.reduce((query, p) => query.populate(p), q);
  };
}

async function getFromIDs(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all valence patterns matching: '${context.query.vp}'`);
  context.valencer.results.patterns = await getPatternsWithPatternModel(
          context.valencer.models.Pattern)(context.valencer.results.tmp.filteredPatternsIDs,
                                           context.valencer.query.projections,
                                           context.valencer.query.populations);
  logger.verbose(`${context.valencer.results.patterns.length} unique Patterns retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getFromIDs,
};
