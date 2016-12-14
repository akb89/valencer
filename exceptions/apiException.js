import GenericException from './genericException';

function NoAuthorizationHeaderError() {
  return new GenericException('NoAuthorizationHeaderError', 1,
    new Error('No authorization header found. You should provide an Authorization header with Authorization: api_key:signature.'),
    417);
}

function NoTwoPartAuthorizationError() {
  return new GenericException('NoTwoPartAuthorizationError', 2,
    new Error('Authorization header should be of two parts: api_key:signature.'),
    417);
}

function InvalidAPIKey() {
  return new GenericException('InvalidAPIKey', 3,
    new Error('API Key does not exist.'),
    403);
}

function InvalidSignature() {
  return new GenericException('InvalidSignature', 4,
    new Error('The signature does not match.'),
    403);
}

function InvalidTimestamp() {
  return new GenericException('InvalidTimestamp', 5,
    new Error('Invalid timestamp.'),
    403);
}

function InvalidQuery(message) {
  return new GenericException('InvalidQuery', 6, new Error(message), 400);
}

function InvalidQueryParams(message) {
  return new GenericException('InvalidQueryParams', 7, new Error(message), 400);
}

function NotFoundError() {
  return new GenericException('NotFoundError', 8, new Error(), 404);
}

export default {
  NoAuthorizationHeaderError,
  NoTwoPartAuthorizationError,
  InvalidAPIKey,
  InvalidSignature,
  InvalidTimestamp,
  InvalidQuery,
  InvalidQueryParams,
  NotFoundError,
};
