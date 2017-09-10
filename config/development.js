const logger = require('./../logger/logger');

const config = {
  logger: logger.debug,
  api: {
    port: 3031,
  },
  databases: {
    server: 'localhost',
    port: 27017,
    names: {
      en: {
        150: 'fn_en_150',
        160: 'fn_en_160',
        170: 'fn_en_170',
      },
      ja: {
        100: 'fn_ja_100',
      },
    },
  },
};

module.exports = config;
