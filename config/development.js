import logger from './../logger/logger';

const development = {
  dbUri: 'mongodb://localhost:27017/noframenet16dev',
  port: 3030,
  logger: logger.debug,
};

module.exports = development;
