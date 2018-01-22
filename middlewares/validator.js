const mongoose = require('mongoose');
const ApiError = require('../exceptions/apiException');
const config = require('../config');
const utils = require('../utils/utils');
const constants = require('../utils/constants');

const logger = config.logger;

async function validatePathToDB(context, next) {
  const urlSplit = context.request.url.split('/');
  const lang = urlSplit[2];
  const dataset = urlSplit[3];
  const dbName = config.databases.names[lang][dataset];
  if (config.databases.names[lang] === undefined) {
    throw new ApiError.InvalidQuery(`language ISO639-1 code '${lang}' is not supported`);
  }
  if (dbName === undefined) {
    throw new ApiError.InvalidQuery(`dataset '${dataset}' is not supported`);
  }
  const dbs = await new Promise((resolve, reject) => {
    mongoose.connection.db.admin().listDatabases((err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
  let isValidDBName = false;
  dbs.databases.forEach((database) => {
    if (database.name === dbName) {
      isValidDBName = true;
    }
  });
  if (!isValidDBName) {
    throw new ApiError.InvalidQuery(`Specified database '${dbName}' for language '${lang}' and dataset '${dataset}' was not found on the current instance of MongoDB running on server '${config.databases.server}' and port '${config.databases.port}'`);
  }
  logger.debug(`database language '${lang}', dataset '${dataset}' and name '${dbName}' are valid`);
  return next();
}

function validateQueryNotEmpty(context, next) {
  if (!context.query) {
    throw new ApiError.InvalidQuery('context.query object is empty, null or undefined');
  }
  logger.debug(`context.query object is valid: ${JSON.stringify(context.query)}`);
  return next();
}

function validateParamsNotEmpty(context, next) {
  if (!context.params) {
    throw new ApiError.InvalidParams('context.params object is empty, null or undefined');
  }
  logger.debug(`context.params object is valid: ${JSON.stringify(context.params)}`);
  return next();
}

function validateQueryParamNotEmpty(queryParam) {
  if (!queryParam) {
    throw new ApiError.InvalidQueryParams('query parameter is empty, null or undefined');
  }
  logger.debug('query parameter is not empty');
}

function validateQueryVPnotEmpty(context, next) {
  validateQueryParamNotEmpty(context.query.vp);
  context.query.vp = context.query.vp.trim();
  return next();
}

function validateQueryVUnotEmpty(context, next) {
  validateQueryParamNotEmpty(context.query.vu);
  context.query.vu = context.query.vu.trim();
  return next();
}

function validateParamsIDnotEmpty(context, next) {
  if (!context.params.id) {
    throw new ApiError.InvalidParams('context.params.id parameter is empty, null or undefined');
  }
  return next();
}

function validateParamsIDisNumberOrObjectID(context, next) {
  if (Number.isNaN(context.params.id) && !/[a-fA-F0-9]{24}$/.test(context.params.id)) {
    throw new ApiError.InvalidParams('context.params.id should be a Number or an ObjectID');
  }
  logger.debug(`context.params.id object is valid: ${JSON.stringify(context.params.id)}`);
  return next();
}

function validateQueryVUlength(context, next) {
  if (utils.toValenceArray(context.query.vu).length !== 1) {
    throw new ApiError.InvalidQueryParams(`Invalid length of context.query.vu = '${context.query.vp}'. The input string should contain a single triplet FE.PT.GF`);
  }
  logger.debug('context.query.vu is a valence array of length 1');
  return next();
}

// Check for invalid characters (regex, everything except letters, . _ [])
function validateQueryParamContainsNoInvalidCharacters(queryParam) {
  const invalidCharacterIndex = queryParam.search(/[^a-zA-Z0-9.\s[\]_-]/);
  if (invalidCharacterIndex !== -1) {
    throw new ApiError.InvalidQueryParams(`Invalid character in query parameter '${queryParam}' at index = ${invalidCharacterIndex}: '${queryParam[invalidCharacterIndex]}'`);
  }
  logger.debug('Query parameter contains no invalid characters');
}

function validateQueryVPcontainsNoInvalidCharacters(context, next) {
  validateQueryParamContainsNoInvalidCharacters(context.query.vp);
  return next();
}

function validateQueryVUcontainsNoInvalidCharacters(context, next) {
  validateQueryParamContainsNoInvalidCharacters(context.query.vu);
  return next();
}

// Check for invalid combinations: +. .+ start. end.
function validateQueryVPcontainsNoInvalidSequence(context, next) {
  const invalidSequenceIndex = context.query.vp.search(/(\.\s|\s\.|^(\.)|(\.)$)/);
  if (invalidSequenceIndex !== -1) {
    throw new ApiError.InvalidQueryParams(`Invalid sequence in context.query.vp = '${context.query.vp}' starting at index = ${invalidSequenceIndex}`);
  }
  logger.debug('context.query.vp parameter contains no invalid sequence');
  return next();
}

function getMaxValenceTokens(vp) {
  return utils.toTokenArray(utils.toValenceArray(vp))
    .map(vu => vu.length).reduce((a, b) => Math.max(a, b));
}

// Check if a valenceUnit contains more than 3 tokens (Should always be at most FE.PT.GF)
function validateQueryVPvalenceUnitLength(context, next) {
  if (getMaxValenceTokens(context.query.vp) > 3) {
    throw new ApiError.InvalidQueryParams(`MaxValenceLengthExceeded in context.query.vp = '${context.query.vp}'. A valence can only contain up to 3 tokens FE.PT.GF separated by a dot`);
  }
  logger.debug('context.query.vp parameter contains valid valence units token counts');
  return next();
}

function validateQueryStrictVUmatchingParameter(context, next) {
  if (context.query.strictVUMatching
      && context.query.strictVUMatching.length !== 0
      && context.query.strictVUMatching !== 'true'
      && context.query.strictVUMatching !== 'false') {
    throw new ApiError.InvalidQueryParams('context.query.strictVUMatching parameter should be true or false');
  } else if (context.query.strictVUMatching === undefined || context.query.strictVUMatching === 'false') {
    // Set default to false
    context.query.strictVUMatching = false;
  } else if (context.query.strictVUMatching === '' || context.query.strictVUMatching === 'true') {
    context.query.strictVUMatching = true;
  }
  logger.debug(`context.query.strictVUMatching parameter is valid and set to ${JSON.stringify(context.query.strictVUMatching)}`);
  return next();
}

function validateQueryWithExtraCoreFEsParameter(context, next) {
  if (context.query.withExtraCoreFEs
      && context.query.withExtraCoreFEs.length !== 0
      && context.query.withExtraCoreFEs !== 'true'
      && context.query.withExtraCoreFEs !== 'false') {
    throw new ApiError.InvalidQueryParams('context.query.withExtraCoreFEs parameter should be true or false');
  } else if (context.query.withExtraCoreFEs === undefined || context.query.withExtraCoreFEs === 'true' || context.query.withExtraCoreFEs === '') {
    // Set default to true
    context.query.withExtraCoreFEs = true;
  } else if (context.query.withExtraCoreFEs === 'false') {
    context.query.withExtraCoreFEs = false;
  }
  logger.debug(`context.query.withExtraCoreFEs parameter is valid and set to ${JSON.stringify(context.query.withExtraCoreFEs)}`);
  return next();
}

function containsFrameElement(valenceUnitAsArrayWithFEids) {
  for (const token of valenceUnitAsArrayWithFEids) {
    if (typeof token !== 'string' && (typeof token === 'number' || !token.some(Number.isNaN))) {
      return true;
    }
  }
  return false;
}

function containsUnspecifiedFrameElement(valencePatternAsArrayWithFEids) {
  for (const valenceUnitAsArrayWithFEids of valencePatternAsArrayWithFEids) {
    if (!containsFrameElement(valenceUnitAsArrayWithFEids)) {
      return true;
    }
  }
  return false;
}

// This validation can only be performed after formatting once
// context.valencer.query.vp.withFEids has been set
// Indeed, it requires knowing if all valenceUnits in the specified input
// valence pattern contain a valid Frame Element, which can only be known
// once all tokens have been checked against the specified FrameNet database
function validateQueryParametersCombination(context, next) {
  if (!context.query.strictVUMatching
      && !context.query.withExtraCoreFEs
      && containsUnspecifiedFrameElement(context.valencer.query.vp.withFEids)) {
    throw new ApiError.InvalidQueryParams('The Valencer API cannot process queries with strictVUMatching parameter set to false and withExtraCoreFEs parameter set to false if at least one Frame Element is unspecified in the input Valence Pattern');
  }
  logger.debug('context.query contains valid combinations of strictVUMatching, withExtraCoreFEs and FrameElement combinations');
  return next();
}

function validateQueryFrameIDparameter(context, next) {
  if (context.query.frameID == null) {
    throw new ApiError.InvalidQueryParams('frameID parameter is mandatory');
  }
  const frameID = Number(context.query.frameID);
  if (Number.isNaN(frameID) || !Number.isInteger(frameID) || frameID < 0) {
    throw new ApiError.InvalidQueryParams(`Invalid frameID parameter:
     '${context.query.frameID}'. Should be a valid positive integer`);
  }
  context.valencer.query.frameID = frameID;
  return next();
}

function validateProjectionString(context, next) {
  if (context.params.projection == null) {
    return next();
  }
  const projection = context.params.projection;
  const projections = projection.split(',').filter(p => p !== '');
  const disallowedCharsRegExp = new RegExp(constants.DISALLOW_CHARS_PROJ_POPUL
    .map(c => utils.regExpEscape(c)).join('|'));
  const disallowed = projections.some(p => disallowedCharsRegExp.test(p));
  if (disallowed) {
    throw new ApiError.InvalidQueryParams(`The Valencer API does not allow
      projection fields to have those characters:
      ${constants.DISALLOW_CHARS_PROJ_POPUL.join(', ')}`);
  }
  return next();
}

function validatePopulationString(context, next) {
  if (context.params.population == null) {
    return next();
  }
  const disallowedEscapedChars = constants.DISALLOW_CHARS_PROJ_POPUL
    .map(c => utils.regExpEscape(c)).join('');
  const disallowedCharsRegExp = new RegExp(constants.DISALLOW_CHARS_PROJ_POPUL
    .map(c => utils.regExpEscape(c)).join('|'));
  const populationRegExp = new RegExp(`([^${disallowedEscapedChars}]+)(?:\\[([^\\]]+)\\])?`);
  const population = context.params.population;
  const populations = population.split(',').filter(p => p !== '');
  populations.forEach((p) => {
    const matches = p.match(populationRegExp);
    if (matches == null || matches[0] !== p) {
      throw new ApiError.InvalidQueryParams(`This sub-expression is invalid:
        ${p}. It should be of the form 'populated_field' or
        'populated_field[projection_field1|projection_field2]'. See the API
        documentation for more details.`);
    } else if (matches.length === 5) {
      matches[2].split('|').forEach((m) => {
        if (disallowedCharsRegExp.test(m)) {
          throw new ApiError.InvalidQueryParams(`This projection field is
            invalid: '${m}' in the sub-expression '${p}'. Characters
            ${constants.DISALLOW_CHARS_PROJ_POPUL.join(', ')} are not allowed.`);
        }
      });
    }
  });

  return next();
}

function validateQuerySkipParameter(context, next) {
  if (context.query.skip == null) {
    return next();
  }
  const skip = Number(context.query.skip);
  if (Number.isNaN(skip) || !Number.isInteger(skip) || skip < 0) {
    throw new ApiError.InvalidQueryParams(`Invalid skip parameter:
     '${context.query.skip}'. Should be a valid positive integer`);
  }
  context.valencer.query.skip = skip;
  return next();
}

function validateQueryLimitParameter(context, next) {
  if (context.query.limit == null) {
    return next();
  }
  const limit = Number(context.query.limit);
  if (Number.isNaN(limit) || !Number.isInteger(limit) || limit < 0) {
    throw new ApiError.InvalidQueryParams(`Invalid limit parameter:
     '${context.query.limit}'. Should be a valid positive integer`);
  }
  context.valencer.query.limit = limit;
  return next();
}

module.exports = {
  validatePathToDB,
  validateQueryNotEmpty,
  validateParamsNotEmpty,
  validateQueryVPnotEmpty,
  validateQueryVUnotEmpty,
  validateParamsIDnotEmpty,
  validateParamsIDisNumberOrObjectID,
  validateQueryVUlength,
  validateQueryVPcontainsNoInvalidCharacters,
  validateQueryVUcontainsNoInvalidCharacters,
  validateQueryVPcontainsNoInvalidSequence,
  validateQueryVPvalenceUnitLength,
  validateQueryStrictVUmatchingParameter,
  validateQueryWithExtraCoreFEsParameter,
  validateQueryParametersCombination,
  validateQueryFrameIDparameter,
  validateProjectionString,
  validatePopulationString,
  validateQuerySkipParameter,
  validateQueryLimitParameter,
};
