const FrameElement = require('noframenet-core').FrameElement;
const Pattern = require('noframenet-core').Pattern;
const ValenceUnit = require('noframenet-core').ValenceUnit;
const utils = require('./../utils/utils');
const config = require('./../config');

function filterByStrictVUMatching(allPatterns, arrayOfArrayOfValenceUnitIDs) {
  return allPatterns.reduce((filteredPatternsIDs, pattern) => {
    if (pattern.valenceUnits.length === arrayOfArrayOfValenceUnitIDs.length) {
      filteredPatternsIDs.push(pattern._id);
    }
    return filteredPatternsIDs;
  }, []);
}

async function containsExtraCoreFEs(frameElements, frameElementsNames) {
  frameElements.reduce((isExtraCoreFE, frameElement) => !frameElementsNames.has(frameElement.name) && frameElement.coreType === 'Core', false);
}

async function getFrameElements(pattern) {
  return Promise.all(pattern.valenceUnits.map(async (valenceUnitID) => {
    const frameElementID = ValenceUnit.findById(valenceUnitID, { _id: 0, FE: 1 });
    return FrameElement.findById(frameElementID);
  }));
}

function filterByExtraCoreFEs(allPatterns, arrayOfArrayOfValenceUnitIDs) {
  const frameElementsIDs = new Set(
    arrayOfArrayOfValenceUnitIDs.map(async valenceUnitsIDs => await ValenceUnit.findById(valenceUnitsIDs[0]._id, { _id: 0, FE: 1 }))
  );
  const frameElementsNames = new Set(
    frameElementsIDs.map(async frameElementID => await FrameElement.findById(frameElementID, { _id: 0, name: 1 }))
  );
  return allPatterns.reduce(async (filteredPatternsIDs, pattern) => {
    const frameElements = await getFrameElements(pattern);
    if (!containsExtraCoreFEs(frameElements, frameElementsNames)) {
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
  if (withExtraCoreFEs && !strictVUMatching) {
    // This is the default case: Return all possibilities, regardless of
    // whether or not FEs are core or non-core
    return allPatternsIDs;
  }
  const allPatterns = await Pattern.find().where('_id').in(allPatternsIDs);
  if (!withExtraCoreFEs && !strictVUMatching) {
    // Allow returning patterns with more than the specified VUs, only if
    // those VUs contain non-core FEs. Ex: Donor.NP.Ext Recipient.NP.Obj ->
    // Donor.NP.Ext Recipient.NP.Obj Time.PP[at].Dep as Time is a non-core FE
    // in this particular case
    return filterByExtraCoreFEs(allPatterns, arrayOfArrayOfValenceUnitIDs);
  }
  // strictVUMatching === true
  return filterByStrictVUMatching(allPatterns, arrayOfArrayOfValenceUnitIDs)
}

async function filterPatternsIDs(context, next) {
  context.valencer.results.filteredPatternsIDs =
    await getFilteredPatternsIDs(context.valencer.results.patternsIDs,
                                 context.valencer.results.valenceUnitsIDs,
                                 context.query.strictVUMatching,
                                 context.query.withExtraCoreFEs);
  return next();
}

module.exports = {
  filterPatternsIDs,
};
