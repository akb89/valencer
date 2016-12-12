import GenericException from './genericException';

function InvalidQuery(query, details) {
  const message = query.concat('\n').concat(details);
  return new GenericException('InvalidQuery', 6, new Error(message), 400);
}

function InvalidQueryParams(param, details) {
  const message = param.concat(details);
  return new GenericException('InvalidQueryParams', 7, new Error(message), 400);
}

function InvalidValencePattern() {
  return new GenericException('InvalidValencePattern', 8, new Error(), 400);
}

function NotFoundError() {
  return new GenericException('NotFoundError', 9, new Error(), 404);
}

export default {
  NoAuthorizationHeaderError: new GenericException('NoAuthorizationHeaderError', 1,
    new Error('No authorization header found. You should provide an Authorization header with Authorization: api_key:signature.'),
    417),

  NoTwoPartAuthorizationError: new GenericException('NoTwoPartAuthorizationError', 2,
    new Error('Authorization header should be of two parts: api_key:signature.'),
    417),

  InvalidAPIKey: new GenericException('InvalidAPIKey', 3,
    new Error('API Key does not exist.'),
    403),

  InvalidSignature: new GenericException('InvalidSignature', 4,
    new Error('The signature does not match.'),
    403),

  InvalidTimestamp: new GenericException('InvalidTimestamp', 5,
    new Error('Invalid timestamp.'),
    403),
  InvalidQuery,
  InvalidQueryParams,
  InvalidValencePattern,
  NotFoundError,
};
