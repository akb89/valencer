'use strict';

const MongoClient = require('mongodb').MongoClient;
const co = require('co');
const async = require('async');
const filesystem = require('fs');
const Jsonix = require('jsonix').Jsonix;
const FrameSchema = require('./../mapping/FrameSchema.js').FrameSchema;
const LexUnitSchema = require('./../mapping/LexUnitSchema').LexUnitSchema;
const FastSet = require('collections/fast-set');
const context = new Jsonix.Context([FrameSchema, LexUnitSchema]);
const unmarshaller = context.createUnmarshaller();
const path = require('path');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./../../../properties.ini');
const logger = require('./../logger');

const AnnotationSet = require('./../model/annotationSetModel');
const Label = require('./../model/labelModel');
const LexUnit = require('./../model/lexUnitModel');
const Pattern = require('./../model/patternModel');
const Sentence = require('./../model/sentenceModel');
const ValenceUnit = require('./../model/valenceUnitModel');

const frameNetLayers = ['FE', 'PT', 'GF']; //TODO: externalize?
const chunkLength = 20; //TODO: externalize?

const JsonixUtils = require('./../utils/jsonixUtils');

require('../utils/utils');

var __directory;

var lexUnits = [];
var labels = [];
var sentences = [];
var patterns = [];
var annotationSets = [];
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

var lexUnitCollection;
var valenceUnitCollection;
var patternCollection;
var sentenceCollection;
var labelCollection;
var annoSetCollection;

var annoSetCounter = 0;
var labelCounter = 0;
var lexUnitCounter = 0;
var patternCounter = 0;
var sentenceCounter = 0;

var duration = function(startTime){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(startTime)[1] / 1000000; // divide by a million to get nano to milli
    return process.hrtime(startTime)[0] + 's ';
};

var start = process.hrtime();

importFNData(properties.get('main.lexUnit.directory')).then(() => {logger.info('Import process completed in: '+ duration(start))});

function importFNData(lexUnitDir){
    logger.info('Processing directory: '+lexUnitDir);
    __directory = lexUnitDir;
    var filesPromise = new Promise((resolve, reject) => {
        filesystem.readdir(lexUnitDir, (error, files) => {
            if(error) return reject(error);
            return resolve(files);
        })
    });

    return co(function*() {
        var files = yield filesPromise;
        logger.info('Total number of files = ' + files.length);
        logger.info('Filtered files: '+files.filter(JsonixUtils.isValidXml).length);

        var slicedFileArray = files.filter(JsonixUtils.isValidXml).chunk(chunkLength);
        logger.info('Slice count: '+slicedFileArray.length);

        var db;
        try{
            db = yield MongoClient.connect('mongodb://localhost:27017/noframenet'); //TODO externalize this
            logger.info('Connected to database');

            annoSetCollection = db.collection('annotationsets');
            labelCollection = db.collection('labels');
            lexUnitCollection = db.collection('lexunits');
            patternCollection = db.collection('patterns');
            sentenceCollection = db.collection('sentences');
            valenceUnitCollection = db.collection('valenceunits');
            //TODO add all indexes here
            valenceUnitCollection.createIndex({FE: 1, PT: 1, GF: 1}, {unique: true});

            for(let batch of slicedFileArray){
                yield importAll(batch);
            }

            logger.verbose('Inserting to MongoDB...');
            logger.verbose('ValenceUnits = ' + valenceUnitSet.length);

            yield valenceUnitCollection.insertMany(valenceUnitSet.map((valenceUnit) => {return valenceUnit.toObject()}), {writeConcern: 0, j: false, ordered: false});

            logger.info('Total inserted to MongoDB: ');
            logger.info('AnnotationSets = ' + annoSetCounter);
            logger.info('Labels = ' + labelCounter);
            logger.info('LexUnits = ' + lexUnitCounter);
            logger.info('Patterns = ' + patternCounter);
            logger.info('Sentences = ' + sentenceCounter);
            logger.info('ValenceUnits = ' + valenceUnitSet.length);

        }catch(err){
            logger.error(err);
        }
    });
}

function* importAll(files){
    lexUnits = [];
    labels = [];
    sentences = [];
    patterns = [];
    annotationSets = [];

    yield files.map((file) => initFile(file));

    logger.verbose('Inserting to MongoDB...');
    logger.verbose('LexUnits = ' + lexUnits.length);
    lexUnitCounter += lexUnits.length;
    logger.verbose('Patterns = ' + patterns.length);
    patternCounter += patterns.length;
    logger.verbose('Sentences = ' + sentences.length);
    sentenceCounter += sentences.length;
    logger.verbose('Labels = ' + labels.length);
    labelCounter += labels.length;
    logger.verbose('AnnotationSets = ' + annotationSets.length);
    annoSetCounter += annotationSets.length;

    /**
     * Launching mongodb insertMany queries asynchronously so that init of next batch can start without waiting for
     * all insertMany queries to be completed.
     */

    lexUnitCollection.insertMany(lexUnits, {w: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#lexunitCollection.insertMany');
    });
    //FIXME {depopulate: true} throws error
    patternCollection.insertMany(patterns, {w: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#patternCollection.insertMany');
    });
    sentenceCollection.insertMany(sentences, {w: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#sentenceCollection.insertMany');
    });
    labelCollection.insertMany(labels, {w: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#labelCollection.insertMany');
    });
    annoSetCollection.insertMany(annotationSets, {w: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#annoSetCollection.insertMany');
    });
}

function initFile(file){
    return new Promise((resolve, reject) => {
        try{
            unmarshaller.unmarshalFile(path.join(__directory, file), (unmarshalledFile) => {
                return resolve(initLexUnit(unmarshalledFile));
            });
        }catch(err){
            return reject(err);
        }
    });
}

function initLexUnit(jsonixLexUnit){
    logger.info(
        'Processing lexUnit with fn_id = ' + jsonixLexUnit.value.id + ' and name = ' + jsonixLexUnit.value.name);
    var lexUnit = new LexUnit({
        fn_id: jsonixLexUnit.value.id,
        name: jsonixLexUnit.value.name,
        pos: jsonixLexUnit.value.pos,
        status: jsonixLexUnit.value.status,
        frame: jsonixLexUnit.value.frame,
        frameId: jsonixLexUnit.value.frameId,
        totalAnnotated: jsonixLexUnit.value.totalAnnotated
    });
    lexUnits.push(lexUnit.toObject()); // There should not be duplicates
    initSentences(JsonixUtils.toJsonixSentenceArray(jsonixLexUnit), lexUnit, getPatternsMap(jsonixLexUnit));
}

function getPatternsMap(jsonixLexUnit) {
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

function initSentences(jsonixSentences, lexUnit, annoSetPatternsMap) {
    async.each(jsonixSentences, (jsonixSentence) => {
        initSentence(jsonixSentence, lexUnit, annoSetPatternsMap);
    });
}

function initSentence(jsonixSentence, lexUnit, annoSetPatternsMap) {
    var sentence = new Sentence({
        fn_id: jsonixSentence.id,
        text: jsonixSentence.text
    });
    sentences.push(sentence.toObject());
    initAnnoSets(JsonixUtils.toJsonixAnnotationSetArray(jsonixSentence), lexUnit, sentence, annoSetPatternsMap);
}

function initAnnoSets(jsonixAnnoSets, lexUnit, sentence, annoSetPatternsMap) {
    async.each(jsonixAnnoSets, (jsonixAnnoSet) => {
        if(isFrameNetSpecific(JsonixUtils.toJsonixLayerArray(jsonixAnnoSet))) {
            initAnnoSet(jsonixAnnoSet, lexUnit, sentence, annoSetPatternsMap);
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

function initAnnoSet(jsonixAnnoSet, lexUnit, sentence, annoSetPatternsMap) {
    var annoSet = new AnnotationSet({
        fn_id: jsonixAnnoSet.id,
        sentence: sentence,
        lexUnit: lexUnit,
        labels: getLabels(jsonixAnnoSet),
        pattern: annoSetPatternsMap.get(jsonixAnnoSet.id)
    });
    annotationSets.push(annoSet.toObject({depopulate: true})); // there should not be duplicates
}

function getLabels(jsonixAnnoSet) {
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





