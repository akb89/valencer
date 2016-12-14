import Router from 'koa-router';
import annoSetController from './controllers/annoSetController';
import frameController from './controllers/frameController';
import lexUnitController from './controllers/lexUnitController';
import patternController from './controllers/patternController';
import valenceUnitController from './controllers/valenceUnitController';
import authenticator from './middlewares/authenticator';
import validator from './middlewares/validator';
import processor from './middlewares/processor';

const router = new Router();

/**
 * @apiDefine NotFoundIDError
 * @apiError NotFoundError The id was not found
 */

/**
 * @apiDefine NotFoundVPError
 * @apiError NotFoundError A valence unit of the vp was not found
 */

/**
 * @apiDefine idParam
 *
 * @apiParam {Number}     id          The id
 * @apiParam {Boolean} [populate=false]    Specify whether documents
 * should be populated
 */

/**
 * @apiDefine vpParam
 *
 * @apiParam {String}     vp          The Valence Pattern: a
 * combination of triplets FE.PT.GF
 * @apiParam {Boolean}    populate    Specify whether documents
 * should be populated. Default to false
 */

/**
 * @apiDefine AnnotationSetSuccess
 *
 * @apiSuccess  {Number}   _id        The AnnotationSet id
 * @apiSuccess  {Number}   lexUnit    The LexUnit id
 * @apiSuccess  {Number}   sentence   The Sentence id
 * @apiSuccess  {Object[]} labels     The list of labels ObjectID
 */

/**
 * @apiDefine AnnotationSetSuccessPopulated
 *
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
 * @apiSuccess   {Number[]}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    lexUnit.frame._id The Frame id
 * @apiSuccess   {Number}    sentence    The Sentence id
 * @apiSuccess   {Object[]}  labels      The list of labels ObjectID
 */

/**
 * @api {get} /annoSet/:id GetAnnoSet
 * @apiVersion 1.0.0
 * @apiName GetAnnoSet
 * @apiGroup AnnotationSet
 * @apiDescription Get AnnotationSet with id. Returns at most one
 * document and throws an error if not found. Sample success output
 * is given with populate=true
 * @apiUse idParam
 * @apiExample Example usage:
 * curl -i http://localhost/annoSet/123?populate=true
 * @apiUse AnnotationSetSuccessPopulated
 * @apiUse NotFoundIDError
 */
router.get('/annoSet/:id',
  //authenticator.authenticate,
  validator.validate,
  processor.processid,
  annoSetController.getByID);

/**
 * @api {get} /annoSets GetAnnoSets
 * @apiVersion 1.0.0
 * @apiName GetAnnoSets
 * @apiGroup AnnotationSet
 * @apiDescription Get all AnnotationSets with pattern matching input
 * vp. Returns an empty array if no match is found. Sample success
 * output is given with (default) populate=false
 * @apiUse vpParam
 * @apiExample Example usage:
 * curl -i http://localhost/annoSets?vp=Donor.NP.Ext+Theme.NP.Obj
 * @apiUse AnnotationSetSuccess
 * @apiUse NotFoundVPError
 */
router.get('/annoSets',
  //authenticator.authenticate,
  validator.validate,
  processor.processvp,
  annoSetController.getByVP);

/**
 * @api {get} /frame/:id GetFrame
 * @apiVersion 1.0.0
 * @apiName GetFrame
 * @apiGroup Frame
 * @apiDescription Get Frame with id
 * @apiUse idParam
 * @apiExample Example usage:
 * curl -i http://localhost/frame/123?populate=true
 * @apiUse NotFoundIDError
 */
router.get('/frame/:id',
  //authenticator.authenticate,
  validator.validate,
  processor.processid,
  frameController.getByID);

/**
 * @api {get} /frames GetFrames
 * @apiVersion 1.0.0
 * @apiName GetFrames
 * @apiGroup Frame
 * @apiDescription Get all Frames with pattern matching input
 * @apiUse vpParam
 * @apiExample Example usage:
 * curl -i http://localhost/frames?vp=Donor.NP.Ext+Theme.NP.Obj
 * @apiUse NotFoundVPError
 */
router.get('/frames',
  //authenticator.authenticate,
  validator.validate,
  processor.processvp,
  frameController.getByVP);

/**
 * @api {get} /lexUnit/:id GetLexUnit
 * @apiVersion 1.0.0
 * @apiName GetLexUnit
 * @apiGroup LexUnit
 * @apiDescription Get LexUnit with id
 * @apiUse idParam
 * @apiExample Example usage:
 * curl -i http://localhost:3030/lexUnit/123
 * @apiUse NotFoundIDError
 */
router.get('/lexUnit/:id',
  //authenticator.authenticate,
  validator.validate,
  processor.processid,
  lexUnitController.getByID);

/**
 * @api {get} /lexUnits GetLexUnits
 * @apiVersion 1.0.0
 * @apiName GetLexUnits
 * @apiGroup LexUnit
 * @apiDescription Get all LexUnits with pattern matching input
 * @apiUse vpParam
 * @apiExample Example usage:
 * curl -i http://localhost:3030/lexUnits?vp=Donor.NP.Ext+Theme.NP.Obj
 * @apiUse NotFoundVPError
 */
router.get('/lexUnits',
  //authenticator.authenticate,
  validator.validate,
  processor.processvp,
  lexUnitController.getByVP);

/**
 * @api {get} /pattern/:id GetPattern
 * @apiVersion 1.0.0
 * @apiName GetPattern
 * @apiGroup Pattern
 * @apiDescription Get Pattern with id
 * @apiUse idParam
 * @apiExample Example usage:
 * curl -i http://localhost:3030/pattern/123
 * @apiUse NotFoundIDError
 */
router.get('/pattern/:id',
  //authenticator.authenticate,
  validator.validate,
  processor.processid,
  patternController.getByID);

/**
 * @api {get} /patterns GetPatterns
 * @apiVersion 1.0.0
 * @apiName GetPatterns
 * @apiGroup Pattern
 * @apiDescription Get all Patterns with pattern matching input
 * @apiUse vpParam
 * @apiExample Example usage:
 * curl -i http://localhost:3030/patterns?vp=Donor.NP.Ext+Theme.NP.Obj
 * @apiUse NotFoundVPError
 */
router.get('/patterns',
  //authenticator.authenticate,
  validator.validate,
  processor.processvp,
  patternController.getByVP);

/**
 * @api {get} /valenceUnit/:id GetValenceUnit
 * @apiVersion 1.0.0
 * @apiName GetValenceUnit
 * @apiGroup ValenceUnit
 * @apiDescription Get ValenceUnit with id
 * @apiUse idParam
 * @apiExample Example usage:
 * curl -i http://localhost:3030/valenceUnit/123
 * @apiUse NotFoundIDError
 */
router.get('/valenceUnit/:id',
  //authenticator.authenticate,
  validator.validate,
  processor.processid,
  valenceUnitController.getByID);

/**
 * @api {get} /valenceUnits GetValenceUnits
 * @apiVersion 1.0.0
 * @apiName GetValenceUnits
 * @apiGroup ValenceUnit
 * @apiDescription Get all ValenceUnits with pattern matching input
 * @apiUse vpParam
 * @apiExample Example usage:
 * curl -i http://localhost:3030/valenceUnits?vp=Donor.NP.Ext+Theme.NP.Obj
 * @apiUse NotFoundVPError
 */
router.get('/valenceUnits',
  //authenticator.authenticate,
  validator.validate,
  processor.processvp,
  valenceUnitController.getByVP);

export default router;
