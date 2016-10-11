'use strict';

function GenericError (name, code, error, status) {
  Error.call(this, error.message);
  Error.captureStackTrace(this, this.constructor);
  this.name = name;
  this.message = error.message;
  this.code = code;
  this.status = status || 500;
  this.inner = error;
}
GenericError.prototype = Object.create(Error.prototype);
GenericError.prototype.constructor = GenericError;

module.exports = GenericError;
