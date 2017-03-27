const Router = require('koa-router');
const annoSetController = require('./controllers/annoSetController');
const frameController = require('./controllers/frameController');
const lexUnitController = require('./controllers/lexUnitController');
const patternController = require('./controllers/patternController');
const valenceUnitController = require('./controllers/valenceUnitController');
const validator = require('./middlewares/validator');
const processor = require('./middlewares/processor');

const router = new Router();

/**
 * @apiDefine NotFoundIDError
 * @apiVersion 3.0.0
 * @apiError (Error 404) NotFoundError The id was not found
 */

/**
 * @apiDefine NotFoundVPError
 * @apiVersion 3.0.0
 * @apiError (Error 404) NotFoundError A valence unit of the vp was not found
 */

/**
 * @apiDefine InvalidQuery
 * @apiVersion 3.0.0
 * @apiError (Error 400) InvalidQuery The specified query is null, empty or
 * combines :id and vp in request
 */

/**
 * @apiDefine InvalidQueryParamsID
 * @apiVersion 3.0.0
 * @apiError (Error 400) InvalidQueryParams The populate parameter is neither
 * <code>true</code> nor <code>false</code> or the specified :id is
 * neither a <code>Number</code> nor a valid <code>ObjectID</code>
 */

/**
 * @apiDefine InvalidQueryParamsVP
 * @apiVersion 3.0.0
 * @apiError (Error 400) InvalidQueryParams The populate parameter is neither
 * <code>true</code> nor <code>false</code> or the vp parameter contains either
 * an invalid character, an invalid sequence of characters or more than 3
 * tokens separated by a dot in at least one of its valence units
 */

/**
 * @apiDefine idParam
 * @apiVersion 3.0.0
 * @apiParam {Number}     id          The id
 * @apiParam {Boolean} [populate=false]    Specify whether documents
 * should be populated
 */

/**
 * @apiDefine vpParam
 * @apiVersion 3.0.0
 * @apiParam {String}     vp          The Valence Pattern: a
 * combination of triplets FE.PT.GF
 * @apiParam {Boolean}    [populate=false]     Specify whether documents
 * should be populated.
 * @apiParam {Boolean}    [strictVUMatching=false]     Specify whether
 * the number of valence units should match exactly. Ex: Querying for
 * Donor.NP.Ext with strictVUMatching=true will return all patterns with only
 * one valenceUnit
 * @apiParam {Boolean}    [withExtraCoreFEs=true] Specify whether, in cases of
 * non-strict valence unit matching, extra Frame Elements can be core FEs.
 */

/**
 * @apiDefine AnnotationSetSuccess
 * @apiVersion 3.0.0
 * @apiSuccess  {Number}   _id        The AnnotationSet id
 * @apiSuccess  {Number}   lexUnit    The LexUnit id
 * @apiSuccess  {Number}   sentence   The Sentence id
 * @apiSuccess  {Object[]} labels     The list of labels ObjectID
 */

/**
 * @apiDefine AnnotationSetSuccessPopulated
 * @apiVersion 3.0.0
 * @apiSuccess   {Number}    _id                          The AnnotationSet id
 * @apiSuccess   {Object}    lexUnit                      The LexUnit
 * @apiSuccess   {Number}    lexUnit._id                  The LexUnit id
 * @apiSuccess   {String}    lexUnit.name                 The LexUnit name
 * @apiSuccess   {String}    lexUnit.pos                  The LexUnit part of speech
 * @apiSuccess   {String}    lexUnit.definition           The LexUnit definition
 * @apiSuccess   {Number}    lexUnit.lemmaID              The LexUnit lemmaID
 * @apiSuccess   {Object}    lexUnit.frame                The LexUnit Frame
 * @apiSuccess   {Number}    lexUnit.frame._id            The Frame id
 * @apiSuccess   {String}    lexUnit.frame.name           The Frame name
 * @apiSuccess   {String}    lexUnit.frame.definition     The Frame definition
 * @apiSuccess   {String}    lexUnit.frame.cDate          The Frame creation date
 * @apiSuccess   {String}    lexUnit.frame.cBy            The Frame annotator
 * @apiSuccess   {Number[]}  lexUnit.frame.semTypes       The Frame SemTypes ids
 * @apiSuccess   {Object[]}  lexUnit.frame.lexUnits       The Frame LexUnits
 * @apiSuccess   {Number}    lexUnit.frame.lexUnits._id   The LexUnits ids
 * @apiSuccess   {String}    lexUnit.frame.lexUnits.name  The LexUnits names
 * @apiSuccess   {Number[]}  lexUnit.frame.feCoreSets     The Frame
 * minimal set of core FrameElements ids
 * @apiSuccess   {Object[]}  lexUnit.frame.frameElements  The Frame FrameElements
 * @apiSuccess   {Number}    lexUnit.frame.frameElements._id    The FrameElements ids
 * @apiSuccess   {String}    lexUnit.frame.frameElements.name   The FrameElements names
 * @apiSuccess   {String}    lexUnit.frame.frameElements.definition The FrameElements definitions
 * @apiSuccess   {String}    lexUnit.frame.frameElements.coreType The FrameElements coreTypes
 * @apiSuccess   {String}    lexUnit.frame.frameElements.cDate The FrameElements creation dates
 * @apiSuccess   {String}    lexUnit.frame.frameElements.cBy The FrameElements annotators
 * @apiSuccess   {String}    lexUnit.frame.frameElements.abbrev The FrameElements abbreviations
 * @apiSuccess   {Number[]}    lexUnit.frame.frameElements.semTypes The FrameElements SemTypes ids
 * @apiSuccess   {Number[]}    lexUnit.frame.frameElements.excludes The excluded FrameElements ids
 * @apiSuccess   {Number[]}    lexUnit.frame.frameElements.requires The required FrameElements ids
 * @apiSuccess   {String}    lexUnit.status         The LexUnit status
 * @apiSuccess   {String}    lexUnit.cBy            The LexUnit annotator
 * @apiSuccess   {String}    lexUnit.cDate          The LexUnit creation date
 * @apiSuccess   {Number[]}  lexUnit.semTypes       The LexUnit SemTypes ids
 * @apiSuccess   {Number[]}  lexUnit.lexemes        The LexUnit Lexemes ids
 * @apiSuccess   {Object}    sentence               The Sentence
 * @apiSuccess   {Number}    sentence._id           The Sentence id
 * @apiSuccess   {String}    sentence.name          The Sentence name
 * @apiSuccess   {Number}    sentence.sentenceNumber          The Sentence number
 * @apiSuccess   {Number}    sentence.paragraphNumber          The Sentence paragraph number
 * @apiSuccess   {Number}    sentence.aPos          The Sentence a-positional value
 * @apiSuccess   {Object}    pattern                The Pattern
 * @apiSuccess   {Object}    pattern._id            The Pattern ObjectID
 * @apiSuccess   {Object[]}  pattern.valenceUnits   The Pattern ValenceUnits
 * @apiSuccess   {Object}  pattern.valenceUnits._id   The Pattern ValenceUnits ObjectIDs
 * @apiSuccess   {String}  pattern.valenceUnits.FE   The Pattern ValenceUnits frame elements names
 * @apiSuccess   {String}  pattern.valenceUnits.PT   The Pattern ValenceUnits phrase types
 * @apiSuccess   {String}  pattern.valenceUnits.GF   The Pattern ValenceUnits grammatical functions
 * @apiSuccess   {Object[]}  labels             The Labels
 * @apiSuccess   {Object}   labels._id          The Labels ObjectIDs
 * @apiSuccess   {String}   labels.name         The Labels names
 * @apiSuccess   {String}   labels.type         The Labels types
 * @apiSuccess   {Number}   labels.startPos     The Labels start positions
 * @apiSuccess   {Number}   labels.endPos       The Labels end positions
 */

/**
 * @apiDefine FrameSuccess
 * @apiVersion 3.0.0
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
 * @apiDefine FrameSuccessPopulated
 * @apiVersion 3.0.0
 * @apiSuccess   {Number}    _id            The Frame id
 * @apiSuccess   {String}    name           The Frame name
 * @apiSuccess   {String}    definition     The Frame definition
 * @apiSuccess   {String}    cDate          The Frame creation date
 * @apiSuccess   {String}    cBy            The Frame annotator
 * @apiSuccess   {Number[]}  semTypes       The Frame SemTypes ids
 * @apiSuccess   {Object[]}  lexUnits       The Frame LexUnits
 * @apiSuccess   {Number}    lexUnits._id   The LexUnits ids
 * @apiSuccess   {String}    lexUnits.name  The LexUnits names
 * @apiSuccess   {Number[]}  feCoreSets     The Frame
 * minimal set of core FrameElements ids
 * @apiSuccess   {Object[]}  frameElements  The Frame FrameElements
 * @apiSuccess   {Number}    frameElements._id    The FrameElements ids
 * @apiSuccess   {String}    frameElements.name   The FrameElements names
 * @apiSuccess   {String}    frameElements.definition The FrameElements definitions
 * @apiSuccess   {String}    frameElements.coreType The FrameElements coreTypes
 * @apiSuccess   {String}    frameElements.cDate The FrameElements creation dates
 * @apiSuccess   {String}    frameElements.cBy The FrameElements annotators
 * @apiSuccess   {String}    frameElements.abbrev The FrameElements abbreviations
 * @apiSuccess   {Number[]}    frameElements.semTypes The FrameElements SemTypes ids
 * @apiSuccess   {Number[]}    frameElements.excludes The excluded FrameElements ids
 * @apiSuccess   {Number[]}    frameElements.requires The required FrameElements ids
 */

/**
 * @apiDefine LexUnitSuccess
 * @apiVersion 3.0.0
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
 * @apiDefine LexUnitSuccessPopulated
 * @apiVersion 3.0.0
 * @apiSuccess   {Number}    _id                  The LexUnit id
 * @apiSuccess   {String}    name                 The LexUnit name
 * @apiSuccess   {String}    pos                  The LexUnit part of speech
 * @apiSuccess   {String}    definition           The LexUnit definition
 * @apiSuccess   {Number}    lemmaID              The LexUnit lemmaID
 * @apiSuccess   {Object}    frame                The LexUnit Frame
 * @apiSuccess   {Number}    frame._id            The Frame id
 * @apiSuccess   {String}    frame.name           The Frame name
 * @apiSuccess   {String}    frame.definition     The Frame definition
 * @apiSuccess   {String}    frame.cDate          The Frame creation date
 * @apiSuccess   {String}    frame.cBy            The Frame annotator
 * @apiSuccess   {Number[]}  frame.semTypes       The Frame SemTypes ids
 * @apiSuccess   {Object[]}  frame.lexUnits       The Frame LexUnits
 * @apiSuccess   {Number}    frame.lexUnits._id   The LexUnits ids
 * @apiSuccess   {String}    frame.lexUnits.name  The LexUnits names
 * @apiSuccess   {Number[]}  frame.feCoreSets     The Frame
 * minimal set of core FrameElements ids
 * @apiSuccess   {Object[]}  frame.frameElements  The Frame FrameElements
 * @apiSuccess   {Number}    frame.frameElements._id    The FrameElements ids
 * @apiSuccess   {String}    frame.frameElements.name   The FrameElements names
 * @apiSuccess   {String}    frame.frameElements.definition The FrameElements definitions
 * @apiSuccess   {String}    frame.frameElements.coreType The FrameElements coreTypes
 * @apiSuccess   {String}    frame.frameElements.cDate The FrameElements creation dates
 * @apiSuccess   {String}    frame.frameElements.cBy The FrameElements annotators
 * @apiSuccess   {String}    frame.frameElements.abbrev The FrameElements abbreviations
 * @apiSuccess   {Number[]}    frame.frameElements.semTypes The FrameElements SemTypes ids
 * @apiSuccess   {Number[]}    frame.frameElements.excludes The excluded FrameElements ids
 * @apiSuccess   {Number[]}    frame.frameElements.requires The required FrameElements ids
 * @apiSuccess   {String}    status         The LexUnit status
 * @apiSuccess   {String}    cBy            The LexUnit annotator
 * @apiSuccess   {String}    cDate          The LexUnit creation date
 * @apiSuccess   {Number[]}  semTypes       The LexUnit SemTypes ids
 * @apiSuccess   {Number[]}  lexemes        The LexUnit Lexemes ids
 */

/**
 * @apiDefine PatternSuccess
 * @apiVersion 3.0.0
 * @apiSuccess   {Object}    _id            The Pattern ObjectID
 * @apiSuccess   {Object[]}  valenceUnits   The Pattern ValenceUnits ObjectIDs
 */

/**
 * @apiDefine PatternSuccessPopulated
 * @apiVersion 3.0.0
 * @apiSuccess   {Object}    _id            The Pattern ObjectID
 * @apiSuccess   {Object[]}  valenceUnits   The Pattern ValenceUnits
 * @apiSuccess   {Object}  valenceUnits._id   The ValenceUnits ObjectIDs
 * @apiSuccess   {String}  valenceUnits.FE   The ValenceUnits frame elements names
 * @apiSuccess   {String}  valenceUnits.PT   The ValenceUnits phrase types
 * @apiSuccess   {String}  valenceUnits.GF   The ValenceUnits grammatical functions
 */

/**
 * @apiDefine ValenceUnitSuccess
 * @apiVersion 3.0.0
 * @apiSuccess   {Object}  _id  The ObjectID
 * @apiSuccess   {String}  FE   The frame element name
 * @apiSuccess   {String}  PT   The phrase type
 * @apiSuccess   {String}  GF   The grammatical function
 */

/**
 * @api {get} /annoSet/:id GetAnnoSet
 * @apiVersion 3.0.0
 * @apiName GetAnnoSet
 * @apiGroup AnnotationSet
 * @apiDescription Get AnnotationSet with id. Returns at most one
 * document and throws an error if not found. Sample success output
 * is given with <code>populate=true</code>
 * @apiUse idParam
 * @apiExample Example usage:
 * curl -i http://localhost/annoSet/123?populate=true
 * @apiUse AnnotationSetSuccessPopulated
 * @apiUse NotFoundIDError
 * @apiUse InvalidQuery
 * @apiUse InvalidQueryParamsID
 */
router.get('/annoSet/:id',
  validator.validate,
  processor.processid,
  annoSetController.getByID);

/**
 * @api {get} /annoSets GetAnnoSets
 * @apiVersion 3.0.0
 * @apiName GetAnnoSets
 * @apiGroup AnnotationSet
 * @apiDescription Get all AnnotationSets with pattern matching input
 * vp. Returns an empty array if no match is found. Sample success
 * output is given with (default) <code>populate=false</code>
 * @apiUse vpParam
 * @apiExample Example usage:
 * curl -i http://localhost/annoSets?vp=Donor.NP.Ext+Theme.NP.Obj
 * @apiUse AnnotationSetSuccess
 * @apiUse NotFoundVPError
 * @apiUse InvalidQuery
 * @apiUse InvalidQueryParamsVP
 */
router.get('/annoSets',
  validator.validate,
  processor.processvp,
  annoSetController.getByVP);

/**
 * @api {get} /frame/:id GetFrame
 * @apiVersion 3.0.0
 * @apiName GetFrame
 * @apiGroup Frame
 * @apiDescription Get Frame with id. Returns at most one
 * document and throws an error if not found. Sample success output
 * is given with <code>populate=true</code>
 * @apiUse idParam
 * @apiExample Example usage:
 * curl -i http://localhost/frame/123?populate=true
 * @apiUse FrameSuccessPopulated
 * @apiUse NotFoundIDError
 * @apiUse InvalidQuery
 * @apiUse InvalidQueryParamsID
 */
router.get('/frame/:id',
  validator.validate,
  processor.processid,
  frameController.getByID);

/**
 * @api {get} /frames GetFrames
 * @apiVersion 3.0.0
 * @apiName GetFrames
 * @apiGroup Frame
 * @apiDescription Get all Frames with pattern matching input vp. Returns an
 * empty array if no match is found. Sample success
 * output is given with (default) <code>populate=false</code>
 * @apiUse vpParam
 * @apiExample Example usage:
 * curl -i http://localhost/frames?vp=Donor.NP.Ext+Theme.NP.Obj
 * @apiUse FrameSuccess
 * @apiUse NotFoundVPError
 * @apiUse InvalidQuery
 * @apiUse InvalidQueryParamsVP
 */
router.get('/frames',
  validator.validate,
  processor.processvp,
  frameController.getByVP);

/**
 * @api {get} /lexUnit/:id GetLexUnit
 * @apiVersion 3.0.0
 * @apiName GetLexUnit
 * @apiGroup LexUnit
 * @apiDescription Get LexUnit with id. Returns at most one
 * document and throws an error if not found. Sample success output
 * is given with <code>populate=true</code>
 * @apiUse idParam
 * @apiExample Example usage:
 * curl -i http://localhost:3030/lexUnit/123
 * @apiUse LexUnitSuccessPopulated
 * @apiUse NotFoundIDError
 * @apiUse InvalidQuery
 * @apiUse InvalidQueryParamsID
 */
router.get('/lexUnit/:id',
  validator.validate,
  processor.processid,
  lexUnitController.getByID);

/**
 * @api {get} /lexUnits GetLexUnits
 * @apiVersion 3.0.0
 * @apiName GetLexUnits
 * @apiGroup LexUnit
 * @apiDescription Get all LexUnits with pattern matching input vp. Returns an
 * empty array if no match is found. Sample success
 * output is given with (default) <code>populate=false</code>
 * @apiUse vpParam
 * @apiExample Example usage:
 * curl -i http://localhost:3030/lexUnits?vp=Donor.NP.Ext+Theme.NP.Obj
 * @apiUse LexUnitSuccess
 * @apiUse NotFoundVPError
 * @apiUse InvalidQuery
 * @apiUse InvalidQueryParamsVP
 */
router.get('/lexUnits',
  validator.validate,
  processor.processvp,
  lexUnitController.getByVP);

/**
 * @api {get} /pattern/:id GetPattern
 * @apiVersion 3.0.0
 * @apiName GetPattern
 * @apiGroup Pattern
 * @apiDescription Get Pattern with id. Returns at most one
 * document and throws an error if not found. Sample success output
 * is given with <code>populate=true</code>
 * @apiUse idParam
 * @apiExample Example usage:
 * curl -i http://localhost:3030/pattern/123
 * @apiUse PatternSuccessPopulated
 * @apiUse NotFoundIDError
 * @apiUse InvalidQuery
 * @apiUse InvalidQueryParamsID
 */
router.get('/pattern/:id',
  validator.validate,
  processor.processid,
  patternController.getByID);

/**
 * @api {get} /patterns GetPatterns
 * @apiVersion 3.0.0
 * @apiName GetPatterns
 * @apiGroup Pattern
 * @apiDescription Get all Patterns with pattern matching input vp. Returns an
 * empty array if no match is found. Sample success
 * output is given with (default) <code>populate=false</code>
 * @apiUse vpParam
 * @apiExample Example usage:
 * curl -i http://localhost:3030/patterns?vp=Donor.NP.Ext+Theme.NP.Obj
 * @apiUse PatternSuccess
 * @apiUse NotFoundVPError
 * @apiUse InvalidQuery
 * @apiUse InvalidQueryParamsVP
 */
router.get('/patterns',
  validator.validate,
  processor.processvp,
  patternController.getByVP);

/**
 * @api {get} /valenceUnit/:id GetValenceUnit
 * @apiVersion 3.0.0
 * @apiName GetValenceUnit
 * @apiGroup ValenceUnit
 * @apiDescription Get ValenceUnit with id. Returns at most one
 * document and throws an error if not found.
 * @apiUse idParam
 * @apiExample Example usage:
 * curl -i http://localhost:3030/valenceUnit/123
 * @apiUse ValenceUnitSuccess
 * @apiUse NotFoundIDError
 * @apiUse InvalidQuery
 * @apiUse InvalidQueryParamsID
 */
router.get('/valenceUnit/:id',
  validator.validate,
  processor.processid,
  valenceUnitController.getByID);

/**
 * @api {get} /valenceUnits GetValenceUnits
 * @apiVersion 3.0.0
 * @apiName GetValenceUnits
 * @apiGroup ValenceUnit
 * @apiDescription Get all ValenceUnits with pattern matching input vp. Returns
 * an empty array if no match is found.
 * @apiUse vpParam
 * @apiExample Example usage:
 * curl -i http://localhost:3030/valenceUnits?vp=Donor.NP.Ext+Theme.NP.Obj
 * @apiUse ValenceUnitSuccess
 * @apiUse NotFoundVPError
 * @apiUse InvalidQuery
 * @apiUse InvalidQueryParamsVP
 */
router.get('/valenceUnits',
  validator.validate,
  processor.processvp,
  valenceUnitController.getByVP);

module.exports = router;
