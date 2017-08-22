const LexUnit = require('noframenet-core').LexUnit;
const config = require('./../../config');
const utils = require('./../../utils/utils');

const logger = config.logger;

async function getLexUnits(annotationSets) {
  return LexUnit.find().where('_id').in(annotationSets.map(annoset => annoset.lexUnit));
}

async function getByAnnotationSets(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all LexUnits with a valence pattern matching: '${context.query.vp}'`);
  context.valencer.results.lexUnits = await getLexUnits(context.valencer.results.annotationSets);
  logger.verbose(`${context.valencer.results.lexUnits.length} unique LexUnits retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByAnnotationSets,
};
