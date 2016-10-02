'use strict';

// TODO: validate all input queries

import Router from 'koa-router';
import annoSetController from './controller/annoSetController';
import frameController from './controller/frameController';
import lexUnitController from './controller/lexUnitController';
import patternController from './controller/patternController';
import similarityController from './controller/similarityController';
import valenceUnitController from './controller/valenceUnitController';

const router = Router();

router.get('/annoSets', annoSetController.getAll);

router.get('/frames', frameController.getAll);

router.get('/lexUnits', lexUnitController.getAll);

router.get('/patterns', patternController.getAll);

//router.get('/similarity', similarityController.getAll);

router.get('/valenceUnits', valenceUnitController.getAll);

export default router;