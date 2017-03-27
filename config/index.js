const logger = require('./../logger/logger');

const env = process.env.NODE_ENV || 'development';
let tmp;
try {
  tmp = require(`./${env}.js`); // eslint-disable-line
} catch (error) {
  logger.info.error(error);
  logger.info.error(`No specific configuration for env ${env}`);
  process.exit(1);
}

module.exports = tmp;
