const winston = require('winston');

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
  ],
});

module.exports = {
  warn,
  info,
  debug,
  verbose,
};
