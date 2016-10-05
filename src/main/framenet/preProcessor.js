'use strict';

import jsonixUtils from './utils/jsonixUtils';
import mongodb from 'mongodb';
import filesystem from 'fs';
import config from '../config';

const MongoClient = mongodb.MongoClient;
const logger = config.logger;

async function getFilteredArrayOfFiles(dir, chunkSize){
    logger.info('Processing directory: '+dir);
    var filesPromise = new Promise((resolve, reject) => {
        filesystem.readdir(dir, (error, files) => {
            if(error) return reject(error);
            return resolve(files);
        })
    });
    var files = await filesPromise;
    logger.debug(`Unfiltered files count = ${files.length}`);
    logger.info(`Total number of files = ${files.filter(jsonixUtils.isValidXml).length}`);
    var slicedFileArray = files.filter(jsonixUtils.isValidXml).chunk(chunkSize);
    logger.debug(`Slice count = ${slicedFileArray.length}`);
    return slicedFileArray;
}

async function connectToDatabase(uri){
    var db;
    try {
        db = await MongoClient.connect(uri);
    }catch(err){
        logger.error(err);
        process.exit(1); // TODO : graceful exit?
    }
    logger.info(`Connected to database: ${config.dbUri}`);
    return db;
}

export default {
    getFilteredArrayOfFiles,
    connectToDatabase
}