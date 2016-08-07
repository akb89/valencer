'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var valenceUnitSchema = mongoose.Schema({
    FE: {type: String, index:true},
    PT: {type: String, index:true},
    GF: {type: String, index:true}
});
valenceUnitSchema.index({FE: 1, PT: 1, GF: 1}, {unique: true});

valenceUnitSchema.static('findByLabels', function (feLabel, ptLabel, gfLabel) {
    return ValenceUnit.findOne().where('FE').equals(feLabel).where('PT').equals(ptLabel).where('GF').equals(gfLabel);
});

valenceUnitSchema.static('findByTokenTypes', function (labeledTokenArray){
    let query = 'this.find()';
    for(let i = 0; i < labeledTokenArray; i++){
        query += '.where(\''+labeledTokenArray[i].type+'\').equals(\''+labeledTokenArray[i].name+'\')';
    }
    return eval(query);
});

var ValenceUnit = mongoose.model('ValenceUnit', valenceUnitSchema);

module.exports = ValenceUnit;