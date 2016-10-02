'use strict';

const router = require('koa-router')();

const annoSetController = require('./controller/annoSetController');
const frameController = require('./controller/frameController');
const lexUnitController = require('./controller/lexUnitController');
const patternController = require('./controller/patternController');
const similarityController = require('./controller/similarityController');
const valenceUnitController = require('./controller/valenceUnitController');

router.get('/annoSets', annoSetController.getAll);

router.get('/frames', frameController.getAll);

router.get('/lexUnits', lexUnitController.getAll);

router.get('/patterns', patternController.getAll);

//router.get('/similarity', similarityController.getAll);

router.get('/valenceUnits', valenceUnitController.getAll);

module.exports = router;