const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getPatternsWithPatternModel(Pattern) {
  return async function getPatterns(patternIDs) {
    return Pattern.find().where('_id').in(patternIDs);
  };
}

async function getFromIDs(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all valence patterns matching: '${context.query.vp}'`);
  context.valencer.results.patterns = await getPatternsWithPatternModel(
    context.valencer.models.Pattern)(context.valencer.results.tmp.filteredPatternsIDs);
  logger.verbose(`${context.valencer.results.patterns.length} unique Patterns retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getFromIDs,
};
