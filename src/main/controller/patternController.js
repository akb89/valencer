'use strict';

const Pattern = require('./../model/patternModel');
const getController = require('./getController');
//const logger = require('./../server').logger; //FIXME

const FastSet = require('collections/fast-set');

require('./../utils/utils'); // for hashcode

const logger = require('./../config/development').logger; // FIXME

const _ = require('lodash');

var _query;

function* getAll(){
    _query = this.query.vp;
    logger.info('Querying for all patterns with a valence pattern matching: '+_query);
    var patternSet = yield getController.getPatternSet(_query);

    var patterns = yield Pattern
        .find()
        .where('_id')
        .in(patternSet.toArray())
        .populate({path: 'valenceUnits'});

    // Patterns with no _id
    var cleanPatterns = patterns.map((pattern) => {
        return pattern.valenceUnits.map((valenceUnit) => {
            return {
                FE: valenceUnit.FE,
                PT: valenceUnit.PT,
                GF: valenceUnit.GF
            };
        })
    });
    var uniquePatterns = _.uniqWith(cleanPatterns, _.isEqual); // Will remove duplicate patterns in cleanPatterns
    logger.info(uniquePatterns.length+' unique patterns found for specified entry');
    logger.info(cleanPatterns.length+' exemplifying sentences found for specified entry');
    this.body = uniquePatterns;
}

module.exports = {
    getAll
};