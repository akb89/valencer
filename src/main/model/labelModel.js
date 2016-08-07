'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var labelSchema = mongoose.Schema({
    name:  {type: String, index: true}, // TODO : add fn_id for FE?
    type:  {type: String},
    startPos:   {type: Number},
    endPos:     {type: Number}
});

//labelSchema.index({name: 1, type: 1, startPos: 1, endPos: 1}, {unique: true});
// TODO Remove unique index?

labelSchema.static('findLabel', function (name, type, startPos, endPos){
    return Label.findOne().where('name').equals(name).where('type').equals(type).where('startPos').equals(startPos).where('endPos').equals(endPos);
});

var Label = mongoose.model('Label', labelSchema);

module.exports = Label;