const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getValenceUnitWithValenceUnitModel(ValenceUnit) {
  return async function getValenceUnit(id, projections = {}, populations = []) {
    const q = ValenceUnit.findById(id, projections);
    return populations.reduce((query, p) => query.populate(p), q);
  };
}

async function getByID(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for ValenceUnit with _id = ${context.params.id}`);
  context.body = await getValenceUnitWithValenceUnitModel(
          context.valencer.models.ValenceUnit)(context.params.id,
                                               context.valencer.query.projections,
                                               context.valencer.query.populations);
  logger.verbose(`ValenceUnit with _id = ${context.params.id} retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByID,
};
