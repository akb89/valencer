const logger = require('./../logger/logger');

const production = {
  logger: logger.info,
  api: {
    port: 3030,
  },
  databases: {
    en: {
      150: 'mongodb://localhost:27017/fn_en_150',
      160: 'mongodb://localhost:27017/fn_en_160',
      170: 'mongodb://localhost:27017/fn_en_170',
    },
    ja: {
      100: 'mongodb://localhost:27017/fn_ja_100_dev',
    },
  },
};

module.exports = production;
