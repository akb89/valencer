'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var labelSchema = mongoose.Schema({
    name:  {type: String},
    type:  {type: String},
    startPos:   {type: Number},
    endPos:     {type: Number}
});

var Label = mongoose.model('Label', labelSchema);

module.exports = Label;