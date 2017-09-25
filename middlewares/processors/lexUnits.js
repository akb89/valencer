const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getLexUnitsWithModel(LexUnit) {
  return async function getLexUnits(lexUnitIDs, countMode = false,
                                    projections = {}, populations = [],
                                    skip, limit) {
    if (countMode) {
      return LexUnit.find().where('_id').in(lexUnitIDs).count();
    }
    const lexUnits = LexUnit.find({}, projections).where('_id').in(lexUnitIDs)
                        .skip(skip)
                        .limit(limit);
    return populations.reduce((query, p) => query.populate(p), lexUnits);
  };
}

function getLexUnitIDsWithModel(AnnotationSet) {
  return async function getLexUnitIDs(filteredPatternsIDs) {
    return AnnotationSet.distinct('lexUnit').where('pattern').in(filteredPatternsIDs);
  };
}

async function getByVP(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for LexUnits with skip = '${context.valencer.query.skip}', limit = '${context.valencer.query.limit}' and vp = '${context.query.vp}'`);
  const lexUnitIDs = await getLexUnitIDsWithModel(
    context.valencer.models.AnnotationSet)(
      context.valencer.results.tmp.filteredPatternsIDs);
  const [count, results] = await Promise.all([
    getLexUnitsWithModel(context.valencer.models.LexUnit)(lexUnitIDs, true),
    getLexUnitsWithModel(context.valencer.models.LexUnit)(lexUnitIDs, false,
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
  context.valencer.results.lexUnits = results;
  logger.verbose(`${results.length} unique LexUnits out of ${count} retrieved
    from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByVP,
};
