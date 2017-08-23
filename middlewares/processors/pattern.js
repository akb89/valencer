const config = require('./../../config');
const utils = require('./../../utils/utils');

const logger = config.logger;

function getPatternWithPatternModel(Pattern) {
  return async function getPattern(id) {
    return Pattern.findById(id);
  };
}

async function getByID(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for Pattern with _id = ${context.params.id}`);
  context.body = await getPatternWithPatternModel(
    context.valencer.models.Pattern)(context.params.id);
  logger.verbose(`Pattern with _id = ${context.params.id} retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByID,
};
