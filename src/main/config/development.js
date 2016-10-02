'use strict';

import Logger from './../logger';

const development = {
    database: 'mongodb://localhost:27017/dev',
    port: 3030,
    logger: Logger.info,
    lexUnitDir: '/Users/AKB/Desktop/fndata-1.6/tmp/lu1000',
    frameDir: '/Users/AKB/Desktop/fndata-1.6/frame',
    frameNetLayers: ['FE', 'PT', 'GF'], // Configured this way for scalability, as other languages may use additional
    // specific layers
    feRelations: [{tag: 'excludesFE', name: 'excludes'}, {tag: 'requiresFE', name: 'requires'}], // Configured this
    // way for scalability. As of September 2016, FrameNet book Section 3.2.2.4 tells us feRelations may eventually
    // be expended.
    frameChunkSize: 500, //
    lexUnitChunkSize: 100
};

export default development;