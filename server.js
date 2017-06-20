/**
 *                 _
 *     /\   /\__ _| | ___ _ __   ___ ___ _ __
 *     \ \ / / _` | |/ _ \ '_ \ / __/ _ \ '__|
 *      \ V / (_| | |  __/ | | | (_|  __/ |
 *       \_/ \__,_|_|\___|_| |_|\___\___|_|
 *
 */
const Koa = require('koa');
const cors = require('kcors');
const mongoose = require('mongoose');
const router = require('./routes');
const config = require('./config');

const logger = config.logger;
const app = new Koa();

app.use(cors());
// app.keys = ['my-secret-key'];
// app.use(authenticate());

app.use(async (context, next) => {
  try {
    await next();
  } catch (err) {
    logger.error(err);
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

function printLogo() {
  console.log('            _                                 ');
  console.log('/\\   /\\__ _| | ___ _ __   ___ ___ _ __      ');
  console.log('\\ \\ / / _` | |/ _ \\ \'_ \\ / __/ _ \\ \'__|');
  console.log(' \\ V / (_| | |  __/ | | | (_|  __/ |         ');
  console.log('  \\_/ \\__,_|_|\\___|_| |_|\\___\\___|_|     ');
  console.log('                                              ');
  console.log('                                              ');
}

(async () => {
  try {
    printLogo();
    logger.info('Welcome to the Valencer!');
    logger.info('------------------------');
    logger.info('Connecting to MongoDB...');
    const db = await connectToDatabase('mongodb://localhost:27017/fn_en_d150_dev');
    logger.info(`Connected to MongoDB on server '${db.host}', port '${db.port}' and default database '${db.name}'`);
    await app.listen(config.api.port);
    logger.info(`Valencer started on port ${config.api.port}`);
  } catch (err) {
    logger.error(`Unable to connect to database at: ${config.dbUri}`);
    logger.debug(err);
    process.exit(1);
  }
})();
