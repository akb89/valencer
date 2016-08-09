'use strict';

const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const PatternUtils = require('./../utils/patternUtils');
const ValenceUnitUtils = require('./../utils/valenceUnitUtils');

const AnnotationSet = require('./../model/annotationSetModel');
const Label = require('./../model/labelModel');
const LexUnit = require('./../model/lexUnitModel');
const Pattern = require('./../model/patternModel');
const Sentence = require('./../model/sentenceModel');
const ValenceUnit = require('./../model/valenceUnitModel');

const NotFoundException = require('./../exception/valencerException').NotFoundException;

const FastSet = require('collections/fast-set');

require('./../utils/utils');

const logger = require('./../logger');

var _query;

function* getAll(){
    _query = this.query.vp;
    logger.info('Querying for all annotationSets with valence pattern matching: '+_query);
    var tokenArray = ValenceUnitUtils.toTokenArray(PatternUtils.toValenceArray(_query));
    try{
        yield mongoose.connect('mongodb://localhost:27017/noframenet');
    }catch(err){
        logger.error(err);
    }
    var patternSet = yield getPatternSet(tokenArray);
    //var annoSet = yield
    // AnnotationSet.findOne().populate('pattern').populate('sentence').populate('lexUnit').populate('labels');
    var annoSets = yield AnnotationSet.find().where('pattern').in(patternSet.toArray()).populate('pattern').populate('sentence').populate('lexUnit').populate('labels');

    this.body = annoSets;
}

//FIXME for NP ... Obj queries
function* getPatternSet(tokenArray){
    logger.info('Fetching patterns for tokenArray: '+tokenArray.toString());
    var patternSet = new FastSet(null, function (a, b) {
        return a._id.equals(b._id);
    }, function (object) {
        return object._id.toString();
    });
    for(let unit of tokenArray){
        var valenceUnitSet = yield getValenceUnitSet(unit);
        var _patterns = yield Pattern.find().where('valenceUnits').in(valenceUnitSet.toArray());
        if(_patterns.length === 0){
            throw new NotFoundException('Could not find patters matching given input in FrameNet database: '+_query);
        }
        var _patternSet = new FastSet(_patterns, function (a, b) {
            return a._id.equals(b._id);
        }, function (object) {
            return object._id.toString();
        });
        patternSet = patternSet.length === 0 ? _patternSet : patternSet.intersection(_patternSet);
    }
    return patternSet;
}

function* getValenceUnitSet(unit){
    logger.info('Fetching valence units for unit: '+unit);
    var set = new FastSet(null, function (a, b) {
        return a._id.equals(b._id);
    }, function (object) {
        return object._id.toString();
    });
    var valenceUnit = {
        fe: undefined,
        pt: undefined,
        gf: undefined
    };
    for(let token of unit){
        if(valenceUnit.fe === undefined){
            var _FE = yield ValenceUnit.find().where('FE').equals(token);
            if(_FE.length !== 0){
                var FE = new FastSet(_FE, function (a, b) {
                    return a._id.equals(b._id);
                }, function (object) {
                    return object._id.toString();
                });
                set = set.length === 0 ? FE : set.intersection(FE);
                valenceUnit.fe = token;
                continue;
            }
        }
        if(valenceUnit.pt === undefined){
            var _PT = yield ValenceUnit.find().where('PT').equals(token);
            if(_PT.length !== 0){
                var PT = new FastSet(_PT, function (a, b) {
                    return a._id.equals(b._id);
                }, function (object) {
                    return object._id.toString();
                });
                set = set.length === 0 ? PT : set.intersection(PT);
                valenceUnit.pt = token;
                continue;
            }
        }
        if(valenceUnit.gf === undefined){
            var _GF = yield ValenceUnit.find().where('GF').equals(token);
            if(_GF.length !== 0){
                var GF = new FastSet(_GF, function (a, b) {
                    return a._id.equals(b._id);
                }, function (object) {
                    return object._id.toString();
                });
                set = set.length === 0 ? GF : set.intersection(GF);
                valenceUnit.gf = token;
                continue;
            }
        }
        throw new NotFoundException('Could not find token in FrameNet database: '+token);
    }
    return set;
}

module.exports = {getValenceUnitSet, getPatternSet, getAll};