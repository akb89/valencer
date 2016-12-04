import Router from 'koa-router';
import annoSetController from './controllers/annoSetController';
import frameController from './controllers/frameController';
import lexUnitController from './controllers/lexUnitController';
import patternController from './controllers/patternController';
import valenceUnitController from './controllers/valenceUnitController';
import authenticator from './middlewares/authenticator';
import validator from './middlewares/validator';
import preprocessor from './middlewares/preprocessor';

const router = new Router();


router.get('/annoSet/:id',
  //authenticator.authenticate,
  //validator.validate,
  preprocessor.processid,
  annoSetController.getAll);

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
 * curl -i
 * http://localhost/annoSets?vp=Donor.NP.Ext+Theme.NP.Obj+Recipient.PP[to].Dep
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 *
 * @apiError NotFound   Details.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "error": "NoAccessRight"
 *     }
 */
router.get('/annoSets',
  //authenticator.authenticate,
  //validator.validate,
  preprocessor.processvp,
  annoSetController.getAll);

router.get('/frames',
  //authenticator.authenticate,
  //validator.validate,
  preprocessor.processvp,
  frameController.getAll);

router.get('/frame/:id',
  //authenticator.authenticate,
  //validator.validate,
  preprocessor.processid,
  frameController.getAll);

router.get('/lexUnits',
  //authenticator.authenticate,
  //validator.validate,
  preprocessor.processvp,
  lexUnitController.getAll);

router.get('/lexUnit/:id',
  //authenticator.authenticate,
  //validator.validate,
  preprocessor.processid,
  lexUnitController.getAll);

router.get('/patterns', patternController.getAll);

router.get('/valenceUnits', valenceUnitController.getAll);

export default router;
