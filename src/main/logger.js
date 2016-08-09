'use strict';

const winston = require('winston');

// Logging in Console and File

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({level: 'info', colorize: true})//,
        //new (winston.transports.File)({filename: 'noFrameNet.log', level: 'error', colorize: true})
    ]
});
module.exports = logger;