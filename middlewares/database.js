const mongoose = require('mongoose');

async function connect(context, next) {
  //mongoose.connection.useDb(context.valencer.database);
  return next();
}

module.exports = {
  connect,
};
