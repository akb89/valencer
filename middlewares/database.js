const mongoose = require('mongoose');
const nfc = require('noframenet-core');
const config = require('./../config');

const logger = config.logger;

mongoose.set('useCreateIndex', true);

function connect() {
  return async function aconnect(context, next) {
    const dbName = context.valencer.dbName;
    logger.info(`Using database ${dbName}`);
    const models = context.valencer.models;
    if (!(dbName in models)) {
      const db = mongoose.connection.useDb(dbName);
      models[dbName] = {
        AnnotationSet: db.model('AnnotationSet', nfc.AnnotationSet.schema),
        Corpus: db.model('Corpus', nfc.Corpus.schema),
        Document: db.model('Document', nfc.Document.schema),
        Frame: db.model('Frame', nfc.Frame.schema),
        FrameElement: db.model('FrameElement', nfc.FrameElement.schema),
        FERelation: db.model('FERelation', nfc.FERelation.schema),
        FEHierarchy: db.model('FEHierarchy', nfc.FEHierarchy.schema),
        FrameHierarchy: db.model('FrameHierarchy', nfc.FrameHierarchy.schema),
        FrameRelation: db.model('FrameRelation', nfc.FrameRelation.schema),
        FrameRelationType: db.model('FrameRelationType', nfc.FrameRelationType.schema),
        Label: db.model('Label', nfc.Label.schema),
        LexUnit: db.model('LexUnit', nfc.LexUnit.schema),
        Lexeme: db.model('Lexeme', nfc.Lexeme.schema),
        Pattern: db.model('Pattern', nfc.Pattern.schema),
        SemType: db.model('SemType', nfc.SemType.schema),
        Sentence: db.model('Sentence', nfc.Sentence.schema),
        ValenceUnit: db.model('ValenceUnit', nfc.ValenceUnit.schema),
      };
    }
    context.valencer.models = models[dbName];
    return next();
  };
}

function getDBlist() {
  return mongoose.connection.db.admin().listDatabases();
}
module.exports = {
  connect,
  getDBlist,
};
