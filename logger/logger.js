const winston = require('winston');

const myFormat = winston.format.combine(winston.format.timestamp(),
                                        winston.format.colorize(),
                                        winston.format.printf(logged => `[${logged.timestamp}] ${logged.level}: ${logged.message}`));

const warn = winston.createLogger({
  transports: [
    new (winston.transports.Console)({
      format: myFormat,
      level: 'warn',
      colorize: true,
    }),
  ],
});

const info = winston.createLogger({
  transports: [
    new (winston.transports.Console)({
      format: myFormat,
      level: 'info',
      colorize: true,
    }),
  ],
});

const verbose = winston.createLogger({
  transports: [
    new (winston.transports.Console)({
      format: myFormat,
      level: 'verbose',
      colorize: true,
    }),
  ],
});

const debug = winston.createLogger({
  transports: [
    new (winston.transports.Console)({
      format: myFormat,
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
