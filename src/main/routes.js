'use strict';

const router = require('koa-router')();
const compose = require('koa-compose');

/*
const patternController = require('./pattern/controller/patternController');
const tokenController = require('./token/controller/tokenController');
const valencerController = require('./valencer/controller/valencerController');
const importController = require('./importController');
*/

const getController = require('./controller/getController');
const logger = require('./logger');
/*
router.get('/valencer/query', compose([patternController.validatePatternSyntax,' +
    ' valenceController.validateValenceSyntax,
    tokenController.validateTokenType, valencerController.getAllValencer]));
    */

router.get('/valencer/query', getController.getAll);

router.get('/test', function *(){
    this.body = 'This is a test: '+this.request.query.vp;
});

//router.post('/valencer/importData', importController.importData);

module.exports = router;