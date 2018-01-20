const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getValenceUnitsWithValenceUnitModel(ValenceUnit) {
  return async function getValenceUnits(valenceUnitIDs, projections = {}, populations = []) {
    const q = ValenceUnit.find({}, projections).where('_id').in(valenceUnitIDs);
    return populations.reduce((query, p) => query.populate(p), q);
  };
}

async function getFromIDs(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all valence units matching: '${context.query.vu}'`);
  const valenceUnitIDs = [].concat(...context.valencer.results.tmp.valenceUnitsIDs);
  const vuModel = context.valencer.models.ValenceUnit;
  context.valencer.results.valenceUnits =
    await getValenceUnitsWithValenceUnitModel(vuModel)(valenceUnitIDs,
                                                       context.valencer.query.projections,
                                                       context.valencer.query.populations);
  logger.verbose(`${context.valencer.results.valenceUnits.length} unique ValenceUnits retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getFromIDs,
};
