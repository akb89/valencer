'use strict';

// TODO: validate all input queries

import Router from 'koa-router';
import annoSetController from './controllers/annoSetController';
import frameController from './controllers/frameController';
import lexUnitController from './controllers/lexUnitController';
import patternController from './controllers/patternController';
import similarityController from './controllers/similarityController';
import valenceUnitController from './controllers/valenceUnitController';

import authMiddleware from './auth/auth';

const router = Router();

//Corentin middlewares validating sent data should be put here
//We need to create a new directory with validators and make them as small functions
//that fullfill only one goal.

router.get('/annoSets', authMiddleware.auth, annoSetController.getAll);

router.get('/frames', frameController.getAll);

router.get('/lexUnits', lexUnitController.getAll);

router.get('/patterns', patternController.getAll);

//router.get('/similarity', similarityController.getAll);

router.get('/valenceUnits', valenceUnitController.getAll);

export default router;
