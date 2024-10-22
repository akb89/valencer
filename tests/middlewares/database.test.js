const chai = require('chai');
const mongoose = require('mongoose');
const rewire = require('rewire');
const config = require('./../../config');

mongoose.set('useCreateIndex', true);

const should = chai.should();
const connect = rewire('./../../middlewares/database').__get__('connect');

describe('database', () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.dbUri,
                             { keepAlive: 1, connectTimeoutMS: 30000, useNewUrlParser: true });
    }
  });
  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
  it('#connect should create a connection to mongodb and correctly assign schemas with empty models', async () => {
    const next = () => {};
    const context = {
      request: { url: '/v5/en/170/frame/42' },
      valencer: {
        dbName: 'fn_en_170',
        models: {},
      },
    };
    await connect()(context, next);
    Object.keys(context.valencer.models).length.should.equal(17);
  });
  it('#connect should create a connection to mongodb and correctly assign schemas with non-empty models', async () => {
    const next = () => {};
    const context = {
      request: { url: '/v5/en/170/frame/42' },
      valencer: {
        dbName: 'fn_en_170',
        models: { fn_en_170: [] },
      },
    };
    await connect()(context, next);
    Object.keys(context.valencer.models).length.should.equal(0);
  });
});
