const ApiError = require('./../exceptions/apiException');
const config = require('./../config');

const logger = config.logger;

function validateQueryNotEmpty(context, next) {
  //logger.debug(`Validating query: ${JSON.stringify(context.query)}`);
  if (!context.query || context.query.trim().length === 0) {
    throw ApiError.InvalidQuery('context.query object is empty, null or undefined');
  }
  return next();
}

function validateParamsNotEmpty(context, next) {
  //logger.debug(`Validating params: ${JSON.stringify(context.params)}`);
  if (!context.params || context.params.trim().length === 0) {
    throw ApiError.InvalidParams('context.params object is empty, null or undefined');
  }
  return next();
}

function validateQueryVPnotEmpty(context, next) {
  if (!context.query.vp || context.query.vp.trim().length === 0) {
    throw ApiError.InvalidQueryParams('context.query.vp parameter is empty, null or undefined');
  }
  return next();
}

function validateParamsIDnotEmpty(context, next) {
  if (!context.params.id || context.params.id.trim().length === 0) {
    throw ApiError.InvalidParams('context.params.id parameter is empty, null or undefined');
  }
  return next();
}

function validateParamsIDisNumberOrObjectID(context, next) {
  if (isNaN(context.params.id) && !/[a-fA-F0-9]{24}$/.test(context.params.id)) {
    throw ApiError.InvalidParams('context.params.id should be a Number or an ObjectID');
  }
  return next();
}

// Check for invalid characters (regex, everything except . and +)
function validateQueryVPcontainsNoInvalidCharacters(context, next) {
  const invalidCharacterIndex = context.query.vp.search(/[^a-zA-Z.+]/);
  if (invalidCharacterIndex !== -1) {
    throw ApiError.InvalidQueryParams(`Invalid character in context.query.vp = '${context.query.vp}' at index = ${invalidCharacterIndex}`);
  }
  return next();
}

// Check for invalid combinations: ++ +. .+ start. end. start+ end+
function validateQueryVPcontainsNoInvalidSequence(context, next) {
  const invalidSequenceIndex = context.query.vp.search(/((\+|\.){2,}|\.\+|\+\.|^(\.|\+)|(\.|\+)$)/);
  if (invalidSequenceIndex !== -1) {
    throw ApiError.InvalidQueryParams(`Invalid sequence in context.query.vp = '${context.query.vp}' starting at index = ${invalidSequenceIndex}`);
  }
  return next();
}

function countValenceTokens(vp) {
  let counterMax = 1;
  for (let i = 0; i < vp.length; i += 1) {
    if (/\./.test(vp[i])) {
      counterMax += 1;
    }
    if (/\s/.test(vp[i])) {
      counterMax = 1;
    }
  }
  return counterMax;
}

// Check if a valenceUnit contains more than 3 tokens (Should always be at most FE.PT.GF)
function validateQueryVPvalenceUnitLength(context, next) {
  if (countValenceTokens(context.query.vp) > 3) {
    throw ApiError.InvalidQueryParams(`MaxValenceLengthExceeded in context.query.vp = '${context.query.vp}'. A valence can only contain up to 3 tokens FE.PT.GF separated by a dot`);
  }
  return next();
}

function validateQueryPopulateParameter(context, next) {
  if (context.query.populate
      && context.query.populate.length !== 0
      && context.query.populate !== 'true'
      && context.query.populate !== 'false') {
    throw ApiError.InvalidQueryParams('context.query.populate parameter should be true or false');
  }
  return next();
}

function validateQueryStrictVUmatchingParameter(context, next) {
  if (context.query.strictVUMatching
      && context.query.strictVUMatching.length !== 0
      && context.query.strictVUMatching !== 'true'
      && context.query.strictVUMatching !== 'false') {
    throw ApiError.InvalidQueryParams('context.query.strictVUMatching parameter should be true or false');
  }
  return next();
}

function validateQueryWithExtraCoreFEsParameter(context, next) {
  if (context.query.withExtraCoreFEs
      && context.query.withExtraCoreFEs.length !== 0
      && context.query.withExtraCoreFEs !== 'true'
      && context.query.withExtraCoreFEs !== 'false') {
    throw ApiError.InvalidQueryParams('context.query.withExtraCoreFEs parameter should be true or false');
  }
  return next();
}

function containsFrameElement(valenceUnitAsArrayWithFEids) {
  for (const token of valenceUnitAsArrayWithFEids) {
    if (typeof token !== 'string' && (typeof token === 'number' || !token.some(isNaN))) {
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
    throw ApiError.InvalidQueryParams('the Valencer API cannot process queries with strictVUMatching parameter set to false and withExtraCoreFEs parameter set to false if at least one Frame Element is unspecified in the input Valence Pattern');
  }
  return next();
}

module.exports = {
  validateQueryNotEmpty,
  validateParamsNotEmpty,
  validateQueryVPnotEmpty,
  validateParamsIDnotEmpty,
  validateParamsIDisNumberOrObjectID,
  validateQueryVPcontainsNoInvalidCharacters,
  validateQueryVPcontainsNoInvalidSequence,
  validateQueryVPvalenceUnitLength,
  validateQueryPopulateParameter,
  validateQueryStrictVUmatchingParameter,
  validateQueryWithExtraCoreFEsParameter,
  validateQueryParametersCombination,
};
