'use strict';

const mongoose = require('mongoose');

var labelSchema = mongoose.Schema({
    labelName:  {type: String, index:true},
    labelType:  {type: String},
    startPos:   {type: Number},
    endPos:     {type: Number}
});

var Label = mongoose.model('Label', labelSchema);

module.exports = Label;