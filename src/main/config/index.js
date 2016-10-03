'use strict';

//Because of the export default works with babel, we need to use classic require
const baseConfig = require('./all');

import _ from 'lodash';
import Logger from './../logger';

const env = process.env.NODE_ENV || 'development';
let config;

try {
    config = require(`./${env}.js`);
}
catch (error) {
    Logger.info(error);
    Logger.info(`No specific configuration for env ${env}`);
}

export default _.merge(baseConfig, config);
