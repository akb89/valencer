'use strict';

const util = require('util');

function InvalidInputException(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}

function NotFoundException(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}

util.inherits(InvalidInputException, Error);
util.inherits(NotFoundException, Error);

export {
    InvalidInputException,
    NotFoundException
};