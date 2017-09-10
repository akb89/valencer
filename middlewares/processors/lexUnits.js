const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getLexUnitsWithLexUnitModel(LexUnit) {
  return async function getLexUnits(annotationSets, projections = {}, populations = []) {
    const q = LexUnit.find({}, projections).where('_id')
        .in(annotationSets.map(annoset => annoset.lexUnit));
    return populations.reduce((query, p) => query.populate(p), q);
  };
}

async function getByAnnotationSets(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all LexUnits with a valence pattern matching: '${context.query.vp}'`);
  context.valencer.results.lexUnits = await getLexUnitsWithLexUnitModel(
          context.valencer.models.LexUnit)(context.valencer.results.annotationSets,
                                           context.valencer.query.projections,
                                           context.valencer.query.populations);
  logger.verbose(`${context.valencer.results.lexUnits.length} unique LexUnits
    retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByAnnotationSets,
};
