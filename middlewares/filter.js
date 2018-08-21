const utils = require('./../utils/utils');
const config = require('./../config');

const logger = config.logger;

function filterByStrictVUMatching(allPatterns, arrayOfArrayOfValenceUnitIDs) {
  return allPatterns.reduce((filteredPatternsIDs, pattern) => {
    if (pattern.valenceUnits.length === arrayOfArrayOfValenceUnitIDs.length) {
      filteredPatternsIDs.push(pattern._id);
    }
    return filteredPatternsIDs;
  }, []);
}

function getFilteredPIDsWithPModel(Pattern) {
  return async function getFilteredPatternsIDs(allPatternsIDs,
                                               arrayOfArrayOfValenceUnitIDs,
                                               strictVUMatching) {
    if (!strictVUMatching) {
      return allPatternsIDs;
    }
    const allPatterns = await Pattern.find().where('_id').in(allPatternsIDs);
    return filterByStrictVUMatching(allPatterns, arrayOfArrayOfValenceUnitIDs);
  };
}

async function filterPatternsIDs(context, next) {
  logger.debug(`Filtering patternsIDs with strictVUMatching = ${context.query.strictVUMatching}`);
  const startTime = utils.getStartTime();
  const patternModel = context.valencer.models.Pattern;
  const pIDs = context.valencer.results.tmp.patternsIDs;
  const vuIDs = context.valencer.results.tmp.valenceUnitsIDs;
  const fpIDs = await getFilteredPIDsWithPModel(patternModel)(pIDs,
                                                              vuIDs,
                                                              context.query.strictVUMatching);
  context.valencer.results.tmp.filteredPatternsIDs = fpIDs;
  logger.debug(`context.valencer.results.tmp.filteredPatternsIDs.length = ${context.valencer.results.tmp.filteredPatternsIDs.length}`);
  logger.verbose(`context.valencer.results.tmp.filteredPatternsIDs processed in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  filterPatternsIDs,
};
