'use strict';

import AnnotationSet from '../model/annotationSetModel';
import LexUnit from './../model/lexUnitModel';
import {getPatternSet} from './getController';
import config from './../server';
import _ from 'lodash';

//const logger = config.logger // FIXME: doesn't work. And having to write config.logger all the time is not acceptable

async function getAll(context){
    var query = context.query.vp;
    config.logger.info('Querying for all distinct lexUnits with a valence pattern matching: '+ query);
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
        .select('frame name -_id');
    lexUnits = _.sortBy(lexUnits, ['frame', 'name']);
    config.logger.info(lexUnits.length + ' unique lexical units found for specified input');
    context.body = lexUnits;
}

export default {getAll};