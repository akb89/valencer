/**
 *                 _
 *     /\   /\__ _| | ___ _ __   ___ ___ _ __
 *     \ \ / / _` | |/ _ \ '_ \ / __/ _ \ '__|
 *      \ V / (_| | |  __/ | | | (_|  __/ |
 *       \_/ \__,_|_|\___|_| |_|\___\___|_|
 *
 */
import Koa from 'koa';
import cors from 'kcors';
import mongoose from 'mongoose';
import router from './routes';
import config from './config';

const logger = config.logger;
const app = new Koa();

app.use(cors());
// app.keys = ['my-secret-key'];
// app.use(authenticate());

app.use(async (context, next) => {
  try {
    await next();
  } catch (err) {
    logger.error(err.message);
    logger.debug(err);
    err.expose = true; // expose the error to the context;
    context.status = err.status || 500;
    context.body = err.message;
  }
});
app.use(router.routes());
app.use(router.allowedMethods());

function connectToDatabase(uri) {
  return new Promise((resolve, reject) => {
    mongoose.connection
      .on('error', error => reject(error))
      .on('close', () => logger.info('Database connection closed.'))
      .once('open', () => resolve(mongoose.connections[0]));
    mongoose.connect(uri);
  });
}
/*
async function connectToDatabase(uri) {
  return async () => {
    await mongoose.connection
      .on('error', error => logger.error(error))
      .on('close', () => logger.info('Database connection closed.'))
      .once('open', () => mongoose.connections[0]);
    await mongoose.connect(uri);
  };
}*/

function printLogo() {
  logger.info('            _                                 ');
  logger.info('/\\   /\\__ _| | ___ _ __   ___ ___ _ __      ');
  logger.info('\\ \\ / / _` | |/ _ \\ \'_ \\ / __/ _ \\ \'__|');
  logger.info(' \\ V / (_| | |  __/ | | | (_|  __/ |         ');
  logger.info('  \\_/ \\__,_|_|\\___|_| |_|\\___\\___|_|     ');
  logger.info('                                              ');
}

(async () => {
  try {
    logger.info('Starting Valencer...');
    printLogo();
    logger.info('Connecting to MongoDB...');
    const db = await connectToDatabase(config.dbUri);
    logger.info(`Connected to MongoDB on ${db.host}:${db.port}/${db.name}`);
    await app.listen(config.port);
    logger.info(`Valencer started on port ${config.port}`);
  } catch (err) {
    logger.error(`Unable to connect to database at: ${config.dbUri}`);
    logger.debug(err);
    process.exit(1);
  }
})();
