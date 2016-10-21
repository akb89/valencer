/**
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

const logger = config.logger;
const app = new Koa();

app.use(winstonKoaLogger(logger));
// app.keys = ['my-secret-key'];
// app.use(authenticate());
app.use(router.routes());
app.use(router.allowedMethods());
// app.use(ctx => ctx.status = 404);

function connectToDatabase(uri) {
  return new Promise((resolve, reject) => {
    mongoose.connection
        .on('error', error => reject(error))
        .on('close', () => logger.info('Database connection closed.'))
        .once('open', () => resolve(mongoose.connections[0]));

    mongoose.connect(uri);
  });
}

function printLogo() {
  logger.info('            _                                 ');
  logger.info('/\\   /\\__ _| | ___ _ __   ___ ___ _ __      ');
  logger.info('\\ \\ / / _` | |/ _ \\ \'_ \\ / __/ _ \\ \'__|');
  logger.info(' \\ V / (_| | |  __/ | | | (_|  __/ |         ');
  logger.info('  \\_/ \\__,_|_|\\___|_| |_|\\___\\___|_|     ');
  logger.info('                                              ');
}

(async() => {
  try {
    logger.info('Starting Valencer server...');
    printLogo();
    logger.info('Connecting to MongoDB...');
    const db = await connectToDatabase(config.dbUri);
    logger.info(`Connected to MongoDB on ${db.host}:${db.port}/${db.name}`);
    await app.listen(config.port);
    logger.info(`Valencer API started on port ${config.port}`);
  } catch (err) {
    logger.error(`Unable to connect to database at: ${config.dbUri}`);
    logger.debug(err);
    process.exit(1);
  }
})();
