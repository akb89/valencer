'use strict';

const getController = require('./getController');
const AnnotationSet = require('./../model/annotationSetModel');
const LexUnit = require('./../model/lexUnitModel');

const _ = require('lodash'); // TODO: clean this

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
        .select('frame name -_id');
    lexUnits = _.sortBy(lexUnits, ['frame', 'name']);
    logger.info(lexUnits.length + ' unique lexical units found for specified input');
    this.body = lexUnits;
}

module.exports = {
    getAll
};