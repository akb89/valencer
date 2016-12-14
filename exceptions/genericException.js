function GenericException(name, code, error, status) {
  Error.call(this, error.message);
  Error.captureStackTrace(this, this.constructor);
  this.name = name;
  this.message = error.message;
  this.code = code;
  this.status = status || 500;
  this.inner = error;
}
GenericException.prototype = Object.create(Error.prototype);
GenericException.prototype.constructor = GenericException;


export default GenericException;
