const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getPatternsWithPatternModel(Pattern) {
  return async function getPatterns(filteredPatternsIDs, countMode = false,
                                    projections = {}, populations = [],
                                    skip, limit) {
    if (countMode) {
      return Pattern.find().select(projections).where('_id')
        .in(filteredPatternsIDs)
        .count();
    }
    const q = Pattern.find({}, projections).where('_id')
      .in(filteredPatternsIDs)
      .skip(skip)
      .limit(limit);
    return populations.reduce((query, p) => query.populate(p), q);
  };
}

async function getFromIDs(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all valence patterns matching: '${context.query.vp}' with skip = '${context.valencer.query.skip}' and limit = '${context.valencer.query.limit}'`);
  const patternModel = context.valencer.models.Pattern;
  const filteredPatternsIDs = context.valencer.results.tmp.filteredPatternsIDs;
  const [count, results] = await Promise.all([
    getPatternsWithPatternModel(patternModel)(filteredPatternsIDs, true),
    getPatternsWithPatternModel(patternModel)(filteredPatternsIDs,
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
  context.valencer.results.patterns = results;
  logger.verbose(`${results.length} unique Patterns out of ${count} retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getFromIDs,
};
