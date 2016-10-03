'use strict';

import Pattern from './../model/patternModel';
import {getPatternSet} from './getController';
import FastSet from 'collections/fast-set';
import config from '../config';
import _ from 'lodash';
import './../utils/utils'; // for hashcode

const logger = config.logger

async function getAll(context){
    var query = context.query.vp;
    logger.info('Querying for all patterns with a valence pattern matching: '+query);
    var patternSet = await getPatternSet(query);
    var patterns = await Pattern
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
    context.body = uniquePatterns;
}

export default {getAll};
