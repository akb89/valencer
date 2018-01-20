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
const compress = require('koa-compress');
const zlib = require('zlib');
const router = require('./routes');
const config = require('./config');

const logger = config.logger;
const app = new Koa();

app.use(cors({
  exposeHeaders: ['Total-Count', 'Skip', 'Limit'],
}));
app.use(compress({
  threshold: 1024,
  flush: zlib.constants.Z_SYNC_FLUSH,
}));

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

function printLogo() {
  console.log('            _                                 '); // eslint-disable-line
  console.log('/\\   /\\__ _| | ___ _ __   ___ ___ _ __      '); // eslint-disable-line
  console.log('\\ \\ / / _` | |/ _ \\ \'_ \\ / __/ _ \\ \'__|'); // eslint-disable-line
  console.log(' \\ V / (_| | |  __/ | | | (_|  __/ |         '); // eslint-disable-line
  console.log('  \\_/ \\__,_|_|\\___|_| |_|\\___\\___|_|     '); // eslint-disable-line
  console.log('                                              '); // eslint-disable-line
  console.log('                                              '); // eslint-disable-line
}

(async () => {
  try {
    printLogo();
    const dbServer = config.databases.server;
    const dbPort = config.databases.port;
    const dbUri = `mongodb://${dbServer}:${dbPort}`;
    await mongoose.connect(dbUri, { useMongoClient: true });
    logger.info(`Connected to MongoDB on server: '${dbServer}' and port '${dbPort}'`);
    await app.listen(config.api.port);
    logger.info(`Valencer started on port ${config.api.port}`);
  } catch (err) {
    logger.error(err.message);
    logger.debug(err);
    process.exit(1);
  }
})();
