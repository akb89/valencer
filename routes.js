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

router.get('/annoSets',
  //authenticator.authenticate,
  //validator.validate,
  preprocessor.preprocess,
  annoSetController.getAll);

router.get('/frames', frameController.getAll);

router.get('/lexUnits', lexUnitController.getAll);

router.get('/patterns', patternController.getAll);

// router.get('/similarity', similarityController.getAll);

router.get('/valenceUnits', valenceUnitController.getAll);

export default router;
