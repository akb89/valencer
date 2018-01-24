const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getPatternWithPatternModel(Pattern) {
  return async function getPattern(id, projections = {}, populations = []) {
    const q = Pattern.findById(id, projections);
    return populations.reduce((query, p) => query.populate(p), q);
  };
}

async function getByID(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for Pattern with _id = ${context.params.id}`);
  const patternModel = context.valencer.models.Pattern;
  context.body = await getPatternWithPatternModel(patternModel)(context.params.id,
                                                                context.valencer.query.projections,
                                                                context.valencer.query.populations);
  logger.verbose(`Pattern with _id = ${context.params.id} retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByID,
};
