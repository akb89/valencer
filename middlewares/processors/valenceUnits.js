const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getValenceUnitsWithValenceUnitModel(ValenceUnit) {
  return async function getValenceUnits(valenceUnitIDs, countMode = false,
                                        projections = {}, populations = [],
                                        skip, limit) {
    if (countMode) {
      return ValenceUnit.find().select(projections).where('_id')
        .in(valenceUnitIDs)
        .count();
    }
    const q = ValenceUnit.find().select(projections).where('_id')
      .in(valenceUnitIDs)
      .skip(skip)
      .limit(limit);
    return populations.reduce((query, p) => query.populate(p), q);
  };
}

async function getFromIDs(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all valence units matching: '${context.query.vu}' with skip = '${context.valencer.query.skip}' and limit = '${context.valencer.query.limit}'`);
  const vuModel = context.valencer.models.ValenceUnit;
  const valenceUnitIDs = [].concat(...context.valencer.results.tmp.valenceUnitsIDs);
  const [count, results] = await Promise.all([
    getValenceUnitsWithValenceUnitModel(vuModel)(valenceUnitIDs, true),
    getValenceUnitsWithValenceUnitModel(vuModel)(valenceUnitIDs,
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
  context.valencer.results.valenceUnits = results;
  logger.verbose(`${results.length} unique ValenceUnits out of ${count} retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getFromIDs,
};
