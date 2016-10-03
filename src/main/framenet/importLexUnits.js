/**
 * Standalone script to import FrameNet lexical units data to MongoDB.
 */
'use strict';

import async from 'async'
import co from 'co'
import FastSet from 'collections/fast-set'
import filesystem from 'fs';
import mongodb from 'mongodb';
import path from 'path';
import jsonix from 'jsonix';
import frameSchema from './../mapping/FrameSchema.js';
import lexUnitSchema from './../mapping/LexUnitSchema';
import AnnotationSet from './../model/annotationSetModel';
import Label from './../model/labelModel';
import Pattern from './../model/patternModel';
import Sentence from './../model/sentenceModel';
import ValenceUnit from './../model/valenceUnitModel';
import JsonixUtils from './../utils/jsonixUtils';
import Promise from 'bluebird';
import development from './../config/development';
import testing from './../config/testing';
import production from './../config/production';
import './../utils/utils';

const MongoClient = mongodb.MongoClient;
const Jsonix = jsonix.Jsonix;
const FrameSchema = frameSchema.FrameSchema;
const LexUnitSchema = lexUnitSchema.LexUnitSchema;
const context = new Jsonix.Context([FrameSchema, LexUnitSchema]);
const unmarshaller = context.createUnmarshaller();
// TODO: what about testing?
const config = (process.env.NODE_ENV == 'production' ) ? production : development;
const logger = config.logger;
const dbUri = config.database;
const __directory = config.lexUnitDir;
const frameNetLayers = config.frameNetLayers;
const chunkSize = config.lexUnitChunkSize;

// TODO : keep as global variables ?
var annoSetCounter = 0;
var labelCounter = 0;
var patternCounter = 0;
var sentenceCounter = 0;

var duration = function(startTime){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(startTime)[1] / 1000000; // divide by a million to get nano to milli
    return process.hrtime(startTime)[0] + 's ';
};

var start = process.hrtime();

importFNData(__directory).then(() => {logger.info('Import process completed in: '+ duration(start))});

// TODO add error and exit on invalid directory
async function importFNData(lexUnitDir){
    logger.info('Processing directory: '+lexUnitDir);
    var filesPromise = new Promise((resolve, reject) => {
        filesystem.readdir(lexUnitDir, (error, files) => {
            if(error) return reject(error);
            return resolve(files);
        })
    });

    var files = await filesPromise;
    logger.info('Total number of files = ' + files.length);
    logger.info('Filtered files: '+files.filter(JsonixUtils.isValidXml).length);

    var slicedFileArray = files.filter(JsonixUtils.isValidXml).chunk(chunkSize);
    logger.info('Slice count: '+slicedFileArray.length);

    var db;
    try {
        db = await MongoClient.connect(dbUri);
    }catch(err){
        logger.error(err);
        process.exit(1);
    }
    logger.info(`Connected to database: ${dbUri}`);

    var annoSetCollection = db.collection('annotationsets');
    var labelCollection = db.collection('labels');
    var lexUnitCollection = db.collection('lexunits');
    var patternCollection = db.collection('patterns');
    var sentenceCollection = db.collection('sentences');
    var valenceUnitCollection = db.collection('valenceunits');

    //TODO add all indexes here
    valenceUnitCollection.createIndex({FE: 1, PT: 1, GF: 1}, {unique: true});

    var valenceUnitSet = new FastSet(null, function (a, b) {
        return a.FE === b.FE
            && a.PT === b.PT
            && a.GF === b.GF;
    }, function (object) {
        var result = object.FE != null ? object.FE.hashCode() : 0;
        result = 31 * result + (object.PT != null ? object.PT.hashCode() : 0);
        result = 31 * result + (object.GF != null ? object.GF.hashCode() : 0);
        return result.toString();
    });

    for(let batch of slicedFileArray){
        var annotationSets = [];
        var labels = [];
        var patterns = [];
        var sentences = [];
        await importAll(
            batch,
            annotationSets,
            labels,
            patterns,
            sentences,
            valenceUnitSet,
            annoSetCollection,
            labelCollection,
            lexUnitCollection,
            patternCollection,
            sentenceCollection
        );
    }

    valenceUnitCollection.insertMany(valenceUnitSet.map((valenceUnit) => {return valenceUnit.toObject()}), {writeConcern: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#valenceUnitCollection.insertMany');
    });

    logger.info('Total inserted to MongoDB: ');
    logger.info('AnnotationSets = ' + annoSetCounter);
    logger.info('Labels = ' + labelCounter);
    logger.info('Patterns = ' + patternCounter);
    logger.info('Sentences = ' + sentenceCounter);
    logger.info('ValenceUnits = ' + valenceUnitSet.length);

}

async function importAll(files, annotationSets, labels, patterns, sentences, valenceUnitSet, annoSetCollection,
                         labelCollection, lexUnitCollection, patternCollection, sentenceCollection){
    await Promise.all(files.map(async (file) => {
            var unmarshalledFile = await initFile(file, annotationSets, labels, patterns, sentences, valenceUnitSet,
                lexUnitCollection);
            await initLexUnit(unmarshalledFile, annotationSets, labels, patterns, sentences, valenceUnitSet,
                lexUnitCollection);
        }
    )); // FIXME Putting curly brackets here breaks the code!!

    annoSetCounter += annotationSets.length;
    labelCounter += labels.length;
    patternCounter += patterns.length;
    sentenceCounter += sentences.length;

    /**
     * Launching mongodb insertMany queries asynchronously so that init of next batch can start without waiting for
     * all insertMany queries to be completed.
     */

    annoSetCollection.insertMany(annotationSets, {w: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#annoSetCollection.insertMany');
    });
    labelCollection.insertMany(labels, {w: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#labelCollection.insertMany');
    });
    patternCollection.insertMany(patterns, {w: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#patternCollection.insertMany');
    });
    sentenceCollection.insertMany(sentences, {w: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#sentenceCollection.insertMany');
    });
}

function initFile(file, annotationSets, labels, patterns, sentences, valenceUnitSet, lexUnitCollection){
    return new Promise((resolve, reject) => {
        try{
            unmarshaller.unmarshalFile(path.join(__directory, file), (unmarshalledFile) => {
                logger.info(
                    `Processing lexUnit with fn_id = ${unmarshalledFile.value.id} and name = ${unmarshalledFile.value.name}`);
                return resolve(unmarshalledFile);
            });
        }catch(err){
            return reject(err);
        }
    });
}

async function initLexUnit(jsonixLexUnit, annotationSets, labels, patterns, sentences, valenceUnitSet, lexUnitCollection){
    //logger.info(
    //    'Processing lexUnit with fn_id = ' + jsonixLexUnit.value.id + ' and name = ' + jsonixLexUnit.value.name);

    var lexUnit = await lexUnitCollection.findOne({fn_id: jsonixLexUnit.value.id});

    initSentences(
        JsonixUtils.toJsonixSentenceArray(jsonixLexUnit),
        lexUnit,
        getPatternsMap(jsonixLexUnit, patterns, valenceUnitSet), // TODO optimize this?
        annotationSets,
        labels,
        sentences
    );
}

function getPatternsMap(jsonixLexUnit, patterns, valenceUnitSet) {
    var map = new Map();
    JsonixUtils.toJsonixPatternArray(jsonixLexUnit).forEach((jsonixPattern) => {
        var patternVUs = JsonixUtils.toJsonixValenceUnitArray(jsonixPattern).map((jsonixValenceUnit) => {
            var _valenceUnit = new ValenceUnit({
                FE: jsonixValenceUnit.fe,
                PT: jsonixValenceUnit.pt,
                GF: jsonixValenceUnit.gf
            });
            var valenceUnit = valenceUnitSet.get(_valenceUnit);
            if (valenceUnit !== undefined) {
                return valenceUnit;
            } else {
                valenceUnitSet.add(_valenceUnit);
                return _valenceUnit;
            }
        });
        var pattern = new Pattern({
            valenceUnits: patternVUs
        });
        patterns.push(pattern.toObject({depopulate: true}));
        JsonixUtils.toJsonixAnnoSetArray(jsonixPattern).forEach((jsonixAnnoSet) => {
            if (map.has(jsonixAnnoSet.id)) {
                logger.error('AnnoSet already exists');
            }
            map.set(jsonixAnnoSet.id, pattern);
        });
    });
    return map;
}

function initSentences(jsonixSentences, lexUnit, annoSetPatternsMap, annotationSets, labels, sentences) {
    async.each(jsonixSentences, (jsonixSentence) => {
        initSentence(
            jsonixSentence,
            lexUnit,
            annoSetPatternsMap,
            annotationSets,
            labels,
            sentences
        );
    });
}

function initSentence(jsonixSentence, lexUnit, annoSetPatternsMap, annotationSets, labels, sentences) {
    var sentence = new Sentence({
        fn_id: jsonixSentence.id,
        text: jsonixSentence.text
    });
    sentences.push(sentence.toObject());

    initAnnoSets(
        JsonixUtils.toJsonixAnnotationSetArray(jsonixSentence),
        lexUnit,
        sentence,
        annoSetPatternsMap,
        annotationSets,
        labels
    );
}

function initAnnoSets(jsonixAnnoSets, lexUnit, sentence, annoSetPatternsMap, annotationSets, labels) {
    async.each(jsonixAnnoSets, (jsonixAnnoSet) => {
        if(isFrameNetSpecific(JsonixUtils.toJsonixLayerArray(jsonixAnnoSet))) {
            initAnnoSet(
                jsonixAnnoSet,
                lexUnit,
                sentence,
                annoSetPatternsMap,
                annotationSets,
                labels
            );
        }
    });
}

function isFrameNetSpecific(jsonixLayers) {
    for(let jsonixLayer of jsonixLayers){
        if(frameNetLayers.includes(jsonixLayer.name)) {
            return true;
        }
    }
    return false;
}

function initAnnoSet(jsonixAnnoSet, lexUnit, sentence, annoSetPatternsMap, annotationSets, labels) {
    var annoSet = new AnnotationSet({
        fn_id: jsonixAnnoSet.id,
        sentence: sentence,
        lexUnit: lexUnit,
        labels: getLabels(jsonixAnnoSet, labels),
        pattern: annoSetPatternsMap.get(jsonixAnnoSet.id)
    });
    annotationSets.push(annoSet.toObject({depopulate: true})); // there should not be duplicates
}

function getLabels(jsonixAnnoSet, labels) {
    // AnnoSet is already filtered: it's already FrameNet-specific (i.e. only FE/PT/GF/Target)
    return JsonixUtils.toJsonixLayerArray(jsonixAnnoSet).map((jsonixLayer) => {
        return JsonixUtils.toJsonixLabelArray(jsonixLayer).map((jsonixLabel) => {
            var label = new Label({
                name: jsonixLabel.name,
                type: jsonixLayer.name,
                startPos: jsonixLabel.start,
                endPos: jsonixLabel.end
            });
            labels.push(label.toObject()); // There will be duplicates but we don't care
            return label;
        });
    }).flatten();
}