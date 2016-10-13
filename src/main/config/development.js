'use strict';

import Logger from './../logger';

const development = {
    dbUri: 'mongodb://localhost:27017/valencer',
    port: 3030,
    logger: Logger.info,
};

module.exports = development;
