const bluebird = require('bluebird');
const FrameElement = require('noframenet-core').FrameElement;
const Pattern = require('noframenet-core').Pattern;
const ValenceUnit = require('noframenet-core').ValenceUnit;
const utils = require('./../utils/utils');
const config = require('./../config');

const Promise = bluebird.Promise;
const logger = config.logger;

function filterByStrictVUMatching(allPatterns, arrayOfArrayOfValenceUnitIDs) {
  return allPatterns.reduce((filteredPatternsIDs, pattern) => {
    if (pattern.valenceUnits.length === arrayOfArrayOfValenceUnitIDs.length) {
      filteredPatternsIDs.push(pattern._id);
    }
    return filteredPatternsIDs;
  }, []);
}

function containsExtraCoreFEs(frameElementsNameSet, frameElements) {
  for (const frameElement of frameElements) {
    if (!frameElementsNameSet.has(frameElement.name) && frameElement.coreType === 'Core') {
      return true;
    }
  }
  return false;
}

async function getFrameElements(pattern) {
  return Promise.all(pattern.valenceUnits.map(async valenceUnitID => FrameElement.findById((await ValenceUnit.findById(valenceUnitID)).FE)));
}

/**
 * Return a partial array of FrameElement ids given an input array of
 * array of valenceunit objects. This function's purpose is to return an
 * intermediate list of ids in order to ultimately get a set of frame
 * element names. This is why we only take the first element of each array
 * (valenceUnitsIDs[0]). By definition, each array should refer to the same
 * frame element name.
 */
async function getFrameElementsIDs(arrayOfArrayOfValenceUnitIDs) {
  return Promise.all(arrayOfArrayOfValenceUnitIDs.map(async valenceUnitsIDs => (await ValenceUnit.findById(valenceUnitsIDs[0])).FE));
}

async function getFrameElementsNameSet(frameElementsIDs) {
  return new Set((await Promise.all(frameElementsIDs.map(async frameElementID => (await FrameElement.findById(frameElementID)).name))));
}

async function filterByExtraCoreFEs(allPatterns, arrayOfArrayOfValenceUnitIDs) {
  const frameElementsNameSet = await getFrameElementsNameSet((await getFrameElementsIDs(arrayOfArrayOfValenceUnitIDs)));
  return allPatterns.reduce(async (filteredPatternsIDsPromise, pattern) => {
    const filteredPatternsIDs = await filteredPatternsIDsPromise;
    const frameElements = await getFrameElements(pattern);
    if (!containsExtraCoreFEs(frameElementsNameSet, frameElements)) {
      filteredPatternsIDs.push(pattern._id);
    }
    return filteredPatternsIDs;
  }, []);
}

/**
 * 3 cases have to be taken into account:
 *  - strictVUMatching === true (withExtraCoreFEs not taken into consideration)
 *  - withExtraCoreFEs === true
 *  - withExtraCoreFEs === false
 *  Note that previous validation guarantees that in a
 *  strictVUMatching === false && withExtraCoreFEs === false
 *  configuration there are no unspecified FE in the input valence pattern
 */
async function getFilteredPatternsIDs(allPatternsIDs,
                                      arrayOfArrayOfValenceUnitIDs,
                                      strictVUMatching, withExtraCoreFEs) {
  if (withExtraCoreFEs === 'true' && strictVUMatching === 'false') {
    // This is the default case: Return all possibilities, regardless of
    // whether or not FEs are core or non-core
    return allPatternsIDs;
  }
  const allPatterns = await Pattern.find().where('_id').in(allPatternsIDs);
  if (withExtraCoreFEs === 'false' && strictVUMatching === 'false') {
    // Allow returning patterns with more than the specified VUs, only if
    // those VUs contain non-core FEs. Ex: Donor.NP.Ext Recipient.NP.Obj ->
    // Donor.NP.Ext Recipient.NP.Obj Time.PP[at].Dep as Time is a non-core FE
    // in this particular case
    return filterByExtraCoreFEs(allPatterns, arrayOfArrayOfValenceUnitIDs);
  }
  // strictVUMatching === true
  return filterByStrictVUMatching(allPatterns, arrayOfArrayOfValenceUnitIDs);
}

async function filterPatternsIDs(context, next) {
  logger.debug(`Filtering patternsIDs with strictVUMatching = ${context.query.strictVUMatching} and withExtraCoreFEs = ${context.query.withExtraCoreFEs}`);
  const startTime = utils.getStartTime();
  context.valencer.results.filteredPatternsIDs =
    await getFilteredPatternsIDs(context.valencer.results.patternsIDs,
                                 context.valencer.results.valenceUnitsIDs,
                                 context.query.strictVUMatching,
                                 context.query.withExtraCoreFEs);
  logger.debug(`context.valencer.results.filteredPatternsIDs.length = ${context.valencer.results.filteredPatternsIDs.length}`);
  logger.debug(`context.valencer.results.filteredPatternsIDs processed in ${utils.getElapsedTime(startTime)} ms`);
  return next();
}

module.exports = {
  filterPatternsIDs,
};
