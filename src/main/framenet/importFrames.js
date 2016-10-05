/**
 * Standalone script to import FrameNet frames data to MongoDB.
 */

'use strict';

import path from 'path';
import jsonix from 'jsonix';
import preProcessor from './preProcessor';
import frameSchema from './../mapping/FrameSchema.js';
import Frame from './../model/frameModel';
import FrameElement from './../model/frameElementModel';
import FrameRelation from './../model/frameRelationModel';
import FERelation from './../model/frameElementRelationModel';
import Lexeme from './../model/lexemeModel';
import LexUnit from './../model/lexUnitModel';
import SemType from './../model/semTypeModel';
import jsonixUtils from './utils/jsonixUtils';
import Promise from 'bluebird';
import config from '../config';
import {FrameSet, FrameElementSet, SemTypeSet} from './utils/fnUtils';
import './utils/utils';

const Jsonix = jsonix.Jsonix;
const FrameSchema = frameSchema.FrameSchema;
const context = new Jsonix.Context([FrameSchema]);
const unmarshaller = context.createUnmarshaller();
const logger = config.logger;
const startTime = process.hrtime();

if(require.main === module){
    importFrames(config.frameDir, config.dbUri, config.frameChunkSize);
    logger.info(`Import process completed in ${process.hrtime(startTime)[0]}s`)
}

// TODO add error and exit on invalid directory
async function importFrames(frameDir, dbUri, chunkSize) {
    var batchSet = await preProcessor.getFilteredArrayOfFiles(frameDir, chunkSize);
    var db = await preProcessor.connectToDatabase(dbUri);
    var frameSet = new FrameSet();
    var frameElementSet = new FrameElementSet();
    var semTypeSet = new SemTypeSet();
    var counter = {
        batch: 1,
        feRelation: 0,
        frameRelation: 0,
        lexeme: 0,
        lexUnit: 0
    };
    for (let batch of batchSet) {
        var feRelations = [];
        var frameRelations = [];
        var lexemes = [];
        var lexUnits = [];
        logger.info(`Importing frame batch ${counter.batch} out of ${batchSet.length}...`);
        counter.batch++;
        await importAll(
            batch,
            db,
            frameDir,
            frameSet,
            frameElementSet,
            feRelations,
            frameRelations,
            lexemes,
            lexUnits,
            semTypeSet,
            counter
        );
    }
    await saveSetToDb(db, frameSet, frameElementSet, semTypeSet);
    logOutputStats(frameSet, frameElementSet, semTypeSet, counter);
}

async function saveSetToDb(db, frameSet, frameElementSet, semTypeSet) {
    await db.collection('frames').insertMany(frameSet.map((frame) => {
            return frame.toObject({depopulate: true})
        }),
        {writeConcern: 0, j: false, ordered: false});
    await db.collection('frameelements').insertMany(frameElementSet.map((frameElement) => {
            return frameElement.toObject()
        }),
        {writeConcern: 0, j: false, ordered: false});
    await db.collection('semtypes').insertMany(semTypeSet.map((semType) => {
        return semType.toObject()
    }), {
        writeConcern: 0,
        j: false, ordered: false
    });
}

function logOutputStats(frameSet, frameElementSet, semTypeSet, counter) {
    logger.info('Import completed');
    logger.info('Total inserted to MongoDB: ');
    logger.info(`Frames = ${frameSet.length}`);
    logger.info(`FrameElements = ${frameElementSet.length}`);
    logger.info(`FERelations = ${counter.feRelation}`);
    logger.info(`FrameRelations = ${counter.frameRelation}`);
    logger.info(`Lexemes = ${counter.lexeme}`);
    logger.info(`LexUnits = ${counter.lexUnit}`);
    logger.info(`SemTypes = ${semTypeSet.length}`);
}

async function importAll(files, db, frameDir, frameSet, frameElementSet, feRelations, frameRelations, lexemes, lexUnits,
                         semTypeSet, counter) {

    await Promise.all(files.map((file) =>
        initFile(file, frameDir, frameSet, frameElementSet, feRelations, frameRelations, lexemes, lexUnits, semTypeSet)
    )); //FIXME weird bug here: curly brackets break the code...

    counter.feRelation += feRelations.length;
    counter.frameRelation += frameRelations.length;
    counter.lexeme += lexemes.length;
    counter.lexUnit += lexUnits.length;

    await saveArraysToDb(db, feRelations, frameRelations, lexemes, lexUnits);
}

async function saveArraysToDb(db, feRelations, frameRelations, lexemes, lexUnits) {
    await db.collection('ferelations').insertMany(feRelations, {w: 0, j: false, ordered: false});
    await db.collection('framerelations').insertMany(frameRelations, {w: 0, j: false, ordered: false});
    await db.collection('lexemes').insertMany(lexemes, {w: 0, j: false, ordered: false});
    await db.collection('lexunits').insertMany(lexUnits, {w: 0, j: false, ordered: false});
}

function initFile(file, frameDir, frameSet, frameElementSet, feRelations, frameRelations, lexemes, lexUnits,
                  semTypeSet) {
    return new Promise((resolve, reject) => {
        try {
            unmarshaller.unmarshalFile(path.join(frameDir, file), (unmarshalledFile) => {
                return resolve(
                    initFrame(unmarshalledFile, frameSet, frameElementSet, feRelations, frameRelations, lexemes,
                        lexUnits, semTypeSet));
            });
        } catch (err) {
            return reject(err);
        }
    });
}

function initFrame(jsonixFrame, frameSet, frameElementSet, feRelations, frameRelations, lexemes, lexUnits, semTypeSet) {
    logger.info(`Processing frame with id = ${jsonixFrame.value.id} and name = ${jsonixFrame.value.name}`);
    var _frame = new Frame();
    _frame._id = jsonixFrame.value.id.toString();
    console.log(_frame._id);
    var frame = frameSet.get(_frame);
    if (frame !== undefined) { // This is only possible if the frame was already created via a frame relation. The
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
    } else {
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

function getFrameElements(jsonixFrame, frameElementSet, feRelations, semTypeSet) {
    return jsonixUtils.toJsonixFrameElementArray(jsonixFrame).map((jsonixFrameElement) => {
        logger.debug(
            `Processing frame element with id = ${jsonixFrameElement.id} and name = ${jsonixFrameElement.name}`);
        var _frameElement = new FrameElement({
            _id: jsonixFrameElement.id
        });
        var frameElement = frameElementSet.get(_frameElement);
        if (frameElement !== undefined && frameElement.coreType !== undefined) {
            return frameElement;
        } else if (frameElement !== undefined) {
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
        else {
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

function getFERelations(jsonixFrameElement, frameElementSet, feRelations) {
    return config.feRelations.map((feRelation) => {
        if (jsonixFrameElement.hasOwnProperty(feRelation.tag)) {
            var _feRelation = new FERelation({
                type: feRelation.name,
                frameElements: []
            });
            var feRelationIterator = 0;
            while (jsonixFrameElement[feRelation.tag][feRelationIterator] !== undefined) {
                var _frameElement = new FrameElement({
                    _id: jsonixFrameElement[feRelation.tag][feRelationIterator].id
                });
                var frameElement = frameElementSet.get(_frameElement);
                if (frameElement !== undefined) {
                    _feRelation.frameElements.push(frameElement);
                } else {
                    _frameElement.name = jsonixFrameElement[feRelation.tag][feRelationIterator].name;
                    frameElementSet.add(_frameElement);
                    _feRelation.frameElements.push(_frameElement);
                }
                feRelationIterator++;
            }
            feRelations.push(_feRelation.toObject({depopulate: true}));
            return _feRelation.toObject({depopulate: true}); // bug in Mongoose?
        }
    }).filter(isNotUndefined);
}

/**
 *
 * @param jsonixElement can be either a jsonixFrame, a jsonixFrameElement or a jsonixLexUnit
 * @param semTypeSet
 * @returns {Array}
 */
function getSemTypes(jsonixElement, semTypeSet) {
    return jsonixUtils.toJsonixSemTypeArray(jsonixElement).map((jsonixSemType) => {
        var _semType = new SemType({
            _id: jsonixSemType.id
        });
        var semType = semTypeSet.get(_semType);
        if (semType !== undefined) {
            return semType;
        } else {
            _semType.name = jsonixSemType.name;
            semTypeSet.add(_semType);
            return _semType;
        }
    });
}

function getFrameRelations(jsonixFrame, frameSet, frameRelations) {
    return jsonixUtils.toJsonixFrameRelationArray(jsonixFrame).map((jsonixFrameRelation) => {
        if (jsonixFrameRelation.hasOwnProperty('relatedFrame')) {
            var frameRelation = new FrameRelation({
                type: jsonixFrameRelation.type,
                frames: []
            });
            var relatedFrameIterator = 0;
            while (jsonixFrameRelation.relatedFrame[relatedFrameIterator] !== undefined) {
                var _frame = new Frame({
                    _id: jsonixFrameRelation.relatedFrame[relatedFrameIterator].id
                });
                var frame = frameSet.get(_frame);
                if (frame !== undefined) {
                    frameRelation.frames.push(frame);
                } else {
                    frameSet.add(_frame);
                    frameRelation.frames.push(_frame);
                }
                relatedFrameIterator++;
            }
            frameRelations.push(frameRelation.toObject({depopulate: true}));
            return frameRelation.toObject({depopulate: true}); // bug in Mongoose?
        }
    }).filter(isNotUndefined);
}

function isNotUndefined(value) {
    return value !== undefined;
}

function getFECoreSets(jsonixFrame, frameElementSet) {
    return jsonixUtils.toJsonixFECoreSetArray(jsonixFrame).map((jsonixFECoreSet) => {
        return jsonixUtils.toJsonixFECoreSetMemberArray(jsonixFECoreSet).map((jsonixMemberFe) => {
            var _frameElement = new FrameElement({
                _id: jsonixMemberFe.id
            });
            var frameElement = frameElementSet.get(_frameElement);
            if (frameElement !== undefined) {
                return frameElement;
            } else {
                _frameElement.name = jsonixMemberFe.name;
                frameElementSet.add(_frameElement);
                return _frameElement;
            }
        });
    });
}

function getLexUnits(jsonixFrame, frame, lexemes, lexUnits, semTypeSet) {
    return jsonixUtils.toJsonixLexUnitArray(jsonixFrame).map((jsonixLexUnit) => {
        var lexUnit = new LexUnit({
            _id: jsonixLexUnit.id,
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

function getLexemes(jsonixLexUnit, lexemes) {
    return jsonixUtils.toJsonixLexemeArray(jsonixLexUnit).map((jsonixLexeme) => {
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
