'use strict';

import ValenceUnit from './../model/valenceUnitModel';
import {getPatternSet} from './getController';
import config from './../server';

//const logger = config.logger // FIXME: doesn't work. And having to write config.logger all the time is not acceptable

async function getAll(context){
    var query = context.query.vp;
    config.logger.info('Querying for all valenceUnits with matching: '+ query);
    var valenceUnitSet = await getValenceUnitSet(query);

    var valenceUnits = await ValenceUnit
        .find()
        .where('_id')
        .in(valenceUnitSet.toArray())
        .select('-_id');
    config.logger.info(valenceUnits.length+' unique valenceUnits found for specified entry');
    context.body = valenceUnits;
}

export default {getAll};