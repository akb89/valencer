'use strict';

import winston from 'winston';

class Logger {
  static get info() {
    return new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({ level: 'info', colorize: true }),
        // new (winston.transports.File)({filename: 'noFrameNet.log', level: 'error', colorize:
        // true})
      ],
    });
  }

  static get debug() {
    return new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({ level: 'debug', colorize: true }),
        // new (winston.transports.File)({filename: 'noFrameNet.log', level: 'error', colorize:
        // true})
      ],
    });
  }
}

export default Logger;
