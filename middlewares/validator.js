import config from '../config';
import ApiError from './../exceptions/apiException';

const logger = config.logger;

function countValence(vp) {
  let counterMax = 1;
  for (let i = 0; i < vp.length; i += 1) {
    if (vp[i] === '.') {
      counterMax += 1;
    }
    if (vp[i] === '+') {
      counterMax = 1;
    }
  }
  return counterMax;
}

function validate(context, next) {
  const query = context.query;
  const params = context.params;
  logger.debug(`Validating query: ${query} and/or parameters: ${params}`);
  if (query && query.vp !== undefined && params !== undefined) {
    throw ApiError.InvalidQuery(`Cannot combine vp and parameters in request: ${context.querystring}`);
  }
  if (query) {
    if (query.populate !== undefined
      && query.populate !== 'true'
      && query.populate !== 'false') {
      throw ApiError.InvalidQueryParams('populate should be true or false');
    }
  }
  if (params) {
    if (!params.id) {
      throw ApiError.InvalidQueryParams(':id is not specified');
    } else if (params.id.trim().length === 0 || isNaN(params)) {
      throw ApiError.InvalidQueryParams(':id should be a number');
    }
  }
  if (query !== undefined) {
    const vp = query.vp;
    // Check for invalid characters (regex, everything except . and +)
    const invalidCharacterIndex = vp.search(/[^?!.\s\w]/);
    if (invalidCharacterIndex !== -1) {
      throw ApiError.IllFormedQuery(`Invalid character in vp '${vp}' at index ${invalidCharacterIndex}`);
    }
    const invalidSquenceIndex = vp.search(/(\s{2,}|\.{2,}|\.\s|\s\.|^[.\s]|[.\s]$)/);
    // Check for invalid combinations: ++ +. .+ start. end. start+ end+
    if (invalidSquenceIndex !== -1) {
      throw ApiError.IllFormedQuery(`Invalid sequence in vp '${vp}' starting at index ${invalidSquenceIndex}`);
    }
    // throw error if length of valenceArray is > 3
    if (countValence(vp) > 3) {
      throw ApiError.IllFormedQuery(`MaxValenceLength exceeded in vp '${vp}'. A valence can only contain up to 3 tokens FE.PT.GF separated by a dot`);
    }
  }
  return next();
}

export default {
  validate,
};
