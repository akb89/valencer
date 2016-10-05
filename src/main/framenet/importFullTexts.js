'use strict';

import path from 'path';
import jsonix from 'jsonix';
import preProcessor from './preProcessor';
import fullTextSchema from './../mapping/FullTextSchema.js';
import Corpus from './../model/corpusModel';
import Document from './../model/documentModel';
import jsonixUtils from './utils/jsonixUtils';
import config from '../config';
import './utils/utils';

const Jsonix = jsonix.Jsonix;
const FullTextSchema = fullTextSchema.FullTextSchema;
const context = new Jsonix.Context([FullTextSchema]);
const unmarshaller = context.createUnmarshaller();
const logger = config.logger;
const startTime = process.hrtime();

if (require.main === module) {
    importFullText(config.fullTextDir, config.dbUri, config.fullTextChunkSize);
    logger.info(`Import process completed in ${process.hrtime(startTime)[0]}s`)
}

async function importFullText(fullTextDir, dbUri, chunkSize) {
    var batchSet = await preProcessor.getFilteredArrayOfFiles(fullTextDir, chunkSize);
    var db = await preProcessor.connectToDatabase(dbUri);
    var counter = {
        batch: 1
    };
    for (let batch of batchSet) {
        var corpora = [];
        var documents = [];
        logger.info(`Importing fullText batch ${counter.batch} out of ${batchSet.length}...`);
        counter.batch++;
        await importAll(batch, fullTextDir, db, corpora, documents);
    }
    logOutputStats(corpora, documents, counter);
}

function logOutputStats(corpora, documents, counter) {

}

async function importAll(files, fullTextDir, db, corpora, documents) {
    await Promise.all(files.map((file) => {
        initFile(file, fullTextDir, db, corpora, documents)
    }));
}

function initFile(file, fullTextDir, db, corpora, documents) {
    return new Promise((resolve, reject) => {
        try {
            unmarshaller.unmarshalFile(path.join(fullTextDir, file), (unmarshalledFile) => {
                return resolve(
                    initFullText(unmarshalledFile, db));
            });
        } catch (err) {
            return reject(err);
        }
    });
}

async function initFullText(jsonixFullText, db) {
    logger.debug(
        `Processing fullText with id = ${jsonixFullText.value.header.corpus[0].id} and name = ${jsonixFullText.value.header.corpus[0].name}`);
    var corpus = new Corpus({
        _id: jsonixFullText.value.header.corpus[0].id,
        name: jsonixFullText.value.header.corpus[0].name,
        description: jsonixFullText.value.header.corpus[0].description,
        documents: await getDocuments(jsonixFullText, db)
    });
}

async function getDocuments(jsonixFullText, db) {
    var documents = [];
    for(let jsonixDocument of jsonixUtils.toJsonixDocumentArray(jsonixFullText.value.header.corpus[0])){
        var document = new Document({
            _id: jsonixDocument.id,
            name: jsonixDocument.name,
            description: jsonixDocument.description,
        });
        document.sentences = await getSentences(jsonixFullText, db);
        //console.log(document.sentences.length);
        documents.push(document);
    }
    return documents;
}

async function getSentences(jsonixFullText, db) {
    var sentences = [];
    for(let jsonixSentence of jsonixUtils.toJsonixDocumentSentenceArray(jsonixFullText)){
        var sentence = await db.collection('sentences').findOne({_id: jsonixSentence.id});
        if(sentence === null){
            logger.error(`Sentence not found: _id = ${jsonixSentence.id}`);
        }else{
            console.log(sentence._id);
        }
        sentences.push(sentence);
    }
    return sentences;
}