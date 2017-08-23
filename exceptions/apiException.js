class NoAuthorizationHeaderError extends Error {
  constructor(message, extra) {
    super(message);
    this.message = 'No authorization header found. You should provide an Authorization header with Authorization: api_key:signature';
    this.name = 'NoAuthorizationHeaderError';
    this.extra = extra;
    this.status = 417;
  }
}

class NoTwoPartAuthorizationError extends Error {
  constructor(message, extra) {
    super(message);
    this.message = 'Authorization header should be of two parts: api_key:signature';
    this.name = 'NoTwoPartAuthorizationError';
    this.extra = extra;
    this.status = 417;
  }
}

class InvalidAPIKey extends Error {
  constructor(message, extra) {
    super(message);
    this.message = 'API Key does not exist';
    this.name = 'InvalidAPIKey';
    this.extra = extra;
    this.status = 403;
  }
}

class InvalidSignature extends Error {
  constructor(message, extra) {
    super(message);
    this.message = 'The signature does not match';
    this.name = 'InvalidSignature';
    this.extra = extra;
    this.status = 403;
  }
}

class InvalidTimestamp extends Error {
  constructor(message, extra) {
    super(message);
    this.message = 'Invalid timestamp';
    this.name = 'InvalidTimestamp';
    this.extra = extra;
    this.status = 403;
  }
}

class InvalidQuery extends Error {
  constructor(message, extra) {
    super(message);
    this.message = message;
    this.name = 'InvalidQuery';
    this.extra = extra;
    this.status = 400;
  }
}

class InvalidParams extends Error {
  constructor(message, extra) {
    super(message);
    this.message = message;
    this.name = 'InvalidParams';
    this.extra = extra;
    this.status = 400;
  }
}

class InvalidQueryParams extends Error {
  constructor(message, extra) {
    super(message);
    this.message = message;
    this.name = 'InvalidQueryParams';
    this.extra = extra;
    this.status = 400;
  }
}

class NotFoundError extends Error {
  constructor(message, extra) {
    super(message);
    this.message = message;
    this.name = 'NotFoundError';
    this.extra = extra;
    this.status = 404;
  }
}

module.exports = {
  NoAuthorizationHeaderError,
  NoTwoPartAuthorizationError,
  InvalidAPIKey,
  InvalidSignature,
  InvalidTimestamp,
  InvalidQuery,
  InvalidParams,
  InvalidQueryParams,
  NotFoundError,
};
