const logger = require('./../logger/logger');

const config = {
  dbUri: 'mongodb://localhost:27017/valencertest',
  logger: logger.warn,
};

module.exports = config;
