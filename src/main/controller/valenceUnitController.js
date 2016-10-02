'use strict';

const ValenceUnit = require('./../model/valenceUnitModel');
const getController = require('./getController');
//const logger = require('./../server').logger; //FIXME

const logger = require('./../config/development').logger;

var _query;

function* getAll(){
    _query = this.query.vp;
    logger.info('Querying for all valenceUnits with matching: '+_query);
    var valenceUnitSet = yield getController.getValenceUnitSet(_query);

    var valenceUnits = yield ValenceUnit
        .find()
        .where('_id')
        .in(valenceUnitSet.toArray())
        .select('-_id');
    logger.info(valenceUnits.length+' unique valenceUnits found for specified entry');
    this.body = valenceUnits;
}

module.exports = {
    getAll
};