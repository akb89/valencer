const Router = require('koa-router');
const compose = require('koa-compose');
const database = require('./middlewares/database');
const formatter = require('./middlewares/formatter');
const filter = require('./middlewares/filter');
const renderer = require('./middlewares/renderer');
const coreVU = require('./middlewares/core/valenceUnits');
const coreP = require('./middlewares/core/patterns');
const validator = require('./middlewares/validator');
const annotationSet = require('./middlewares/processors/annotationSet');
const annotationSets = require('./middlewares/processors/annotationSets');
const frame = require('./middlewares/processors/frame');
const frames = require('./middlewares/processors/frames');
const lexUnit = require('./middlewares/processors/lexUnit');
const lexUnits = require('./middlewares/processors/lexUnits');
const pattern = require('./middlewares/processors/pattern');
const patterns = require('./middlewares/processors/patterns');
const valenceUnit = require('./middlewares/processors/valenceUnit');
const valenceUnits = require('./middlewares/processors/valenceUnits');
const utils = require('./utils/utils');
const config = require('./config');

const pkgVersion = process.env.npm_package_version;
const apiVersion = `/v${pkgVersion.split('.')[0]}`;

const models = {};

const logger = config.logger;

const valencer = new Router({
  prefix: apiVersion,
});

const router = new Router();

function initializeValencerContext(context, next) {
  context.valencer = {
    models: {},
    query: {
      vp: {
        raw: '',
        formatted: [],
        withFEids: [],
      },
      feNamesSet: new Set(),
    },
    results: {
      tmp: {
        valenceUnitsIDs: [],
        excludedFEids: [],
        excludedVUids: [],
        patternsIDs: [],
        filteredPatternsIDs: [],
      },
      annotationSets: [],
      frames: [],
      lexUnits: [],
      patterns: [],
      valenceUnits: [],
    },
    startTime: utils.getStartTime(),
  };
  if (Object.keys(context.query).length) {
    logger.info(`Processing query ${JSON.stringify(context.query)}`);
  }
  return next();
}

function displayQueryExecutionTime(context, next) {
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

const validateVUquery = compose([
  validator.validatePathToDB,
  validator.validateQueryNotEmpty,
  validator.validateQueryVUnotEmpty,
  validator.validateQueryVUcontainsNoInvalidCharacters,
  validator.validateQueryVUlength,
]);

const validateParamsQuery = compose([
  validator.validatePathToDB,
  validator.validateParamsNotEmpty,
  validator.validateParamsIDnotEmpty,
  validator.validateParamsIDisNumberOrObjectID,
]);

const formatVPquery = compose([
  formatter.formatValencePatternToArrayOfArrayOfTokens,
  formatter.replaceFrameElementNamesByFrameElementIds,
]);

const processVPquery = compose([
  coreVU.retrieveValenceUnitsIDs,
  coreVU.retrieveExcludedVUIDs,
  coreP.retrievePatternsIDs,
  filter.filterPatternsIDs,
]);

function setVP(context, next) {
  context.query.vp = context.query.vu;
  return next();
}

const processVUquery = compose([
  setVP,
  formatVPquery,
  coreVU.retrieveValenceUnitsIDs,
]);

const validateAndProcessVPquery = compose([
  initializeValencerContext,
  validateVPquery,
  database.connect(models),
  formatVPquery,
  validator.validateQueryParametersCombination,
  processVPquery,
  annotationSets.getByValencePattern,
]);

const validateAndProcessVUquery = compose([
  initializeValencerContext,
  validateVUquery,
  database.connect(models),
  processVUquery,
]);

const validateAndProcessIDquery = compose([
  initializeValencerContext,
  validateParamsQuery,
  database.connect(models),
]);


/**
 * @apiDefine NotFoundIDError
 * @apiVersion 4.0.0
 * @apiError (Error 404) NotFoundError The id was not found in the database
 */

/**
 * @apiDefine NotFoundVPError
 * @apiVersion 4.0.0
 * @apiError (Error 404) NotFoundError At least one valence unit composing the
 * input vp was not found in the database
 */

/**
 * @apiDefine InvalidQuery
 * @apiVersion 4.0.0
 * @apiError (Error 400) InvalidQuery The specified <code>langIsoCode</code> or
 * <code>datasetVersion</code> is not supported; the database corresponding to
 * the language ISO639-1 and dataset version is supported but not up and
 * running; the specified query is empty, null or undefined
 */

/**
 * @apiDefine InvalidParams
 * @apiVersion 4.0.0
 * @apiError (Error 400) InvalidParams The specified <code>id</code> is empty,
 * null, undefined, or is specified but is neither a <code>Number</code> nor a
 * valid <code>ObjectID</code>
 */

/**
 * @apiDefine InvalidQueryParams
 * @apiVersion 4.0.0
 * @apiError (Error 400) InvalidQueryParams The <code>vp</code> parameter contains either
 * an invalid character, an invalid sequence of characters or more than 3
 * tokens separated by a dot in at least one of its valence units; the
 * <code>strictVUMatching</code> parameter is neither <code>true</code> nor
 * <code>false</code>; the <code>withExtraCoreFEs</code> parameter is neither
 * <code>true</code> nor <code>false</code>
 */

 /**
  * @apiDefine apiConfig
  * @apiVersion 4.0.0
  * @apiParam {String}    langIsoCode   The language ISO639-1 code. Ex: 'en' for English
  * @apiParam {Number}    datasetVersion    The version of the FrameNet
  * dataset, in semver format. Ex: '170' for the FrameNet 1.7 data release
  */

/**
 * @apiDefine vpParam
 * @apiVersion 4.0.0
 * @apiParam {String}     vp          The Valence Pattern: a
 * combination of triplets FE.PT.GF
 * @apiParam {Boolean}    [strictVUMatching=false]     Specify whether
 * the number of valence units should match exactly. Ex: Querying for
 * Donor.NP.Ext with strictVUMatching=true will return all patterns with only
 * one valenceUnit
 * @apiParam {Boolean}    [withExtraCoreFEs=true] Specify whether, in cases of
 * non-strict valence unit matching, extra Frame Elements can be core FEs.
 */

/**
 * @apiDefine AnnotationSetSuccess
 * @apiVersion 4.0.0
 * @apiSuccess  {Number}   _id        The AnnotationSet id
 * @apiSuccess  {Number}   lexUnit    The LexUnit id
 * @apiSuccess  {Number}   sentence   The Sentence id
 * @apiSuccess  {Object}   pattern   The Pattern ObjectID
 * @apiSuccess  {Object[]} labels     The list of labels ObjectID
 */

/**
 * @apiDefine FrameSuccess
 * @apiVersion 4.0.0
 * @apiSuccess   {Number}    _id            The Frame id
 * @apiSuccess   {String}    name           The Frame name
 * @apiSuccess   {String}    definition     The Frame definition
 * @apiSuccess   {String}    cDate          The Frame creation date
 * @apiSuccess   {String}    cBy            The Frame annotator
 * @apiSuccess   {Number[]}  semTypes       The Frame SemTypes ids
 * @apiSuccess   {Number[]}  lexUnits       The Frame LexUnits ids
 * @apiSuccess   {Number[]}  feCoreSets     The Frame
 * minimal set of core FrameElements ids
 * @apiSuccess   {Number[]}  frameElements  The Frame FrameElements ids
 */

/**
 * @apiDefine LexUnitSuccess
 * @apiVersion 4.0.0
 * @apiSuccess   {Number}    _id                  The LexUnit id
 * @apiSuccess   {String}    name                 The LexUnit name
 * @apiSuccess   {String}    pos                  The LexUnit part of speech
 * @apiSuccess   {String}    definition           The LexUnit definition
 * @apiSuccess   {Number}    lemmaID              The LexUnit lemmaID
 * @apiSuccess   {Number}    frame                The LexUnit Frame id
 * @apiSuccess   {String}    status         The LexUnit status
 * @apiSuccess   {String}    cBy            The LexUnit annotator
 * @apiSuccess   {String}    cDate          The LexUnit creation date
 * @apiSuccess   {Number[]}  semTypes       The LexUnit SemTypes ids
 * @apiSuccess   {Number[]}  lexemes        The LexUnit Lexemes ids
 */

/**
 * @apiDefine PatternSuccess
 * @apiVersion 4.0.0
 * @apiSuccess   {Object}    _id            The Pattern ObjectID
 * @apiSuccess   {Object[]}  valenceUnits   The Pattern ValenceUnits ObjectIDs
 */

/**
 * @apiDefine ValenceUnitSuccess
 * @apiVersion 4.0.0
 * @apiSuccess   {Object}  _id  The ObjectID
 * @apiSuccess   {String}  FE   The frame element name
 * @apiSuccess   {String}  PT   The phrase type
 * @apiSuccess   {String}  GF   The grammatical function
 */

/**
  * @api {get} /annoSet/:id GetAnnoSet
  * @apiVersion 4.0.0
  * @apiName GetAnnoSet
  * @apiGroup AnnotationSet
  * @apiDescription Get AnnotationSet with id. Returns at most one
  * document and throws an error if not found
  * @apiUse apiConfig
  * @apiParam {Number}  id  The AnnotationSet id
  * @apiExample Example usage:
  * curl -i "http://localhost:3030/v4/en/170/annoSet/2614616"
  * @apiUse AnnotationSetSuccess
  * @apiUse NotFoundIDError
  * @apiUse InvalidQuery
  * @apiUse InvalidParams
  */
router.get('/annoSet/:id',
           validateAndProcessIDquery,
           annotationSet.getByID);
/**
  * @api {get} /annoSets GetAnnoSets
  * @apiVersion 4.0.0
  * @apiName GetAnnoSets
  * @apiGroup AnnotationSet
  * @apiDescription Get all AnnotationSets with pattern matching input
  * vp. Returns an empty array if no match is found
  * @apiUse vpParam
  * @apiUse apiConfig
  * @apiExample Example usage:
  * curl -i "http://localhost:3030/v4/en/170/annoSets?vp=Donor.NP.Ext+Theme.NP.Obj"
  * @apiUse AnnotationSetSuccess
  * @apiUse NotFoundVPError
  * @apiUse InvalidQuery
  * @apiUse InvalidQueryParams
*/
router.get('/annoSets',
           validateAndProcessVPquery,
           renderer.renderAnnotationSets,
           displayQueryExecutionTime);

/**
 * @api {get} /frame/:id GetFrame
 * @apiVersion 4.0.0
 * @apiName GetFrame
 * @apiGroup Frame
 * @apiDescription Get Frame with id. Returns at most one
 * document and throws an error if not found
 * @apiUse apiConfig
 * @apiParam {Number}  id  The Frame id
 * @apiExample Example usage:
 * curl -i "http://localhost:3030/v4/en/170/frame/42"
 * @apiUse FrameSuccess
 * @apiUse NotFoundIDError
 * @apiUse InvalidQuery
 * @apiUse InvalidParams
 */
router.get('/frame/:id',
           validateAndProcessIDquery,
           frame.getByID);

/**
 * @api {get} /frames GetFrames
 * @apiVersion 4.0.0
 * @apiName GetFrames
 * @apiGroup Frame
 * @apiDescription Get all Frames with pattern matching input vp. Returns an
 * empty array if no match is found
 * @apiUse vpParam
 * @apiUse apiConfig
 * @apiExample Example usage:
 * curl -i "http://localhost:3030/v4/en/170/frames?vp=Donor.NP.Ext+Theme.NP.Obj"
 * @apiUse FrameSuccess
 * @apiUse NotFoundVPError
 * @apiUse InvalidQuery
 * @apiUse InvalidQueryParams
 */
router.get('/frames',
           validateAndProcessVPquery,
           frames.getByAnnotationSets,
           renderer.renderFrames,
           displayQueryExecutionTime);

/**
  * @api {get} /lexUnit/:id GetLexUnit
  * @apiVersion 4.0.0
  * @apiName GetLexUnit
  * @apiGroup LexUnit
  * @apiDescription Get LexUnit with id. Returns at most one
  * document and throws an error if not found
  * @apiParam {Number}  id  The LexUnit id
  * @apiUse apiConfig
  * @apiExample Example usage:
  * curl -i "http://localhost:3030/v4/en/170/lexUnit/42"
  * @apiUse LexUnitSuccess
  * @apiUse NotFoundIDError
  * @apiUse InvalidQuery
  * @apiUse InvalidParams
  */
router.get('/lexUnit/:id',
           validateAndProcessIDquery,
           lexUnit.getByID);

/**
  * @api {get} /lexUnits GetLexUnits
  * @apiVersion 4.0.0
  * @apiName GetLexUnits
  * @apiGroup LexUnit
  * @apiDescription Get all LexUnits with pattern matching input vp. Returns an
  * empty array if no match is found
  * @apiUse vpParam
  * @apiUse apiConfig
  * @apiExample Example usage:
  * curl -i "http://localhost:3030/v4/en/170/lexUnits?vp=Donor.NP.Ext+Theme.NP.Obj"
  * @apiUse LexUnitSuccess
  * @apiUse NotFoundVPError
  * @apiUse InvalidQuery
  * @apiUse InvalidQueryParams
  */
router.get('/lexUnits',
           validateAndProcessVPquery,
           lexUnits.getByAnnotationSets,
           renderer.renderLexUnits,
           displayQueryExecutionTime);

/**
  * @api {get} /pattern/:id GetPattern
  * @apiVersion 4.0.0
  * @apiName GetPattern
  * @apiGroup Pattern
  * @apiDescription Get Pattern with id. Returns at most one
  * document and throws an error if not found
  * @apiParam {Object}  id  The Pattern ObjectID
  * @apiUse apiConfig
  * @apiExample Example usage:
  * curl -i "http://localhost:3030/v4/en/170/pattern/595bacfcb062ee3a400e81e2"
  * @apiUse PatternSuccess
  * @apiUse NotFoundIDError
  * @apiUse InvalidQuery
  * @apiUse InvalidParams
  */
router.get('/pattern/:id',
           validateAndProcessIDquery,
           pattern.getByID);

/**
  * @api {get} /patterns GetPatterns
  * @apiVersion 4.0.0
  * @apiName GetPatterns
  * @apiGroup Pattern
  * @apiDescription Get all Patterns with pattern matching input vp. Returns an
  * empty array if no match is found
  * @apiUse vpParam
  * @apiUse apiConfig
  * @apiExample Example usage:
  * curl -i "http://localhost:3030/v4/en/170/patterns?vp=Donor.NP.Ext+Theme.NP.Obj"
  * @apiUse PatternSuccess
  * @apiUse NotFoundVPError
  * @apiUse InvalidQuery
  * @apiUse InvalidQueryParams
*/
router.get('/patterns',
           validateAndProcessVPquery,
           patterns.getFromIDs,
           renderer.renderPatterns,
           displayQueryExecutionTime);

/**
  * @api {get} /valenceUnit/:id GetValenceUnit
  * @apiVersion 4.0.0
  * @apiName GetValenceUnit
  * @apiGroup ValenceUnit
  * @apiDescription Get ValenceUnit with id. Returns at most one
  * document and throws an error if not found
  * @apiParam {Object}  id  The ValenceUnit ObjectID
  * @apiUse apiConfig
  * @apiExample Example usage:
  * curl -i "http://localhost:3030/v4/en/170/valenceUnit/595bacfcb062ee3a400e81e0"
  * @apiUse ValenceUnitSuccess
  * @apiUse NotFoundIDError
  * @apiUse InvalidQuery
  * @apiUse InvalidParams
  */
router.get('/valenceUnit/:id',
           validateAndProcessIDquery,
           valenceUnit.getByID);

/**
  * @api {get} /valenceUnits GetValenceUnits
  * @apiVersion 4.0.0
  * @apiName GetValenceUnits
  * @apiGroup ValenceUnit
  * @apiDescription Get all ValenceUnits with pattern matching input vp. Returns
  * an empty array if no match is found
  * @apiParam {String}  vu  The ValenceUnit: a single triplet FE.PT.GF. Can be
  * a partial triplet: FE, FE.PT, FE.GF, PT.GF, in any order: GF.FE, PT.FE, etc.
  * @apiUse apiConfig
  * @apiExample Example usage:
  * curl -i "http://localhost:3030/v4/en/170/valenceUnits?vu=Donor.NP.Ext"
  * @apiUse ValenceUnitSuccess
  * @apiUse NotFoundVPError
  * @apiUse InvalidQuery
  * @apiUse InvalidQueryParams
  */
router.get('/valenceUnits',
           validateAndProcessVUquery,
           valenceUnits.getFromIDs,
           renderer.renderValenceUnits,
           displayQueryExecutionTime);

valencer.use('/:langIsoCode/:datasetVersion', router.routes());

module.exports = valencer;
