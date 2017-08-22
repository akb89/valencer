const config = require('./../../config');
const utils = require('./../../utils/utils');

const logger = config.logger;

function getLexUnitWithLexUnitModel(LexUnit) {
  return async function getLexUnit(id) {
    return LexUnit.findById(id);
  };
}

async function getByID(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for LexUnit with _id = ${context.params.id}`);
  context.body = await getLexUnitWithLexUnitModel(
    context.valencer.models.LexUnit)(context.params.id);
  logger.verbose(`LexUnit with _id = ${context.params.id} retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByID,
};
