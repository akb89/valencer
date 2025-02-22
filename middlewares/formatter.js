/*
 * The formatter manipulates the input query.
 * It transforms a raw valence pattern (defined as a (potentially partial)
 * combination of FE.PT.GF tags) to an array of array (first).
 * The formatter manipulates the input query.
 * It transforms , and to an array of array with Frame Element ids then.
 */
const bluebird = require('bluebird');
const utils = require('../utils/utils');
const constants = require('../utils/constants');
const config = require('../config');

const Promise = bluebird.Promise;
const logger = config.logger;

/**
 * Convert an array of array of tokens to full FN-style PT.GF
 * Detect UD (Universal Dependencies) and PENN constituent tags and convert
 * to full valid FrameNet PhraseType and GrammaticalFunctions.
 */
function convertPTandGFtoFNstyle(context, next) {
  const fVPq = context.valencer.query.vp.formatted.map(vu => vu.reduce((array, item) => {
    if (Object.prototype.hasOwnProperty.call(constants.UD_TO_FN_MAPPING, item)) {
      context.valencer.query.vp.hasUDtags = true;
      array.push(constants.UD_TO_FN_MAPPING[item].PT);
      array.push(constants.UD_TO_FN_MAPPING[item].GF);
    } else if (Object.prototype.hasOwnProperty.call(constants.PENN_CONST_TO_FN_MAPPING, item)) {
      context.valencer.query.vp.hasPENNtags = true;
      array.push(constants.PENN_CONST_TO_FN_MAPPING[item]);
    } else {
      array.push(item);
    }
    return array;
  }, []));
  context.valencer.query.vp.formatted = fVPq;
  logger.debug(`Formatted query after mapping = ${JSON.stringify(context.valencer.query.vp.formatted)}`);
  return next();
}

// When non-FN tags (PT/GF) are found, returns a list of matching queries
// in FrameNet-style
function formatMatchingVPqueries(context, next) {
  context.valencer.query.vp.rawMatches = []; // TODO: implement
  return next();
}

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
 * matching the given Frame Element name in the database (case insensitive).
 * Frame Element ids matching the given name
 * [[[fe_1_id_1,...,fe_1_id_n], 'PT_1', 'GF_1'], ...,
 * [[fe_n_id_1,...,fn_n_id_n], 'PT_n', 'GF_n']]
 */
function getVUasArrayWithFEidsWithFEmodel(FrameElement) {
  return async function getValenceUnitAsArrayWithFEids(valenceUnitAsArray) {
    return valenceUnitAsArray.reduce(async (valenceUnitArrayWithFEidsPromise, token) => {
      const valenceUnitArrayWithFEids = await valenceUnitArrayWithFEidsPromise;
      const fes = await FrameElement.find().where('name').equals(token);

      valenceUnitArrayWithFEids.push(fes.length ? fes.map(fe => fe._id) : token);
      return valenceUnitArrayWithFEids;
    }, []);
  };
}

function getVPasArrayWithFEidsWithFEmodel(FrameElement) {
  return async function getValencePatternAsArrayWithFEids(formattedVP) {
    return Promise.all(formattedVP
      .map(async vUnitArray => getVUasArrayWithFEidsWithFEmodel(FrameElement)(vUnitArray)));
  };
}

async function replaceFrameElementNamesByFrameElementIds(context, next) {
  const feModel = context.valencer.models.FrameElement;
  const fVPq = context.valencer.query.vp.formatted;
  const qWithFEids = await getVPasArrayWithFEidsWithFEmodel(feModel)(fVPq);
  context.valencer.query.vp.withFEids = qWithFEids;
  logger.debug(`context.valencer.query.vp.withFEids = ${JSON.stringify(context.valencer.query.vp.withFEids)}`);
  return next();
}

function formatProjectionString(context, next) {
  if (context.params.projection == null) {
    return next();
  }
  const projection = context.params.projection;
  const projections = projection.split(',')
    .filter(p => p !== '').reduce((proj, p) => {
      proj[p] = 1;
      return proj;
    }, {});
  context.valencer.query.projections = projections;
  return next();
}

function formatPopulationString(context, next) {
  function makePopulation(paths, strSelect, select) {
    const object = paths.reverse().reduce((obj, path, idx) => {
      obj.path = path;
      if (select.length > 0 && idx === 0) {
        obj.select = strSelect;
      }
      return {
        populate: obj,
      };
    }, {});
    return object.populate;
  }
  if (context.params.population == null) {
    return next();
  }

  const disallowedEscapedChars = constants.DISALLOW_CHARS_PROJ_POPUL
    .map(c => utils.regExpEscape(c)).join('');

  const populationRegExp = new RegExp(`([^${disallowedEscapedChars}]+)(?:\\[([^\\]]+)\\])?`);
  const population = context.params.population;
  const populations = population.split(',').filter(p => p !== '').map((p) => {
    const matches = p.trim().match(populationRegExp);
    if (matches != null) {
      if (matches[matches.length - 1] === undefined) {
        return matches.slice(1, -1);
      }
      matches[matches.length - 1] = matches[matches.length - 1].split('|');
      return matches.slice(1); // Remove the whole matched expression
    }
    return matches;
  }).filter(p => p != null);

  const populationsObject = populations.map((pop) => {
    const strPath = pop[0];
    const select = pop.length > 1 ? pop[1] : [];
    return makePopulation(strPath.split('.'), select.join(' '), select);
  });
  context.valencer.query.populations = populationsObject;
  return next();
}

function extractFEnamesSetWithFEmodel(FrameElement) {
  return async function getFEnamesSet(formattedVP) {
    return formattedVP.reduce(async (namesSetPromise, vus) => {
      const namesSet = await namesSetPromise;
      for (const token of vus) {
        const fe = await FrameElement.findOne().where('name').equals(token);
        if (fe !== null) {
          namesSet.add(token);
        }
      }
      return namesSet;
    }, new Set());
  };
}

async function extractFEnamesSet(context, next) {
  const feModel = context.valencer.models.FrameElement;
  const fVPq = context.valencer.query.vp.formatted;
  context.valencer.query.feNamesSet = await extractFEnamesSetWithFEmodel(feModel)(fVPq);
  return next();
}

module.exports = {
  formatValencePatternToArrayOfArrayOfTokens,
  formatMatchingVPqueries,
  replaceFrameElementNamesByFrameElementIds,
  convertPTandGFtoFNstyle,
  formatProjectionString,
  formatPopulationString,
  extractFEnamesSet,
};
