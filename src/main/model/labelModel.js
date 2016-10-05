'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

var labelSchema = mongoose.Schema({
    name:  {type: String},
    type:  {type: String},
    startPos:   {type: Number},
    endPos:     {type: Number}
});

export default mongoose.model('Label', labelSchema);