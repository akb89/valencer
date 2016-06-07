'use strict';

const router = require('koa-router')();
var compose = require('koa-compose');
const patternController = require('./pattern/controller/patternController');
const tokenController = require('./token/controller/tokenController');
const valencerController = require('./valencer/controller/valencerController');
const logger = require('./logger');

router.get('/valencer/query', compose([patternController.validatePatternSyntax, valenceController.validateValenceSyntax, tokenController.validateTokenType, valencerController.getAllValencer]));

//router.post('/valencer/importFNData', dataController.importFNData);

module.exports = router;

// Testing Koa
/*
app.use(function *(){

       logger.info('Starting Koa');

     var valence1 = new valencer({FE:'TestFE1', PT:'TestPT1', GF:'TestGF1'});
     yield valence1.save();
     logger.info('Saving to DB: '+valence1);

     var valence2 = new valencer();
     valence2.FE = "TestFE2";
     valence2.PT = "TestPT2";
     valence2.GF = "TestGF2";

     yield valence2.save();
     logger.info('Saving to DB: ' + valence2);

     var pattern1 = new Pattern({valences:[valence1, valence2]});
     yield pattern1.save();
     logger.info('Saving to DB: ' + pattern1);


});*/