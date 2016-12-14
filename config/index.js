// Because of the export default works with babel, we need to use classic require
import logger from './../logger/logger';

const env = process.env.NODE_ENV || 'development';
let tmp;
try {
  tmp = require(`./${env}.js`); // eslint-disable-line
} catch (error) {
  logger.info.error(error);
  logger.info.error(`No specific configuration for env ${env}`);
  process.exit(1);
}

const config = tmp;


export default config;
