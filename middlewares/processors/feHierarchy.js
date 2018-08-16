const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getFEhierarchyWithModel(FEHierarchy) {
  return async function getFEhierarchy(feNamesSet, projections = {}) {
    return Array.from(feNamesSet).reduce(async (feHierarchyPromise, feName) => {
      const feHierarchy = await feHierarchyPromise;
      feHierarchy[feName] = await FEHierarchy.findOne({}, projections).where('name').equals(feName);
      return feHierarchy;
    }, {});
  };
}

async function getByVP(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for FEHierarchy with vp = '${context.query.vp}'`);
  logger.verbose(`Corresponding feNamesSet = '${Array.from(context.valencer.query.feNamesSet)}'`);
  const feHierarchyModel = context.valencer.models.FEHierarchy;
  const results =
    await getFEhierarchyWithModel(feHierarchyModel)(context.valencer.query.feNamesSet,
                                                    context.valencer.query.projections);
  context.valencer.results.feHierarchy = results;
  logger.verbose(`feHierarchy retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByVP,
};
