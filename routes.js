'use strict';

import Router from 'koa-router';
import annoSetController from './controllers/annoSetController';
import frameController from './controllers/frameController';
import lexUnitController from './controllers/lexUnitController';
import patternController from './controllers/patternController';
import valenceUnitController from './controllers/valenceUnitController';
import testController from './controllers/testController';
import authenticator from './middlewares/authenticator';
import validator from './middlewares/validator';
import processor from './middlewares/processor';

const router = new Router();

/**
 * Corentin middlewares validating sent data should be put here
 * We need to create a new directory with validators and make them as small functions
 * that fullfill only one goal.
 */

/*
router.get('/annoSets', authenticator.authenticate, validator.validate, processor.process,
  annoSetController.getAll);
  */

router.get('/frames', frameController.getAll);

router.get('/lexUnits', lexUnitController.getAll);

router.get('/patterns', patternController.getAll);

// router.get('/similarity', similarityController.getAll);

router.get('/valenceUnits', valenceUnitController.getAll);

router.get('/tests', testController.test);

export default router;
