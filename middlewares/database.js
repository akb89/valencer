const mongoose = require('mongoose');
const config = require('./../config');

const logger = config.logger;

function connect(databases) {
  return async function createConnection(context, next) {
    const urlSplit = context.request.url.split('/');
    const dbName = `fn_${urlSplit[2]}_${urlSplit[3]}`;
    const dbUri = config.databases[urlSplit[2]][urlSplit[3]];
    if (!databases.connections[dbName]) {
      logger.info(`Creating connection to ${dbUri}`);
      if (mongoose.connection.readyState === 0) {
        console.log('NO CONNECTION')
        await mongoose.connect(dbUri);
      } else {
        mongoose.connection = await mongoose.connection.useDb('fn_en_170');
        console.log(mongoose.connection);
      }
      databases.connections[dbName] = mongoose.connection;
    } else {
      logger.debug(`Retrieving open connection to ${dbUri}`);
      mongoose.connection = databases.connections[dbName];
    }
    return next();
  };
}

module.exports = {
  connect,
};
