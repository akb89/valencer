'use strict';

const AnnotationSet = require('./../model/annotationSetModel');
const getController = require('./getController');
const logger = require('./../server').logger; //FIXME

var _query;

function* getAll(){
    _query = this.query.vp;
    //logger.info('Querying for all annotationSets with a valence pattern matching: '+_query);
    var patternSet = yield getController.getPatternSet(_query);
    var annoSets = yield AnnotationSet
        .find()
        .where('pattern')
        .in(patternSet.toArray())
        .populate({path:'pattern', populate: {path: 'valenceUnits'}})
        .populate({path:'sentence'})
        .populate({path:'lexUnit', populate: {path: 'frame'}})
        .populate({path:'labels'});
    this.body = annoSets;
}

module.exports = {
    getAll
};