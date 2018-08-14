const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getFEhierarchyWithModel(FERelation) {
  return async function getFrames() {
  };
}

async function getByVP(context, next) {
  const feRelationModel = context.valencer.models.FERelation;
  const frameIDs =
    await getFrameIDsWithModel(feRelationModel)(context.valencer.results.tmp.filteredPatternsIDs);
  const [count, results] = await Promise.all([
    getFramesWithModel(context.valencer.models.Frame)(frameIDs, true),
    getFramesWithModel(context.valencer.models.Frame)(frameIDs, false,
                                                      context.valencer.query.projections,
                                                      context.valencer.query.populations,
                                                      context.valencer.query.skip,
                                                      context.valencer.query.limit),
  ]);
  return next();
}

module.exports = {
  getByVP,
};
