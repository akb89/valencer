const winston = require('winston');
const logpath = require('logpath');
const path = require('path');
require('winston-logrotate');

const valencerlogpath = path.join(logpath.createAndGetLogFilePath(), 'valencer.log');

const warn = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'warn',
      colorize: true,
    }),
  ],
});

const info = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'info',
      colorize: true,
    }),
    new (winston.transports.Rotate)({
      file: valencerlogpath,
      level: 'debug',
      colorize: true,
      timestamp: true,
      json: false,
      size: '100m',
      keep: 20,
      compress: true,
    }),
  ],
});

const verbose = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'verbose',
      colorize: true,
    }),
  ],
});

const debug = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
      colorize: true,
    }),
    new (winston.transports.Rotate)({
      file: valencerlogpath,
      level: 'debug',
      colorize: true,
      timestamp: true,
      json: false,
      size: '100m',
      keep: 20,
      compress: true,
    }),
  ],
});

module.exports = {
  warn,
  info,
  debug,
  verbose,
};
