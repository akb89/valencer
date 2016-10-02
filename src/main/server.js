'use strict';

import Koa from 'koa';
import winstonKoaLogger from 'winston-koa-logger';
import mongoose from 'mongoose';
import router from './routes';
import development from './config/development';
import testing from './config/testing';
import production from './config/production';

// TODO: what about testing?
const config = (process.env.NODE_ENV == 'production' ) ? production : development;
/*
 var _config;
 try{
 _config = require(`./config/${env}`);
 }catch(err){
 console.error(err);
 console.error(`No specific configuration for env ${env}`);
 process.exit(1);
 }
 */

const logger = config.logger;
const app = new Koa();

app.use(winstonKoaLogger(logger));
//app.keys = ['my-secret-key'];
//app.use(auth());
app.use(router.routes());
app.use(router.allowedMethods());
//app.use(ctx => ctx.status = 404);

(async() => {
    try {
        const db = await connectToDatabase(config.database);
        logger.info(`Connected to MongoDB on ${db.host}:${db.port}/${db.name}`);
    } catch (err) {
        logger.error(`Unable to connect to database at uri: ${config.database}`);
        logger.error(err);
    }
    await app.listen(config.port);
    logger.info(`Valencer API started on port ${config.port}`);
})();

function connectToDatabase(uri) {
    return new Promise((resolve, reject) => {
        mongoose.connection
            .on('error', error => reject(error))
            .on('close', () => logger.info('Database connection closed.'))
            .once('open', () => resolve(mongoose.connections[0]));

        mongoose.connect(uri);
    });
}

export default config;