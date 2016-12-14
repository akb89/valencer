import config from '../config';
import ApiError from './../exceptions/apiException';

const logger = config.logger;

function countValence(vp) {
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

function validate(context, next) {
  const query = context.query;
  const params = context.params;
  logger.debug(`Validating query: ${JSON.stringify(query)} and/or parameters: ${JSON.stringify(params)}`);
  if ((!query.vp || Object.keys(query.vp).length === 0)
    && (!params || Object.keys(params).length === 0)) {
    throw ApiError.InvalidQuery(`No specified parameters in query: ${context.querystring}`);
  }
  if (query.vp
    && Object.keys(query.vp).length !== 0
    && params
    && Object.keys(params).length !== 0) {
    throw ApiError.InvalidQuery(`Cannot combine vp and parameters in request: ${context.querystring}`);
  }
  if (query.populate && Object.keys(query.populate).length !== 0
    && query.populate !== 'true'
    && query.populate !== 'false') {
    throw ApiError.InvalidQueryParams('populate should be true or false');
  }
  if (params && Object.keys(params).length !== 0) {
    if (!params.id) {
      throw ApiError.InvalidQueryParams(':id is not specified');
    } else if (params.id.trim().length === 0 || isNaN(params.id)) {
      throw ApiError.InvalidQueryParams(':id should be a number');
    }
  }
  if (query && query.vp && Object.keys(query.vp).length !== 0) {
    const vp = query.vp;
    // Check for invalid characters (regex, everything except . and +)
    const invalidCharacterIndex = vp.search(/[^.\s\w\[\]]/);
    if (invalidCharacterIndex !== -1) {
      throw ApiError.IllFormedQuery(`Invalid character in vp '${vp}' at index ${invalidCharacterIndex}`);
    }
    const invalidSquenceIndex = vp.search(/(\s{2,}|\.{2,}|\[{2,}|]{2,}|\.\s|\.\[|\s\.|^[.\s]|[.\s]$)/);
    // Check for invalid combinations: ++ +. .+ start. end. start+ end+
    if (invalidSquenceIndex !== -1) {
      throw ApiError.IllFormedQuery(`Invalid sequence in vp '${vp}' starting at index ${invalidSquenceIndex}`);
    }
    // throw error if length of valenceArray is > 3
    if (countValence(vp) > 3) {
      throw ApiError.IllFormedQuery(`MaxValenceLengthExceeded in vp '${vp}'. A valence can only contain up to 3 tokens FE.PT.GF separated by a dot`);
    }
  }
  return next();
}

export default {
  validate,
};
