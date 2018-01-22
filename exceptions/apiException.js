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
  InvalidQuery,
  InvalidParams,
  InvalidQueryParams,
  NotFoundError,
};
