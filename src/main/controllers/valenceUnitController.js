'use strict';

import ValenceUnit from '../models/valenceUnit';
import {getPatternSet} from './getController';
import config from '../config';

const logger = config.logger;

async function getAll(context){
    var query = context.query.vp;
    logger.info('Querying for all valenceUnits with matching: '+ query);
    var valenceUnitSet = await getValenceUnitSet(query);

    var valenceUnits = await ValenceUnit
        .find()
        .where('_id')
        .in(valenceUnitSet.toArray())
        .select('-_id');
    logger.info(valenceUnits.length+' unique valenceUnits found for specified entry');
    context.body = valenceUnits;
}

export default {getAll};
