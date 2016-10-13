'use strict';

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

var labelSchema = mongoose.Schema({
    name:  {type: String, index: true},
    type:  {type: String, index: true},
    startPos:   {type: Number},
    endPos:     {type: Number}
});

export default mongoose.model('Label', labelSchema);