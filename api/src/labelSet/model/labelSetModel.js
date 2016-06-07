'use strict';

const mongoose = require('mongoose');

var labelSetSchema = mongoose.Schema({
    valence: {type: mongoose.Schema.Types.ObjectId, ref: 'Valence'},
    labels: [{type: mongoose.Schema.Types.ObjectId, ref: 'Label'}]
});

var LabelSet = mongoose.model('LabelSet', labelSetSchema);

module.exports = LabelSet;