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
 * @apiDefine AnnotationSetParam
 *
 * @apiParam {Number}     id          The AnnotationSet id
 * @apiParam {Boolean}    populate    Specify whether collections should be
 * populated. Default to false
 */

/**
 * @apiDefine AnnotationSetSuccess
 *
 * @apiSuccess {Number}   _id        The AnnotationSet id
 * @apiSuccess {Number}   lexUnit    The LexUnit id
 * @apiSuccess {Number}   sentence   The Sentence id
 * @apiSuccess {Object[]} labels     The list of labels ObjectID
 */

/**
 * @apiDefine AnnotationSetSuccessExample
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "_id": 791417,
 *        "lexUnit": 1004,
 *        "sentence": 656052,
 *        "labels": [
 *           "583c37b47a730328b2f8654a",
 *           "583c37b47a730328b2f8654b",
 *           "583c37b47a730328b2f8654c",
 *           "583c37b47a730328b2f8654d",
 *           "583c37b47a730328b2f8654e",
 *           "583c37b47a730328b2f8654f",
 *           "583c37b47a730328b2f86550",
 *           "583c37b47a730328b2f86551",
 *           "583c37b47a730328b2f86552",
 *           "583c37b47a730328b2f86553",
 *           "583c37b47a730328b2f86554",
 *           "583c37b47a730328b2f86555"
 *       ]
 *     }
 */

/**
 * @apiDefine AnnotationSetSuccessPopulate
 *
 * @apiSuccessExample {json} Success-Response (populated):
 *     HTTP/1.1 200 OK
 *     {
 *     }
 */

/**
 * @api {get} /annoSet/:id GetAnnoSet
 * @apiVersion 1.0.0
 * @apiName GetAnnoSet
 * @apiGroup AnnotationSet
 * @apiDescription Get AnnotationSet with id
 *
 * @apiUse AnnotationSetParam
 *
 * @apiUse AnnotationSetSuccess
 *
 * @apiExample Example usage:
 * curl -i http://localhost/annoSet/123
 *
 * @apiUse AnnotationSetSuccessExample
 *
 * @apiError NotFound   Details.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "error": "NoAccessRight"
 *     }
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
 *
 * @apiParam {String} vp The Valence Pattern.
 * @apiParam {Boolean} populate Specify whether collections should be populated
 *
 * @apiSuccess {Number}   id            The Users-ID.
 *
 * @apiExample Example usage:
 * curl -i http://localhost/annoSets?
 * vp=Donor.NP.Ext+Theme.NP.Obj+Recipient.PP[to].Dep
 *
 *
 */
router.get('/annoSets',
  //authenticator.authenticate,
  validator.validate,
  processor.processvp,
  annoSetController.getByVP);

/**
 * @api {get} /frames GetFrames
 * @apiVersion 1.0.0
 * @apiName GetFrames
 * @apiGroup Frame
 * @apiDescription Get all Frames with pattern matching input
 *
 * @apiParam {String} vp The Valence Pattern.
 * @apiParam {Boolean} populate Specify whether collections should be populated
 *
 * @apiSuccess {Number}   id            The Users-ID.
 *
 * @apiExample Example usage:
 * curl -i http://localhost:3030/frames?
 * vp=Donor.NP.Ext+Theme.NP.Obj+Recipient.PP[to].Dep
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 */
router.get('/frames',
  //authenticator.authenticate,
  validator.validate,
  processor.processvp,
  frameController.getByVP);

/**
 * @api {get} /frame/:id GetFrame
 * @apiVersion 1.0.0
 * @apiName GetFrame
 * @apiGroup Frame
 * @apiDescription Get Frame with id
 *
 * @apiParam {Boolean} populate Specify whether collections should be populated
 *
 * @apiSuccess {Number}   id            The Users-ID.
 *
 * @apiExample Example usage:
 * curl -i http://localhost:3030/frame/123
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 */
router.get('/frame/:id',
  //authenticator.authenticate,
  validator.validate,
  processor.processid,
  frameController.getByID);

/**
 * @api {get} /lexUnit/:id GetLexUnit
 * @apiVersion 1.0.0
 * @apiName GetLexUnit
 * @apiGroup LexUnit
 * @apiDescription Get LexUnit with id
 *
 * @apiParam {Boolean} populate Specify whether collections should be populated
 *
 * @apiSuccess {Number}   id            The Users-ID.
 *
 * @apiExample Example usage:
 * curl -i http://localhost:3030/lexUnit/123
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
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
 *
 * @apiParam {String} vp The Valence Pattern.
 * @apiParam {Boolean} populate Specify whether collections should be populated
 *
 * @apiSuccess {Number}   id            The Users-ID.
 *
 * @apiExample Example usage:
 * curl -i http://localhost:3030/lexUnits?
 * vp=Donor.NP.Ext+Theme.NP.Obj+Recipient.PP[to].Dep
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
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
 *
 * @apiParam {Boolean} populate Specify whether collections should be populated
 *
 * @apiSuccess {Number}   id            The Users-ID.
 *
 * @apiExample Example usage:
 * curl -i http://localhost:3030/pattern/123
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
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
 *
 * @apiParam {String} vp The Valence Pattern.
 * @apiParam {Boolean} populate Specify whether collections should be populated
 *
 * @apiSuccess {Number}   id            The Users-ID.
 *
 * @apiExample Example usage:
 * curl -i http://localhost:3030/patterns?
 * vp=Donor.NP.Ext+Theme.NP.Obj+Recipient.PP[to].Dep
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
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
 *
 * @apiParam {Boolean} populate Specify whether collections should be populated
 *
 * @apiSuccess {Number}   id            The Users-ID.
 *
 * @apiExample Example usage:
 * curl -i http://localhost:3030/valenceUnit/123
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
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
 *
 * @apiParam {String} vp The Valence Pattern.
 * @apiParam {Boolean} populate Specify whether collections should be populated
 *
 * @apiSuccess {Number}   id            The Users-ID.
 *
 * @apiExample Example usage:
 * curl -i http://localhost:3030/valenceUnits?
 * vp=Donor.NP.Ext+Theme.NP.Obj+Recipient.PP[to].Dep
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "_id": 791417,
 *        "lexUnit": 1004,
 *        "sentence": 656052,
 *        "labels": [
 *           "583c37b47a730328b2f8654a",
 *           "583c37b47a730328b2f8654b",
 *           "583c37b47a730328b2f8654c",
 *           "583c37b47a730328b2f8654d",
 *           "583c37b47a730328b2f8654e",
 *           "583c37b47a730328b2f8654f",
 *           "583c37b47a730328b2f86550",
 *           "583c37b47a730328b2f86551",
 *           "583c37b47a730328b2f86552",
 *           "583c37b47a730328b2f86553",
 *           "583c37b47a730328b2f86554",
 *           "583c37b47a730328b2f86555"
 *       ]
 *     }
 */
router.get('/valenceUnits',
  //authenticator.authenticate,
  validator.validate,
  processor.processvp,
  valenceUnitController.getByVP);

export default router;
