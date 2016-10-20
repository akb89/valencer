/***
 *                 _
 *     /\   /\__ _| | ___ _ __   ___ ___ _ __
 *     \ \ / / _` | |/ _ \ '_ \ / __/ _ \ '__|
 *      \ V / (_| | |  __/ | | | (_|  __/ |
 *       \_/ \__,_|_|\___|_| |_|\___\___|_|
 *
 */

'use strict';

import Koa from 'koa';
import winstonKoaLogger from 'winston-koa-logger';
import mongoose from 'mongoose';
import router from './routes';
import config from './config';
import testing from './config/testing';
import production from './config/production';

// TODO: what about testing?
// Corentin: Testing is properly handled in config/index.js
//const config = (process.env.NODE_ENV == 'production' ) ? production : development;
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
        printLogo();
        const db = await connectToDatabase(config.dbUri);
        logger.info(`Connected to MongoDB on ${db.host}:${db.port}/${db.name}`);
    } catch (err) {
        logger.error(`Unable to connect to database at uri: ${config.dbUri}`);
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

function printLogo(){
    console.log('                 _                                 ');
    console.log('     /\\   /\\__ _| | ___ _ __   ___ ___ _ __      ');
    console.log('     \\ \\ / / _` | |/ _ \\ \'_ \\ / __/ _ \\ \'__|');
    console.log('      \\ V / (_| | |  __/ | | | (_|  __/ |         ');
    console.log('       \\_/ \\__,_|_|\\___|_| |_|\\___\\___|_|     ');
    console.log('                                                   ');
}
