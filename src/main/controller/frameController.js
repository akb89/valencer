'use strict';

const getController = require('./getController');
const AnnotationSet = require('./../model/annotationSetModel');
const LexUnit = require('./../model/lexUnitModel');

const logger = require('./../config/development').logger;

var _query;

function* getAll(){
    _query = this.query.vp;
    //FIXME logger
    //logger.info('Querying for all distinct lexUnits with a valence pattern matching: '+_query);
    var patternSet = yield getController.getPatternSet(_query);
    var luIds = yield AnnotationSet
        .find()
        .where('pattern')
        .in(patternSet.toArray())
        .distinct('lexUnit');
    var lexUnits = yield LexUnit
        .find()
        .where('_id')
        .in(luIds)
        .distinct('frame');
        //.select('name frame -_id');
    logger.info(lexUnits.length+' unique frames found for specified input');
    this.body = lexUnits.sort();
}

module.exports = {
    getAll
};