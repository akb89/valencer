const mongoose = require('mongoose');
const config = require('./../config');

const noFramenetCore = require('noframenet-core');

const logger = config.logger;

async function connect(context, next) {
  const urlSplit = context.request.url.split('/');
  const lang = urlSplit[2];
  const dataset = urlSplit[3];
  const dbName = config.databases.names[lang][dataset];
  logger.info(`Using database: ${dbName}`);
  //mongoose.connection = await mongoose.connection.useDb(dbName);
  //const db = mongoose.connection.useDb(dbName);
  //require('noframenet-core').AnnotationSet =
  //const AnnotationSet = db.model('AnnotationSet', noFramenetCore.AnnotationSet.schema);
  //db.models = mongoose.connection.models;
  return next();
}

module.exports = {
  connect,
};
