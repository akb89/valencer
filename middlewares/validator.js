const ApiError = require('./../exceptions/apiException');
const config = require('./../config');

const logger = config.logger;

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

function validateQueryVPnotEmpty(context, next) {
  if (!context.query.vp) {
    throw new ApiError.InvalidQueryParams('context.query.vp parameter is empty, null or undefined');
  }
  logger.debug('context.query.vp parameter is not empty');
  context.query.vp = context.query.vp.trim();
  return next();
}

function validateParamsIDnotEmpty(context, next) {
  if (!context.params.id) {
    throw new ApiError.InvalidParams('context.params.id parameter is empty, null or undefined');
  }
  return next();
}

function validateParamsIDisNumberOrObjectID(context, next) {
  if (isNaN(context.params.id) && !/[a-fA-F0-9]{24}$/.test(context.params.id)) {
    throw new ApiError.InvalidParams('context.params.id should be a Number or an ObjectID');
  }
  logger.debug(`context.params.id object is valid: ${JSON.stringify(context.params.id)}`);
  return next();
}

// Check for invalid characters (regex, everything except letters, . and [])
function validateQueryVPcontainsNoInvalidCharacters(context, next) {
  const invalidCharacterIndex = context.query.vp.search(/[^a-zA-Z.\s[\]]/);
  if (invalidCharacterIndex !== -1) {
    throw new ApiError.InvalidQueryParams(`Invalid character in context.query.vp = '${context.query.vp}' at index = ${invalidCharacterIndex}: '${context.query.vp[invalidCharacterIndex]}'`);
  }
  logger.debug('context.query.vp parameter contains no invalid characters');
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
    throw new ApiError.InvalidQueryParams('the Valencer API cannot process queries with strictVUMatching parameter set to false and withExtraCoreFEs parameter set to false if at least one Frame Element is unspecified in the input Valence Pattern');
  }
  logger.debug('context.query contains valid combinations of strictVUMatching, withExtraCoreFEs and FrameElement combinations');
  return next();
}

function validatePathToDB(context, next) {
  //const urlSplit = context.request.url.split('/');
  //context.valencer.database = `fn_${urlSplit[2]}_${urlSplit[3]}`;
  logger.debug(`context.valencer.database is valid and set to ${JSON.stringify('BLANK')}`);
  return next();
}

module.exports = {
  validatePathToDB,
  validateQueryNotEmpty,
  validateParamsNotEmpty,
  validateQueryVPnotEmpty,
  validateParamsIDnotEmpty,
  validateParamsIDisNumberOrObjectID,
  validateQueryVPcontainsNoInvalidCharacters,
  validateQueryVPcontainsNoInvalidSequence,
  validateQueryVPvalenceUnitLength,
  validateQueryStrictVUmatchingParameter,
  validateQueryWithExtraCoreFEsParameter,
  validateQueryParametersCombination,
};
