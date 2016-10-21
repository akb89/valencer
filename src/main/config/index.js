'use strict';

// Because of the export default works with babel, we need to use classic require
import _ from 'lodash';
import { all as baseConfig } from './all';
import Logger from './../logger';

const env = process.env.NODE_ENV || 'development';
let config;

try {
  config = require(`./${env}.js`);
} catch (error) {
  Logger.info(error);
  Logger.info(`No specific configuration for env ${env}`);
}

export default _.merge(baseConfig, config);
