/**
 * The formatter manipulates the input query.
 * It transforms a raw valence pattern (defined as a (potentially partial)
 * combination of FE.PT.GF tags) to an array of array (first).
 * The formatter manipulates the input query.
 * It transforms , and to an array of array with Frame Element ids then.
**/
const FrameElement = require('noframenet-core').FrameElement;
const bluebird = require('bluebird');
const utils = require('./../utils/utils');
const config = require('../config');

const Promise = bluebird.Promise;
const logger = config.logger;

function getFormattedValencePattern(vp) {
  const formattedValencePattern = utils.toTokenArray(utils.toValenceArray(vp));
  return formattedValencePattern;
}

/**
 * Converts a full string formatted valence pattern
 * 'FE_1.PT_1.GF_1+FE_2.PT_2.GF_2+...+FE_n.PT_n.GF_n'
 * to an array of array of tokens:
 * [['FE_1', 'PT_1', 'GF_1'], ['FE_2', 'PT_2', 'GF_2'], ..., ['FE_n', 'PT_n', 'GF_n']]
 */
function formatValencePatternToArrayOfArrayOfTokens(context, next) {
  context.valencer.query.vp.raw = context.query.vp;
  context.valencer.query.vp.formatted = getFormattedValencePattern(context.query.vp);
  logger.debug(`context.valencer.query.vp.formatted = ${JSON.stringify(context.valencer.query.vp.formatted)}`);
  return next();
}

/**
 * Takes a full string formatted valencer pattern
 * [['FE_1', 'PT_1', 'GF_1'], ['FE_2', 'PT_2', 'GF_2'], ..., ['FE_n', 'PT_n',
 * 'GF_n']]
 * and replace each Frame Element name by an array of Frame Element ids
 * matching the given Frame Element name in the database.
 * Frame Element ids matching the given name
 * [[[fe_1_id_1,...,fe_1_id_n], 'PT_1', 'GF_1'], ...,
 * [[fe_n_id_1,...,fn_n_id_n], 'PT_n', 'GF_n']]
 */
function getValenceUnitAsArrayWithFEidsWithFEmodel(FrameElement) {
  return async function getValenceUnitAsArrayWithFEids(valenceUnitAsArray) {
    return valenceUnitAsArray.reduce(async (valenceUnitArrayWithFEidsPromise, token) => {
      const valenceUnitArrayWithFEids = await valenceUnitArrayWithFEidsPromise;
      const fes = await FrameElement.find().where('name').equals(token);
      valenceUnitArrayWithFEids.push(fes.length ? fes.map(fe => fe._id) : token);
      return valenceUnitArrayWithFEids;
    }, []);
  };
}

function getValencePatternAsArrayWithFEidsWithFEmodel(FrameElement) {
  return async function getValencePatternAsArrayWithFEids(formattedVP) {
    return Promise.all(formattedVP
      .map(async vUnitArray => getValenceUnitAsArrayWithFEidsWithFEmodel(
        FrameElement)(vUnitArray)));
  };
}

async function replaceFrameElementNamesByFrameElementIds(context, next) {
  context.valencer.query.vp.withFEids =
    await getValencePatternAsArrayWithFEidsWithFEmodel(
      context.valencer.models.FrameElement)(
        context.valencer.query.vp.formatted);
  logger.debug(`context.valencer.query.vp.withFEids = ${JSON.stringify(context.valencer.query.vp.withFEids)}`);
  return next();
}

module.exports = {
  formatValencePatternToArrayOfArrayOfTokens,
  replaceFrameElementNamesByFrameElementIds,
};
