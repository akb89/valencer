const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getLUwithLUmodel(LexUnit) {
  return async function getLexUnit(id, projections = {}, populations = []) {
    const q = LexUnit.findById(id, projections);
    return populations.reduce((query, p) => query.populate(p), q);
  };
}

async function getByID(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for LexUnit with _id = ${context.params.id}`);
  const luModel = context.valencer.models.LexUnit;
  context.body = await getLUwithLUmodel(luModel)(context.params.id,
                                                 context.valencer.query.projections,
                                                 context.valencer.query.populations);
  logger.verbose(`LexUnit with _id = ${context.params.id} retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByID,
};
