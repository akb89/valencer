const logger = require('./../logger/logger');

const testing = {
  dbUri: 'mongodb://localhost:27017/valencertest',
  logger: logger.warn,
};

module.exports = testing;
