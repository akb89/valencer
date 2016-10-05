'use strict';

import AnnotationSet from '../model/annotationSetModel';
import {getPatternSet} from './getController';
import config from '../config';

const logger = config.logger;

// TODO : Discuss what should be populated
async function getAll(context) {
    var query = context.query.vp;
    logger.info('Querying for all annotationSets with a valence pattern matching: ' + query);
    var patternSet = await getPatternSet(query);
    context.body = await AnnotationSet
        .find()
        .where('pattern')
        .in(patternSet.toArray())
        .populate({path:'pattern', populate: {path: 'valenceUnits'}})
        .populate({path:'sentence'})
        .populate({path:'lexUnit', populate: {path: 'frame'}})
        .populate({path:'labels'});
}

export default {getAll};
