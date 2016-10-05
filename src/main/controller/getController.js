'use strict';

import PatternUtils from './../utils/patternUtils';
import ValenceUnitUtils from './../utils/valenceUnitUtils';
import Pattern from'./../model/patternModel';
import ValenceUnit from './../model/valenceUnitModel';
import {NotFoundException} from './../exception/valencerException';
import FastSet from 'collections/fast-set';
import config from '../config';
import './../utils/utils';

const logger = config.logger;

// TODO: Ideally, I would want to have a class structure for this file, with private methods (maybe by defining them
// outside of the class). To be discussed. Also, the exception handling needs to be revised.

async function getPatternSet(query){
    return await _getPatternSet(preProcess(query));
}

async function getValenceUnitSet(query){
    return await _getValenceUnitSet(preProcess(query).tokenArray[0]); //TODO: clean this. Point is to take the first unit.
}

function preProcess(query){
    return {
        query: query,
        tokenArray: ValenceUnitUtils.toTokenArray(PatternUtils.toValenceArray(query))
    }
}

// FIXME for NP ... Obj queries <-- This is a major concern
async function _getPatternSet(preProcessedQuery){
    logger.debug('Fetching patterns for tokenArray: '+preProcessedQuery.tokenArray.toString());
    var patternSet = new FastSet(null, function (a, b) {
        return a._id.equals(b._id);
    }, function (object) {
        return object._id.toString();
    });
    for (let unit of preProcessedQuery.tokenArray){
        var valenceUnitSet = await _getValenceUnitSet(unit);
        logger.debug('ValenceUnitSet.length = '+valenceUnitSet.length);
        var _patterns = await Pattern.find().where('valenceUnits').in(valenceUnitSet.toArray());
        logger.debug('Pattern.length = '+_patterns.length);
        if(_patterns.length === 0){
            throw new NotFoundException('Could not find patters matching given input in FrameNet dbUri: '+preProcessedQuery.query);
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

async function _getValenceUnitSet(unit){
    logger.debug('Fetching valence units for unit: '+unit);
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
        logger.debug('Processing token: '+token);
        if(valenceUnit.fe === undefined){
            var _FE = await ValenceUnit.find().where('FE').equals(token);
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
            var _PT = await ValenceUnit.find().where('PT').equals(token);
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
            var _GF = await ValenceUnit.find().where('GF').equals(token);
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
        throw new NotFoundException('Could not find token in FrameNet dbUri: '+token);
    }
    return set;
}

export {
    preProcess,
    getPatternSet,
    getValenceUnitSet,
    _getValenceUnitSet,
    _getPatternSet
};
