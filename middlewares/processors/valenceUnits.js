const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getValenceUnitsWithValenceUnitModel(ValenceUnit) {
  return async function getValenceUnits(valenceUnitIDs) {
    return ValenceUnit.find().where('_id').in(valenceUnitIDs);
  };
}

async function getFromIDs(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all valence units matching: '${context.query.vu}'`);
  const valenceUnitIDs = [].concat(...context.valencer.results.tmp.valenceUnitsIDs);
  context.valencer.results.valenceUnits = await getValenceUnitsWithValenceUnitModel(
    context.valencer.models.ValenceUnit)(valenceUnitIDs);
  logger.verbose(`${context.valencer.results.valenceUnits.length} unique ValenceUnits retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getFromIDs,
};
