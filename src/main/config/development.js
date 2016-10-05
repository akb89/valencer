'use strict';

import Logger from './../logger';

const development = {
    dbUri: 'mongodb://localhost:27017/valencer_dev',
    port: 3030,
    logger: Logger.info,
    lexUnitDir: '/Users/AKB/Desktop/fndata-1.6/lu',
    frameDir: '/Users/AKB/Desktop/fndata-1.6/frame',
    fullTextDir: '/Users/AKB/Desktop/fndata-1.6/fulltext',
    frameNetLayers: ['FE', 'PT', 'GF'], // Configured this way for scalability, as other languages may use additional
    // specific layers
    feRelations: [{tag: 'excludesFE', name: 'excludes'}, {tag: 'requiresFE', name: 'requires'}], // Configured this
    // way for scalability. As of September 2016, FrameNet book Section 3.2.2.4 tells us feRelations may eventually
    // be expended.
    frameChunkSize: 100, //
    lexUnitChunkSize: 200,
    fullTextChunkSize: 100
};

module.exports = development;
