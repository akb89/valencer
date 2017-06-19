const AnnotationSet = require('noframenet-core').AnnotationSet;
const config = require('./../../config');
const utils = require('./../../utils/utils');

const logger = config.logger;

async function getByNoPopulateVP(filteredPatternsIDs) {
  // This is slightly faster than with mongoose
  return AnnotationSet.collection.aggregate([{
    $match: {
      pattern: {
        $in: filteredPatternsIDs,
      },
    } }]).toArray();
}

async function getByPopulateVP(filteredPatternsIDs) {
  return AnnotationSet.find()
                      .where('pattern')
                      .in(filteredPatternsIDs)
                      .populate([{
                        path: 'pattern',
                        populate: { path: 'valenceUnits' } }, {
                        path: 'sentence' }, {
                        path: 'lexUnit',
                        populate: {
                          path: 'frame',
                          populate: [{
                            path: 'lexUnits',
                            select: 'name',
                          }, { path: 'frameElements' }],
                        },
                        }, { path: 'labels' }]);
}

async function getByValencePattern(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all AnnotationSets with a valence pattern matching: '${context.query.vp}'`);
  logger.info(`Returning populated documents: ${context.query.populate}`);
  context.body = context.query.populate === 'true' ? await getByPopulateVP(context.valencer.results.filteredPatternsIDs) : await getByNoPopulateVP(context.valencer.results.filteredPatternsIDs);
  logger.debug(`${context.body.length} unique AnnotationSets retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByValencePattern,
};
