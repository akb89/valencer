const logger = require('./../logger/logger');

const development = {
  dbUri: 'mongodb://localhost:27017/fn_en_150_dev',
  port: 3030,
  logger: logger.debug,
  api: {
    port: 3030,
    logger: logger.debug,
  },
  mongodb: {
    server: 'localhost',
    port: 27017,
  },
  en: {
    versions: new Set([150, 160, 170]),
  },
};

module.exports = development;
