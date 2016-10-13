'use strict';

import AnnotationSet from '../models/annotationSet';
import LexUnit from '../models/lexUnit';
import {getPatternSet} from './getController';
import config from '../config';

const logger = config.logger;

async function getAll(context){
    var query = context.query.vp;
    logger.info('Querying for all distinct lexUnits with a valence pattern matching: '+ query);
    var patternSet = await getPatternSet(query);
    var luIds = await AnnotationSet
        .find()
        .where('pattern')
        .in(patternSet.toArray())
        .distinct('lexUnit');
    var lexUnits = await LexUnit
        .find()
        .where('_id')
        .in(luIds)
        .distinct('frame');
        //.select('name frame -_id');
    logger.info(lexUnits.length+' unique frames found for specified input');
    context.body = lexUnits.sort();
}

export default {getAll};
