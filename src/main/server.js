'use strict';

const koa = require('koa');
const app = koa();
const winstonKoaLogger = require('winston-koa-logger');
const router = require('./routes');
const mongoose = require('mongoose');
const env = process.env.NODE_ENV || 'development';

var _config;
try{
    _config = require(`./config/${env}`);
}catch(err){
    console.error(err);
    console.error(`No specific configuration for env ${env}`);
    process.exit(1);
}

const logger = _config.logger;

app.use(winstonKoaLogger(logger));

// TODO the connection to mongodb should be set upon startup, not at the first request
app.use(function*(next){
    if(mongoose.connection.readyState === 0){
        try {
            yield mongoose.connect(_config.database);
            const db = mongoose.connection;
            logger.info(`Connected to ${db.host}:${db.port}/${db.name}`);
        } catch (err) {
            logger.error(err);
            logger.error(`Unable to connect to database at uri: ${_config.database}`);
            process.exit(1);
        }
    }
    yield next;
});
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(_config.port);
logger.info(`Valencer API started on port ${_config.port}`);

//FIXME
module.exports = {
    config: _config
};
