var LexUnitSchema_Module_Factory = function () {
  var LexUnitSchema = {
    name: 'LexUnitSchema',
    defaultElementNamespaceURI: 'http:\/\/framenet.icsi.berkeley.edu',
    typeInfos: [{
        localName: 'ValenceUnitType',
        typeName: 'valenceUnitType',
        propertyInfos: [{
            name: 'fe',
            required: true,
            attributeName: {
              localPart: 'FE'
            },
            type: 'attribute'
          }, {
            name: 'pt',
            required: true,
            attributeName: {
              localPart: 'PT'
            },
            type: 'attribute'
          }, {
            name: 'gf',
            required: true,
            attributeName: {
              localPart: 'GF'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'LabelType',
        typeName: 'labelType',
        propertyInfos: [{
            name: 'name',
            required: true,
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }, {
            name: 'start',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'start'
            },
            type: 'attribute'
          }, {
            name: 'end',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'end'
            },
            type: 'attribute'
          }, {
            name: 'fgColor',
            attributeName: {
              localPart: 'fgColor'
            },
            type: 'attribute'
          }, {
            name: 'bgColor',
            attributeName: {
              localPart: 'bgColor'
            },
            type: 'attribute'
          }, {
            name: 'itype',
            attributeName: {
              localPart: 'itype'
            },
            type: 'attribute'
          }, {
            name: 'feID',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'feID'
            },
            type: 'attribute'
          }, {
            name: 'cBy',
            attributeName: {
              localPart: 'cBy'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ValencesType',
        typeName: 'valencesType',
        propertyInfos: [{
            name: 'governor',
            minOccurs: 0,
            collection: true,
            typeInfo: '.GovernorType'
          }, {
            name: 'feRealization',
            minOccurs: 0,
            collection: true,
            elementName: 'FERealization',
            typeInfo: '.FERealizationType'
          }, {
            name: 'feGroupRealization',
            minOccurs: 0,
            collection: true,
            elementName: 'FEGroupRealization',
            typeInfo: '.FEGroupRealizationType'
          }]
      }, {
        localName: 'LexUnit',
        typeName: null,
        propertyInfos: [{
            name: 'header',
            required: true,
            typeInfo: '.HeaderType'
          }, {
            name: 'definition',
            required: true
          }, {
            name: 'lexeme',
            required: true,
            collection: true,
            typeInfo: '.LexemeType'
          }, {
            name: 'semType',
            minOccurs: 0,
            collection: true,
            typeInfo: '.SemTypeRefType'
          }, {
            name: 'valences',
            typeInfo: '.ValencesType'
          }, {
            name: 'subCorpus',
            minOccurs: 0,
            collection: true,
            typeInfo: '.SubCorpusType'
          }, {
            name: 'totalAnnotated',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'totalAnnotated'
            },
            type: 'attribute'
          }, {
            name: 'id',
            required: true,
            typeInfo: 'Int',
            attributeName: {
              localPart: 'ID'
            },
            type: 'attribute'
          }, {
            name: 'name',
            required: true,
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }, {
            name: 'pos',
            required: true,
            attributeName: {
              localPart: 'POS'
            },
            type: 'attribute'
          }, {
            name: 'incorporatedFE',
            attributeName: {
              localPart: 'incorporatedFE'
            },
            type: 'attribute'
          }, {
            name: 'status',
            attributeName: {
              localPart: 'status'
            },
            type: 'attribute'
          }, {
            name: 'frameID',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'frameID'
            },
            type: 'attribute'
          }, {
            name: 'frame',
            attributeName: {
              localPart: 'frame'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'FERealizationType',
        propertyInfos: [{
            name: 'fe',
            required: true,
            elementName: 'FE',
            typeInfo: '.FEValenceType'
          }, {
            name: 'pattern',
            required: true,
            collection: true,
            typeInfo: '.FERealizationType.Pattern'
          }, {
            name: 'total',
            required: true,
            typeInfo: 'Int',
            attributeName: {
              localPart: 'total'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'HeaderType.Frame.FE',
        typeName: null,
        propertyInfos: [{
            name: 'name',
            required: true,
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }, {
            name: 'abbrev',
            attributeName: {
              localPart: 'abbrev'
            },
            type: 'attribute'
          }, {
            name: 'type',
            required: true,
            attributeName: {
              localPart: 'type'
            },
            type: 'attribute'
          }, {
            name: 'bgColor',
            required: true,
            attributeName: {
              localPart: 'bgColor'
            },
            type: 'attribute'
          }, {
            name: 'fgColor',
            required: true,
            attributeName: {
              localPart: 'fgColor'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'HeaderType',
        typeName: 'headerType',
        propertyInfos: [{
            name: 'corpus',
            minOccurs: 0,
            collection: true,
            typeInfo: '.CorpDocType'
          }, {
            name: 'frame',
            typeInfo: '.HeaderType.Frame'
          }]
      }, {
        localName: 'SemTypeRefType',
        typeName: 'semTypeRefType',
        propertyInfos: [{
            name: 'id',
            required: true,
            typeInfo: 'Int',
            attributeName: {
              localPart: 'ID'
            },
            type: 'attribute'
          }, {
            name: 'name',
            required: true,
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'AnnoSetType',
        typeName: 'annoSetType',
        propertyInfos: [{
            name: 'id',
            required: true,
            typeInfo: 'Int',
            attributeName: {
              localPart: 'ID'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'HeaderType.Frame',
        typeName: null,
        propertyInfos: [{
            name: 'fe',
            required: true,
            collection: true,
            elementName: 'FE',
            typeInfo: '.HeaderType.Frame.FE'
          }]
      }, {
        localName: 'GovernorType',
        typeName: 'governorType',
        propertyInfos: [{
            name: 'annoSet',
            required: true,
            collection: true,
            typeInfo: '.AnnoSetType'
          }, {
            name: 'lemma',
            required: true,
            attributeName: {
              localPart: 'lemma'
            },
            type: 'attribute'
          }, {
            name: 'type',
            required: true,
            attributeName: {
              localPart: 'type'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'SentenceType',
        typeName: 'sentenceType',
        propertyInfos: [{
            name: 'text',
            required: true
          }, {
            name: 'annotationSet',
            minOccurs: 0,
            collection: true,
            typeInfo: '.AnnotationSetType'
          }, {
            name: 'id',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'ID'
            },
            type: 'attribute'
          }, {
            name: 'aPos',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'aPos'
            },
            type: 'attribute'
          }, {
            name: 'paragNo',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'paragNo'
            },
            type: 'attribute'
          }, {
            name: 'sentNo',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'sentNo'
            },
            type: 'attribute'
          }, {
            name: 'docID',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'docID'
            },
            type: 'attribute'
          }, {
            name: 'corpID',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'corpID'
            },
            type: 'attribute'
          }, {
            name: 'externalID',
            attributeName: {
              localPart: 'externalID'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'FEGroupRealizationType',
        propertyInfos: [{
            name: 'fe',
            required: true,
            collection: true,
            elementName: 'FE',
            typeInfo: '.FEValenceType'
          }, {
            name: 'pattern',
            required: true,
            collection: true,
            typeInfo: '.FEGroupRealizationType.Pattern'
          }, {
            name: 'total',
            required: true,
            typeInfo: 'Int',
            attributeName: {
              localPart: 'total'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'CorpDocType.Document',
        typeName: null,
        propertyInfos: [{
            name: 'id',
            required: true,
            typeInfo: 'Int',
            attributeName: {
              localPart: 'ID'
            },
            type: 'attribute'
          }, {
            name: 'name',
            required: true,
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }, {
            name: 'description',
            required: true,
            attributeName: {
              localPart: 'description'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'FEGroupRealizationType.Pattern',
        typeName: null,
        propertyInfos: [{
            name: 'valenceUnit',
            required: true,
            collection: true,
            typeInfo: '.ValenceUnitType'
          }, {
            name: 'annoSet',
            required: true,
            collection: true,
            typeInfo: '.AnnoSetType'
          }, {
            name: 'total',
            required: true,
            typeInfo: 'Int',
            attributeName: {
              localPart: 'total'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'CorpDocType',
        typeName: 'corpDocType',
        propertyInfos: [{
            name: 'document',
            minOccurs: 0,
            collection: true,
            typeInfo: '.CorpDocType.Document'
          }, {
            name: 'id',
            required: true,
            typeInfo: 'Int',
            attributeName: {
              localPart: 'ID'
            },
            type: 'attribute'
          }, {
            name: 'name',
            required: true,
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }, {
            name: 'description',
            required: true,
            attributeName: {
              localPart: 'description'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'FEValenceType',
        propertyInfos: [{
            name: 'name',
            required: true,
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'LexemeType',
        typeName: 'lexemeType',
        propertyInfos: [{
            name: 'name',
            required: true,
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }, {
            name: 'pos',
            required: true,
            attributeName: {
              localPart: 'POS'
            },
            type: 'attribute'
          }, {
            name: 'breakBefore',
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'breakBefore'
            },
            type: 'attribute'
          }, {
            name: 'headword',
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'headword'
            },
            type: 'attribute'
          }, {
            name: 'order',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'order'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'FERealizationType.Pattern',
        typeName: null,
        propertyInfos: [{
            name: 'valenceUnit',
            required: true,
            typeInfo: '.ValenceUnitType'
          }, {
            name: 'annoSet',
            required: true,
            collection: true,
            typeInfo: '.AnnoSetType'
          }, {
            name: 'total',
            required: true,
            typeInfo: 'Int',
            attributeName: {
              localPart: 'total'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'AnnotationSetType',
        typeName: 'annotationSetType',
        propertyInfos: [{
            name: 'layer',
            required: true,
            collection: true,
            typeInfo: '.LayerType'
          }, {
            name: 'id',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'ID'
            },
            type: 'attribute'
          }, {
            name: 'status',
            attributeName: {
              localPart: 'status'
            },
            type: 'attribute'
          }, {
            name: 'frameName',
            attributeName: {
              localPart: 'frameName'
            },
            type: 'attribute'
          }, {
            name: 'frameID',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'frameID'
            },
            type: 'attribute'
          }, {
            name: 'luName',
            attributeName: {
              localPart: 'luName'
            },
            type: 'attribute'
          }, {
            name: 'luID',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'luID'
            },
            type: 'attribute'
          }, {
            name: 'cxnName',
            attributeName: {
              localPart: 'cxnName'
            },
            type: 'attribute'
          }, {
            name: 'cxnID',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'cxnID'
            },
            type: 'attribute'
          }, {
            name: 'cDate',
            attributeName: {
              localPart: 'cDate'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'SubCorpusType',
        typeName: 'subCorpusType',
        propertyInfos: [{
            name: 'sentence',
            minOccurs: 0,
            collection: true,
            typeInfo: '.SentenceType'
          }, {
            name: 'name',
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'LayerType',
        typeName: 'layerType',
        propertyInfos: [{
            name: 'label',
            minOccurs: 0,
            collection: true,
            typeInfo: '.LabelType'
          }, {
            name: 'name',
            required: true,
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }, {
            name: 'rank',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'rank'
            },
            type: 'attribute'
          }]
      }, {
        type: 'enumInfo',
        localName: 'POSType',
        values: ['N', 'V', 'A', 'ADV', 'PRON', 'PREP', 'NUM', 'C', 'INTJ', 'ART', 'SCON', 'CCON', 'AVP']
      }, {
        type: 'enumInfo',
        localName: 'CoreType',
        values: ['Core', 'Peripheral', 'Extra-Thematic', 'Core-Unexpressed']
      }],
    elementInfos: [{
        elementName: 'lexUnit',
        typeInfo: '.LexUnit'
      }]
  };
  return {
    LexUnitSchema: LexUnitSchema
  };
};
if (typeof define === 'function' && define.amd) {
  define([], LexUnitSchema_Module_Factory);
}
else {
  var LexUnitSchema_Module = LexUnitSchema_Module_Factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports.LexUnitSchema = LexUnitSchema_Module.LexUnitSchema;
  }
  else {
    var LexUnitSchema = LexUnitSchema_Module.LexUnitSchema;
  }
}