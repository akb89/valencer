var FrameSchema_Module_Factory = function () {
  var FrameSchema = {
    name: 'FrameSchema',
    defaultElementNamespaceURI: 'http:\/\/framenet.icsi.berkeley.edu',
    typeInfos: [{
        localName: 'RelatedFramesType',
        typeName: 'relatedFramesType',
        propertyInfos: [{
            name: 'relatedFrame',
            minOccurs: 0,
            collection: true,
            typeInfo: '.FrameIDNameType'
          }, {
            name: 'type',
            required: true,
            attributeName: {
              localPart: 'type'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Frame',
        typeName: null,
        propertyInfos: [{
            name: 'definition',
            required: true
          }, {
            name: 'semType',
            minOccurs: 0,
            collection: true,
            typeInfo: '.SemTypeRefType'
          }, {
            name: 'fe',
            required: true,
            collection: true,
            elementName: 'FE',
            typeInfo: '.FEType'
          }, {
            name: 'fEcoreSet',
            minOccurs: 0,
            collection: true,
            elementName: 'FEcoreSet',
            typeInfo: '.Frame.FEcoreSet'
          }, {
            name: 'frameRelation',
            required: true,
            collection: true,
            typeInfo: '.RelatedFramesType'
          }, {
            name: 'lexUnit',
            minOccurs: 0,
            collection: true,
            typeInfo: '.FrameLUType'
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
            name: 'cDate',
            required: true,
            attributeName: {
              localPart: 'cDate'
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
        localName: 'FEType',
        propertyInfos: [{
            name: 'definition',
            required: true
          }, {
            name: 'semType',
            minOccurs: 0,
            collection: true,
            typeInfo: '.SemTypeRefType'
          }, {
            name: 'requiresFE',
            minOccurs: 0,
            collection: true,
            typeInfo: '.InternalFrameRelationFEType'
          }, {
            name: 'excludesFE',
            minOccurs: 0,
            collection: true,
            typeInfo: '.InternalFrameRelationFEType'
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
            name: 'abbrev',
            required: true,
            attributeName: {
              localPart: 'abbrev'
            },
            type: 'attribute'
          }, {
            name: 'cDate',
            required: true,
            attributeName: {
              localPart: 'cDate'
            },
            type: 'attribute'
          }, {
            name: 'cBy',
            required: true,
            attributeName: {
              localPart: 'cBy'
            },
            type: 'attribute'
          }, {
            name: 'coreType',
            required: true,
            attributeName: {
              localPart: 'coreType'
            },
            type: 'attribute'
          }, {
            name: 'fgColor',
            required: true,
            attributeName: {
              localPart: 'fgColor'
            },
            type: 'attribute'
          }, {
            name: 'bgColor',
            required: true,
            attributeName: {
              localPart: 'bgColor'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Frame.FEcoreSet',
        typeName: null,
        propertyInfos: [{
            name: 'memberFE',
            required: true,
            minOccurs: 2,
            collection: true,
            typeInfo: '.InternalFrameRelationFEType'
          }]
      }, {
        localName: 'FrameIDNameType',
        typeName: 'frameIDNameType',
        propertyInfos: [{
            name: 'value',
            type: 'value'
          }, {
            name: 'id',
            required: true,
            typeInfo: 'Int',
            attributeName: {
              localPart: 'ID'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'FrameLUType',
        typeName: 'frameLUType',
        propertyInfos: [{
            name: 'definition',
            required: true
          }, {
            name: 'sentenceCount',
            required: true,
            typeInfo: '.FrameLUType.SentenceCount'
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
            name: 'cDate',
            required: true,
            attributeName: {
              localPart: 'cDate'
            },
            type: 'attribute'
          }, {
            name: 'cBy',
            required: true,
            attributeName: {
              localPart: 'cBy'
            },
            type: 'attribute'
          }, {
            name: 'lemmaID',
            required: true,
            typeInfo: 'Int',
            attributeName: {
              localPart: 'lemmaID'
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
          }]
      }, {
        localName: 'FrameLUType.SentenceCount',
        typeName: null,
        propertyInfos: [{
            name: 'total',
            required: true,
            typeInfo: 'Int',
            attributeName: {
              localPart: 'total'
            },
            type: 'attribute'
          }, {
            name: 'annotated',
            required: true,
            typeInfo: 'Int',
            attributeName: {
              localPart: 'annotated'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'InternalFrameRelationFEType',
        typeName: 'internalFrameRelationFEType',
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
        type: 'enumInfo',
        localName: 'CoreType',
        values: ['Core', 'Peripheral', 'Extra-Thematic', 'Core-Unexpressed']
      }, {
        type: 'enumInfo',
        localName: 'POSType',
        values: ['N', 'V', 'A', 'ADV', 'PRON', 'PREP', 'NUM', 'C', 'INTJ', 'ART', 'SCON', 'CCON', 'AVP']
      }],
    elementInfos: [{
        elementName: 'frame',
        typeInfo: '.Frame'
      }]
  };
  return {
    FrameSchema: FrameSchema
  };
};
if (typeof define === 'function' && define.amd) {
  define([], FrameSchema_Module_Factory);
}
else {
  var FrameSchema_Module = FrameSchema_Module_Factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports.FrameSchema = FrameSchema_Module.FrameSchema;
  }
  else {
    var FrameSchema = FrameSchema_Module.FrameSchema;
  }
}