/**
 * Standalone script to import FrameNet frames data to MongoDB.
 */

'use strict';

import FastSet from 'collections/fast-set'
import filesystem from 'fs';
import mongodb from 'mongodb';
import path from 'path';
import jsonix from 'jsonix';
import frameSchema from './../mapping/FrameSchema.js';
import lexUnitSchema from './../mapping/LexUnitSchema';
import Frame from './../model/frameModel';
import FrameElement from './../model/frameElementModel';
import FrameRelation from './../model/frameRelationModel';
import FERelation from './../model/frameElementRelationModel';
import Lexeme from './../model/lexemeModel';
import LexUnit from './../model/lexUnitModel';
import SemType from './../model/semTypeModel';
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
const __directory = config.frameDir;
const feRelationTypes = config.feRelations;
const chunkSize = config.frameChunkSize;

var duration = function(startTime){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(startTime)[1] / 1000000; // divide by a million to get nano to milli
    return process.hrtime(startTime)[0] + 's ';
};

var start = process.hrtime();

importFrames(__directory).then(() => {logger.info('Import process completed in: '+ duration(start))});

// TODO question: should I keep those as global variables?
var feRelationCounter = 0;
var frameRelationCounter = 0;
var lexemeCounter = 0;
var lexUnitCounter = 0;

// TODO add error and exit on invalid directory
// TODO I'd like to remove Promises: is that possible?
async function importFrames(frameDir){
    logger.info('Processing directory: '+frameDir);
    var filesPromise = new Promise((resolve, reject) => {
        filesystem.readdir(frameDir, (error, files) => {
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

    var frameCollection = db.collection('frames');
    var frameElementCollection = db.collection('frameelements');
    var feRelationCollection = db.collection('ferelations');
    var frameRelationCollection = db.collection('framerelations');
    var lexemeCollection = db.collection('lexemes');
    var lexUnitCollection = db.collection('lexunits');
    var semTypeCollection = db.collection('semtypes');

    // TODO add all indexes here
    // TODO should I create unique indexes on fn_ids? What about impact on write performances?
    frameCollection.createIndex({fn_id: 1}, {unique: true});
    frameCollection.createIndex({name: 1});
    frameElementCollection.createIndex({fn_id: 1}, {unique: true});
    lexUnitCollection.createIndex({fn_id: 1}, {unique: true});
    semTypeCollection.createIndex({fn_id: 1}, {unique: true});

    // Sets of unique elements
    // TODO: check if this is the right way to do this
    var frameSet = new FastSet(null, function (a, b) { // We need this for frameRelations. Frames can be added
        // before the corresponding file is parsed
        return a.fn_id === b.fn_id;
    }, function (object) {
        return object.fn_id.toString();
    });
    var frameElementSet = new FastSet(null, function (a, b) {
        return a.fn_id === b.fn_id;
    }, function (object) {
        return object.fn_id.toString();
    });
    var semTypeSet = new FastSet(null, function (a, b) {
        return a.fn_id === b.fn_id;
    }, function (object) {
        return object.fn_id.toString();
    });

    for(let batch of slicedFileArray){
        // TODO: check if this is the right way to do this
        var feRelations = [];
        var frameRelations = [];
        /**
         * Ideally this should be a set of unique lexemes identified by their names but here we also include
         * info regarding headword, etc. so we just consider the lexeme as an extra documentation of the lexical
         * unit. Hence no need to take care of uniqueness.
         * @type {Array}
         */
        var lexemes = [];
        var lexUnits = [];

        await importAll(batch, frameSet, frameElementSet, feRelations, frameRelations, lexemes, lexUnits, semTypeSet,
            feRelationCollection, frameRelationCollection, lexemeCollection, lexUnitCollection);
    }

    frameCollection.insertMany(frameSet.map((frame) => {return frame.toObject({depopulate: true})}), {writeConcern: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#frameCollection.insertMany');
    });
    frameElementCollection.insertMany(frameElementSet.map((frameElement) => {return frameElement.toObject()}), {writeConcern: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#frameElementCollection.insertMany');
    });
    semTypeCollection.insertMany(semTypeSet.map((semType) => {return semType.toObject()}), {writeConcern: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#semTypeCollection.insertMany');
    });

    logger.info('Total inserted to MongoDB: ');
    logger.info('Frames = ' + frameSet.length);
    logger.info('FrameElements = ' + frameElementSet.length);
    logger.info('FERelations = ' + feRelationCounter);
    logger.info('FrameRelations = ' + frameRelationCounter);
    logger.info('Lexemes = ' + lexemeCounter);
    logger.info('LexUnits = ' + lexUnitCounter);
    logger.info('SemTypes = ' + semTypeSet.length);
}

async function importAll(files, frameSet, frameElementSet, feRelations, frameRelations, lexemes, lexUnits, semTypeSet,
                         feRelationCollection, frameRelationCollection, lexemeCollection, lexUnitCollection){

    await Promise.all(files.map((file) =>
        initFile(file, frameSet, frameElementSet, feRelations, frameRelations, lexemes, lexUnits, semTypeSet)
    )); //FIXME weird bug here: curly brackets break the code...
    //TODO : Is Promise.all necessary?

    feRelationCounter += feRelations.length;
    frameRelationCounter += frameRelations.length;
    lexemeCounter += lexemes.length;
    lexUnitCounter += lexUnits.length;

    /**
     * Launching mongodb insertMany queries asynchronously so that init of next batch can start without waiting for
     * all insertMany queries to be completed.
     */
    feRelationCollection.insertMany(feRelations, {w: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#feRelationCollection.insertMany');
    });
    frameRelationCollection.insertMany(frameRelations, {w: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#frameRelationCollection.insertMany');
    });
    lexemeCollection.insertMany(lexemes, {w: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#lexemeCollection.insertMany');
    });
    lexUnitCollection.insertMany(lexUnits, {w: 0, j: false, ordered: false}, (err) => {
        err !== null ? logger.error(err) : logger.silly('#lexUnitCollection.insertMany');
    });
}

function initFile(file, frameSet, frameElementSet, feRelations, frameRelations, lexemes, lexUnits, semTypeSet){
    return new Promise((resolve, reject) => {
        try{
            unmarshaller.unmarshalFile(path.join(__directory, file), (unmarshalledFile) => {
                return resolve(initFrame(unmarshalledFile, frameSet, frameElementSet, feRelations, frameRelations, lexemes, lexUnits, semTypeSet));
            });
        }catch(err){
            return reject(err);
        }
    });
}

function initFrame(jsonixFrame, frameSet, frameElementSet, feRelations, frameRelations, lexemes, lexUnits, semTypeSet){
    logger.info('Processing frame with fn_id = ' + jsonixFrame.value.id + ' and name = ' + jsonixFrame.value.name);
    var _frame = new Frame({
        fn_id: jsonixFrame.value.id,
    });
    var frame = frameSet.get(_frame);
    if(frame !== undefined){ // This is only possible if the frame was already created via a frame relation. The
        // frameName.xml file is parsed only once.
        frame.name = jsonixFrame.value.name;
        frame.definition = jsonixFrame.value.definition;
        frame.cDate = jsonixFrame.value.cDate;
        frame.cBy = jsonixFrame.value.cBy;
        frame.frameElements = getFrameElements(jsonixFrame, frameElementSet, feRelations, semTypeSet);
        frame.frameRelations = getFrameRelations(jsonixFrame, frameSet, frameRelations);
        frame.feCoreSets = getFECoreSets(jsonixFrame, frameElementSet);
        frame.lexUnits = getLexUnits(jsonixFrame, frame, lexemes, lexUnits, semTypeSet);
        frame.semTypes = getSemTypes(jsonixFrame, semTypeSet);
    }else{
        _frame.name = jsonixFrame.value.name;
        _frame.definition = jsonixFrame.value.definition;
        _frame.cDate = jsonixFrame.value.cDate;
        _frame.cBy = jsonixFrame.value.cBy;
        _frame.frameElements = getFrameElements(jsonixFrame, frameElementSet, feRelations, semTypeSet);
        _frame.frameRelations = getFrameRelations(jsonixFrame, frameSet, frameRelations);
        _frame.feCoreSets = getFECoreSets(jsonixFrame, frameElementSet);
        _frame.lexUnits = getLexUnits(jsonixFrame, _frame, lexemes, lexUnits, semTypeSet);
        _frame.semTypes = getSemTypes(jsonixFrame, semTypeSet);
        frameSet.add(_frame);
    }
}

function getFrameElements(jsonixFrame, frameElementSet, feRelations, semTypeSet){
    return JsonixUtils.toJsonixFrameElementArray(jsonixFrame).map((jsonixFrameElement) => {
        logger.debug('Processing frame element with fn_id = '+ jsonixFrameElement.id + ' and name = '+ jsonixFrameElement.name);
        var _frameElement = new FrameElement({
            fn_id: jsonixFrameElement.id
        });
        var frameElement = frameElementSet.get(_frameElement);
        if(frameElement !== undefined && frameElement.coreType !== undefined){
            return frameElement;
        }else if(frameElement !== undefined){
            // name should already be set
            frameElement.definition = jsonixFrameElement.definition;
            frameElement.coreType = jsonixFrameElement.coreType;
            frameElement.cDate = jsonixFrameElement.cDate;
            frameElement.cBy = jsonixFrameElement.cBy;
            frameElement.fgColor = jsonixFrameElement.fgColor;
            frameElement.bgColor = jsonixFrameElement.bgColor;
            frameElement.abbrev = jsonixFrameElement.abbrev;
            frameElement.feRelations = getFERelations(jsonixFrameElement, frameElementSet, feRelations);
            frameElement.semType = getSemTypes(jsonixFrameElement, semTypeSet);
            return frameElement;
        }
        else{
            _frameElement.name = jsonixFrameElement.name;
            _frameElement.definition = jsonixFrameElement.definition;
            _frameElement.coreType = jsonixFrameElement.coreType;
            _frameElement.cDate = jsonixFrameElement.cDate;
            _frameElement.cBy = jsonixFrameElement.cBy;
            _frameElement.fgColor = jsonixFrameElement.fgColor;
            _frameElement.bgColor = jsonixFrameElement.bgColor;
            _frameElement.abbrev = jsonixFrameElement.abbrev;
            _frameElement.feRelations = getFERelations(jsonixFrameElement, frameElementSet, feRelations);
            _frameElement.semType = getSemTypes(jsonixFrameElement, semTypeSet);
            frameElementSet.add(_frameElement);
            return _frameElement;
        }
    });
}

function getFERelations(jsonixFrameElement, frameElementSet, feRelations){
    return feRelationTypes.map((feRelation) => {
        if(jsonixFrameElement.hasOwnProperty(feRelation.tag)){
            var _feRelation = new FERelation({
                type: feRelation.name,
                frameElements: []
            });
            var feRelationIterator = 0;
            while(jsonixFrameElement[feRelation.tag][feRelationIterator] !== undefined){
                var _frameElement = new FrameElement({
                    fn_id: jsonixFrameElement[feRelation.tag][feRelationIterator].id
                });
                var frameElement = frameElementSet.get(_frameElement);
                if(frameElement !== undefined){
                    _feRelation.frameElements.push(frameElement);
                }else{
                    _frameElement.name = jsonixFrameElement[feRelation.tag][feRelationIterator].name;
                    frameElementSet.add(_frameElement);
                    _feRelation.frameElements.push(_frameElement);
                }
                feRelationIterator++;
            }
            feRelations.push(_feRelation.toObject({depopulate: true}));
            return _feRelation.toObject({depopulate: true}); // TODO: bug in Mongoose?
        }
    }).filter(isNotUndefined);
}

/**
 *
 * @param jsonixElement can be either a jsonixFrame, a jsonixFrameElement or a jsonixLexUnit
 * @param semTypeSet
 * @returns {Array}
 */
function getSemTypes(jsonixElement, semTypeSet){
    return JsonixUtils.toJsonixSemTypeArray(jsonixElement).map((jsonixSemType) => {
        var _semType = new SemType({
            fn_id: jsonixSemType.id
        });
        var semType = semTypeSet.get(_semType);
        if(semType !== undefined){
            return semType;
        }else{
            _semType.name = jsonixSemType.name;
            semTypeSet.add(_semType);
            return _semType;
        }
    });
}

function getFrameRelations(jsonixFrame, frameSet, frameRelations){
    return JsonixUtils.toJsonixFrameRelationArray(jsonixFrame).map((jsonixFrameRelation) => {
        if(jsonixFrameRelation.hasOwnProperty('relatedFrame')){
            var frameRelation = new FrameRelation({
                type: jsonixFrameRelation.type,
                frames: []
            });
            var relatedFrameIterator = 0;
            while(jsonixFrameRelation.relatedFrame[relatedFrameIterator] !== undefined){
                var _frame = new Frame({
                    fn_id: jsonixFrameRelation.relatedFrame[relatedFrameIterator].id
                });
                var frame = frameSet.get(_frame);
                if(frame !== undefined){
                    frameRelation.frames.push(frame);
                }else{
                    frameSet.add(_frame);
                    frameRelation.frames.push(_frame);
                }
                relatedFrameIterator++;
            }
            frameRelations.push(frameRelation.toObject({depopulate: true}));
            return frameRelation.toObject({depopulate: true}); // TODO: bug in Mongoose?
        }
    }).filter(isNotUndefined);
}

//TODO : Maybe not the most optimized way to do things...
function isNotUndefined(value){
    return value !== undefined;
}

function getFECoreSets(jsonixFrame, frameElementSet){
    return JsonixUtils.toJsonixFECoreSetArray(jsonixFrame).map((jsonixFECoreSet) => {
        return JsonixUtils.toJsonixFECoreSetMemberArray(jsonixFECoreSet).map((jsonixMemberFe) => {
            var _frameElement = new FrameElement({
                fn_id: jsonixMemberFe.id
            });
            var frameElement = frameElementSet.get(_frameElement);
            if(frameElement !== undefined){
                return frameElement;
            }else{
                _frameElement.name = jsonixMemberFe.name;
                frameElementSet.add(_frameElement);
                return _frameElement;
            }
        });
    });
}

function getLexUnits(jsonixFrame, frame, lexemes, lexUnits, semTypeSet){
    return JsonixUtils.toJsonixLexUnitArray(jsonixFrame).map((jsonixLexUnit) => {
        var lexUnit = new LexUnit({
            fn_id: jsonixLexUnit.id,
            name: jsonixLexUnit.name,
            pos: jsonixLexUnit.pos,
            definition: jsonixLexUnit.definition,
            frame: frame.toObject(),
            status: jsonixLexUnit.status,
            totalAnnotated: jsonixLexUnit.sentenceCount.annotated,
            lemma_id: jsonixLexUnit.lemmaID,
            lexemes: getLexemes(jsonixLexUnit, lexemes),
            semTypes: getSemTypes(jsonixLexUnit, semTypeSet)
        });
        lexUnits.push(lexUnit.toObject({depopulate: true}));
        return lexUnit;
    });
}

function getLexemes(jsonixLexUnit, lexemes){
    return JsonixUtils.toJsonixLexemeArray(jsonixLexUnit).map((jsonixLexeme) => {
        var lexeme = new Lexeme({
            name: jsonixLexeme.name,
            pos: jsonixLexeme.pos,
            headword: jsonixLexeme.headword,
            order: jsonixLexeme.order,
            breakBefore: jsonixLexeme.breakBefore
        });
        lexemes.push(lexeme.toObject());
        return lexeme;
    });
}