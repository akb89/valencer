const Router = require('koa-router');
const koaCompose = require('koa-compose');
const formatter = require('./middlewares/formatter');
const processor = require('./middlewares/processor');
const validator = require('./middlewares/validator');
const annotationSet = require('./middlewares/processors/annotationSet');
const annotationSets = require('./middlewares/processors/annotationSets');

const pkgVersion = process.env.npm_package_version;
const apiVersion = `/v${pkgVersion.split('.')[0]}`;

const valencer = new Router({
  prefix: apiVersion,
});

const router = new Router();

const validateVPquery = koaCompose.compose([
  validator.validateQueryNotEmpty,
  validator.validateQueryVPnotEmpty,
  validator.validateQueryVPcontainsNoInvalidCharacters,
  validator.validateQueryVPcontainsNoInvalidSequence,
  validator.validateQueryVPvalenceUnitLength,
  validator.validateQueryPopulateParameter,
  validator.validateQueryStrictVUmatchingParameter,
  validator.validateQueryWithExtraCoreFEsParameter,
]);
const validateParamsQuery = koaCompose.compose([
  validator.validateParamsNotEmpty,
  validator.validateParamsIDnotEmpty,
  validator.validateParamsIDisNumberOrObjectID,
  validator.validateQueryPopulateParameter,
  validator.validateQueryStrictVUmatchingParameter,
  validator.validateQueryWithExtraCoreFEsParameter,
]);

const formatVPquery = koaCompose.compose([
  formatter.formatValencePatternToArrayOfArrayOfTokens,
  formatter.replaceFrameElementNamesByFrameElementIds,
]);

const processVPquery = koaCompose.compose([
  processor.retrieveValenceUnits,
  processor.retrievePatterns,
]);

const composeVPquery = koaCompose.compose([
  validateVPquery,
  formatVPquery,
  validator.validateQueryParametersCombination,
  processVPquery,
]);

router.get('/annoSet/:id',
  validateParamsQuery,
  annotationSet.getByID);

router.get('/annoSets',
  composeVPquery,
  annotationSets.getByValencePattern);

valencer.use('/:lang_iso_code/:dataset_version', router.routes());

module.exports = valencer;
