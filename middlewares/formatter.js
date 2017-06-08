/**
 * The formatter manipulates the input query.
 * It transforms a raw valence pattern (defined as a (potentially partial)
 * combination of FE.PT.GF tags) to an array of array (first).
 */
 /**
  * The formatter manipulates the input query.
  * It transforms , and to an array of array with Frame Element ids then.
  */
const FrameElement = require('noframenet-core').FrameElement;
const utils = require('./../utils/utils');
const config = require('../config');

const logger = config.logger;

function getFormattedValencePattern(vp) {
  logger.debug(`Formatting valence pattern: ${vp}`);
  const formattedValencePattern = utils.toTokenArray(utils.toValenceArray(vp));
  logger.debug(`Formatted valence pattern: ${formattedValencePattern}`);
  return formattedValencePattern;
}

function formatValencePatternToArrayOfArrayOfTokens(context, next) {
  context.valencer.query.vp.raw = context.query.vp;
  context.valencer.query.vp.formatted = getFormattedValencePattern(context.query.vp);
  return next();
}

/**
 * Takes a formatted query output by
 * Converts a full string formatted ValenceUnit [FE, PT, GF] to an array where
 * the Frame Element name has been replaced by an array containing all the
 * Frame Element ids matching the given name.
 * [FE, PT, GF] --> [[id_1, ... , id_n], PT, GF]
 */
async function getValenceUnitAsArrayWithFEids(valenceUnitAsArray) {
  const valenceUnitArrayWithFEids = [];
  for (const token of valenceUnitAsArray) {
    const fes = await FrameElement.find().where('name').equals(token);
    if (fes.length) {
      valenceUnitArrayWithFEids.add(fes.map(fe => fe._id));
    } else {
      valenceUnitArrayWithFEids.add(token);
    }
  }
  return valenceUnitArrayWithFEids;
}

async function getValencePatternAsArrayWithFEids(formattedVP) {
  return Promise.all(formattedVP
    .map(async vUnitArray => await getValenceUnitAsArrayWithFEids(vUnitArray)));
}

async function replaceFrameElementNamesByFrameElementIds(context, next) {
  context.valencer.query.vp.withFEids = await getValencePatternAsArrayWithFEids(context.valencer.query.vp.formatted);
  return next();
}

module.exports = {
  formatValencePatternToArrayOfArrayOfTokens,
  replaceFrameElementNamesByFrameElementIds,
};
