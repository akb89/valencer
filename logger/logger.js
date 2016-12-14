import winston from 'winston';

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
    new (winston.transports.File)({
      filename: 'valencer.log',
      level: 'verbose',
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
    new (winston.transports.File)({
      filename: 'valencer.log',
      level: 'debug',
      colorize: true,
    }),
  ],
});


export default {
  warn,
  info,
  debug,
  verbose,
};
