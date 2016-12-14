import logger from './../logger/logger';

const production = {
  dbUri: 'mongodb://localhost:27017/noframenet16',
  port: 3030,
  logger: logger.info,
};

module.exports = production;
