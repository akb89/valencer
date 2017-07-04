const logger = require('./../logger/logger');

const development = {
  logger: logger.debug,
  api: {
    port: 3030,
  },
  databases: {
    en: {
      150: 'mongodb://localhost:27017/fn_en_150_dev',
      160: 'mongodb://localhost:27017/fn_en_160_dev',
      170: 'mongodb://localhost:27017/fn_en_170_dev',
    },
    ja: {
      100: 'mongodb://localhost:27017/fn_ja_100_dev',
    },
  },
};

module.exports = development;
