const mongoose = require('mongoose');
const config = require('./../config');
const nfc = require('noframenet-core');

const logger = config.logger;

function connect(models) {
  return async function aconnect(context, next) {
    const urlSplit = context.request.url.split('/');
    const lang = urlSplit[2];
    const dataset = urlSplit[3];
    const dbName = config.databases.names[lang][dataset];
    logger.info(`Using database ${dbName}`);
    if (!(dbName in models)) {
      const db = mongoose.connection.useDb(dbName);
      models[dbName] = {
        AnnotationSet: db.model('AnnotationSet', nfc.AnnotationSet.schema),
        Corpus: db.model('Corpus', nfc.Corpus.schema),
        Document: db.model('Document', nfc.Document.schema),
        Frame: db.model('Frame', nfc.Frame.schema),
        FrameElement: db.model('FrameElement', nfc.FrameElement.schema),
        FERelation: db.model('FERelation', nfc.FERelation.schema),
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
