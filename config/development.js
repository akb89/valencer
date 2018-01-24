const logger = require('./../logger/logger');

const config = {
  logger: logger.debug,
  api: {
    port: 3030,
  },
  databases: {
    server: 'localhost',
    port: 27017,
    names: {
      en: {
        150: 'fn_en_150_dev',
        160: 'fn_en_160_dev',
        170: 'fn_en_170_dev',
      },
      ja: {
        100: 'fn_ja_100',
      },
    },
  },
};

module.exports = config;
