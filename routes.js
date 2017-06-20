const Router = require('koa-router');
const compose = require('koa-compose');
const database = require('./middlewares/database');
const formatter = require('./middlewares/formatter');
const filter = require('./middlewares/filter');
const coreVU = require('./middlewares/core/valenceUnits');
const coreP = require('./middlewares/core/patterns');
const validator = require('./middlewares/validator');
const annotationSet = require('./middlewares/processors/annotationSet');
const annotationSets = require('./middlewares/processors/annotationSets');
const utils = require('./utils/utils');
const config = require('./config');

const pkgVersion = process.env.npm_package_version;
const apiVersion = `/v${pkgVersion.split('.')[0]}`;

const logger = config.logger;

const valencer = new Router({
  prefix: apiVersion,
});

const router = new Router();

function initializeValencerContext(context, next) {
  context.valencer = {
    database: '',
    query: {
      vp: {
        raw: '',
        formatted: [],
        withFEids: [],
      },
    },
    results: {
      valenceUnitsIDs: [],
      patternsIDs: [],
      filteredPatternsIDs: [],
    },
    startTime: utils.getStartTime(),
  };
  logger.info(`Processing query = ${JSON.stringify(context.query)}`);
  return next();
}

function wrap(context, next) {
  logger.info(`Query ${JSON.stringify(context.query)} processed in ${utils.getElapsedTime(context.valencer.startTime)}ms`);
  return next();
}

const validateVPquery = compose([
  validator.validatePathToDB,
  validator.validateQueryNotEmpty,
  validator.validateQueryVPnotEmpty,
  validator.validateQueryVPcontainsNoInvalidCharacters,
  validator.validateQueryVPcontainsNoInvalidSequence,
  validator.validateQueryVPvalenceUnitLength,
  validator.validateQueryStrictVUmatchingParameter,
  validator.validateQueryWithExtraCoreFEsParameter,
]);
const validateParamsQuery = compose([
  validator.validatePathToDB,
  validator.validateParamsNotEmpty,
  validator.validateParamsIDnotEmpty,
  validator.validateParamsIDisNumberOrObjectID,
  validator.validateQueryStrictVUmatchingParameter,
  validator.validateQueryWithExtraCoreFEsParameter,
]);

const formatVPquery = compose([
  formatter.formatValencePatternToArrayOfArrayOfTokens,
  formatter.replaceFrameElementNamesByFrameElementIds,
]);

const processVPquery = compose([
  coreVU.retrieveValenceUnitsIDs,
  coreP.retrievePatternsIDs,
  filter.filterPatternsIDs,
]);

const composeVPquery = compose([
  initializeValencerContext,
  validateVPquery,
  database.connect,
  formatVPquery,
  validator.validateQueryParametersCombination,
  processVPquery,
]);

router.get('/annoSet/:id',
           initializeValencerContext,
           validateParamsQuery,
           annotationSet.getByID);

router.get('/annoSets',
           composeVPquery,
           annotationSets.getByValencePattern,
           wrap);

valencer.use('/:lang_iso_code/:dataset_version', router.routes());

module.exports = valencer;
