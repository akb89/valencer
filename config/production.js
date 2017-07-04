const logger = require('./../logger/logger');

const production = {
  logger: logger.info,
  api: {
    port: 3030,
  },
  databases: {
    en: {
      d150: 'mongodb://localhost:27017/fn_en_d150_dev',
      d160: 'mongodb://localhost:27017/fn_en_d160_dev',
      d170: 'mongodb://localhost:27017/fn_en_d170_dev',
    },
    ja: {
      d100: 'mongodb://localhost:27017/fn_ja_100_dev',
    },
  },
};

module.exports = production;
