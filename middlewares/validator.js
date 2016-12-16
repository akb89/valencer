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
  if (query) {
    // Test if the query is empty: query.vp is
    // empty/null/undefined and params is empty/null/undefined
    if ((!query.vp || query.vp.trim().length === 0) && (!params ||
      !params.id || params.id.trim().length === 0)) {
      throw ApiError.InvalidQuery('Empty query and parameters');
    }
    // Test if the query specifies both vp and params
    if (query.vp && query.vp.trim().length !== 0 && params && params.id
      && params.id.trim().length !== 0) {
      throw ApiError.InvalidQuery(`Cannot combine vp and parameters in request: ${context.querystring}`);
    }
    // Test if the query contains an invalid populate value
    if (query.populate && query.populate.length !== 0
      && query.populate !== 'true'
      && query.populate !== 'false') {
      throw ApiError.InvalidQueryParams('populate parameter should be true or false');
    }
    // If params is specified, test that it is not empty and that
    // it contains valid characters
    if (!query.vp && params) {
      if (!params.id || params.id.trim().length === 0) {
        throw ApiError.InvalidQueryParams(':id is not specified'); // TODO: remove, this is useless...
      } else if (isNaN(params.id)) {
        if (!/[a-fA-F0-9]{24}$/.test(params.id)) {
          throw ApiError.InvalidQueryParams(':id should be a Number or an ObjectID');
        }
      }
    }
    // If query.vp is specified, test that it is not empty
    if (query.vp && query.vp.trim().length !== 0) {
      const vp = query.vp;
      // Check for invalid characters (regex, everything except . and +)
      const invalidCharacterIndex = vp.search(/[^.\s\w[\]]/);
      if (invalidCharacterIndex !== -1) {
        throw ApiError.InvalidQueryParams(`Invalid character in vp '${vp}' at index ${invalidCharacterIndex}`);
      }
      const invalidSquenceIndex = vp.search(/(\s{2,}|\.{2,}|\[{2,}|]{2,}|\.\s|\.\[|\s\.|^[.\s]|[.\s]$)/);
      // Check for invalid combinations: ++ +. .+ start. end. start+ end+
      if (invalidSquenceIndex !== -1) {
        throw ApiError.InvalidQueryParams(`Invalid sequence in vp '${vp}' starting at index ${invalidSquenceIndex}`);
      }
      // throw error if length of valenceArray is > 3
      if (countValence(vp) > 3) {
        throw ApiError.InvalidQueryParams(`MaxValenceLengthExceeded in vp '${vp}'. A valence can only contain up to 3 tokens FE.PT.GF separated by a dot`);
      }
    }
  } else {
    throw ApiError.InvalidQuery('Query object is null or undefined');
  }
  return next();
}

export default {
  validate,
};
