'use strict';

const winston = require('winston');

// Logging in Console and File

var info = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({level: 'info', colorize: true})//,
        //new (winston.transports.File)({filename: 'noFrameNet.log', level: 'error', colorize: true})
    ]
});

var debug = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({level: 'debug', colorize: true})//,
        //new (winston.transports.File)({filename: 'noFrameNet.log', level: 'error', colorize: true})
    ]
});

module.exports = {
    info,
    debug
};