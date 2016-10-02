'use strict';

class JsonixUtils{

    static isValidXml(file){
        return file.endsWith('.xml');
    }

    /**
     * Extract all sentence elements from a Jsonix unmarshalled <lexUnit>
     * @param jsonixLexUnit
     * @returns {Array}
     */
    static toJsonixSentenceArray(jsonixLexUnit) {
        var sentences = [];
        var subCorpusIterator = 0;
        if(jsonixLexUnit.value.hasOwnProperty('subCorpus')) {
            while(jsonixLexUnit.value.subCorpus[subCorpusIterator] !== undefined) {
                var subCorpus = jsonixLexUnit.value.subCorpus[subCorpusIterator];
                var sentenceIterator = 0;
                if(subCorpus.hasOwnProperty('sentence')) {
                    while(subCorpus.sentence[sentenceIterator] !== undefined) {
                        var sentence = subCorpus.sentence[sentenceIterator];
                        sentences.push(sentence);
                        sentenceIterator++;
                    }
                }
                subCorpusIterator++;
            }
        }
        return sentences;
    }

    /**
     * Extract all annotationSet elements from a Jsonix unmarshalled <pattern>
     * @param jsonixPattern
     * @returns {Array}
     */
    static toJsonixAnnoSetArray(jsonixPattern) {
        var annotationSets = [];
        var annotationSetIterator = 0;
        if(jsonixPattern.hasOwnProperty('annoSet')) {
            while(jsonixPattern.annoSet[annotationSetIterator] !== undefined) {
                annotationSets.push(jsonixPattern.annoSet[annotationSetIterator]);
                annotationSetIterator++;
            }
        }
        return annotationSets;
    }

    /**
     * Extract all annotationSet elements from a Jsonix unmarshalled <sentence>
     * @param jsonixSentence
     * @returns {Array}
     */
    static toJsonixAnnotationSetArray(jsonixSentence) {
        var annotationSets = [];
        var annoSetIterator = 0;
        if (jsonixSentence.hasOwnProperty('annotationSet')) {
            while (jsonixSentence.annotationSet[annoSetIterator] !== undefined) {
                annotationSets.push(jsonixSentence.annotationSet[annoSetIterator]);
                annoSetIterator++;
            }
        }
        return annotationSets;
    }

    /**
     * Extract all FEcoreSet elements from a Jsonix unmarshalled <frame>
     * @param jsonixFrame
     * @returns {Array}
     */
    static toJsonixFECoreSetArray(jsonixFrame){
        var feCoreSets = [];
        var feCoreSetIterator = 0;
        if(jsonixFrame.value.hasOwnProperty('fEcoreSet')){
            while(jsonixFrame.value.fEcoreSet[feCoreSetIterator] !== undefined){
                feCoreSets.push(jsonixFrame.value.fEcoreSet[feCoreSetIterator]);
                feCoreSetIterator++;
            }
        }
        return feCoreSets;
    }

    /**
     * Extract all memberFE elements from a Jsonix unmarshalled <FEcoreSet>
     * @param jsonixFECoreSet
     * @returns {Array}
     */
    static toJsonixFECoreSetMemberArray(jsonixFECoreSet){
        var members = [];
        var memberIterator = 0;
        if(jsonixFECoreSet.hasOwnProperty('memberFE')){
            while(jsonixFECoreSet.memberFE[memberIterator] !== undefined){
                members.push(jsonixFECoreSet.memberFE[memberIterator]);
                memberIterator++;
            }
        }
        return members;
    }

    /**
     * Extract all frameElement elements from a Jsonix unmarshalled <frame>
     * @param jsonixFrame
     * @returns {Array}
     */
    static toJsonixFrameElementArray(jsonixFrame){
        var frameElements = [];
        var frameElementIterator = 0;
        if (jsonixFrame.value.hasOwnProperty('fe')) {
            while (jsonixFrame.value.fe[frameElementIterator] !== undefined) {
                frameElements.push(jsonixFrame.value.fe[frameElementIterator]);
                frameElementIterator++;
            }
        }
        return frameElements;
    }

    /**
     * Extract all frameRelation elements from a Jsonix unmarshalled <frame>
     * @param jsonixFrame
     * @returns {Array}
     */
    static toJsonixFrameRelationArray(jsonixFrame){
        var frameRelations = [];
        var frameRelationIterator = 0;
        if(jsonixFrame.value.hasOwnProperty('frameRelation')){
            while(jsonixFrame.value.frameRelation[frameRelationIterator] !== undefined){
                frameRelations.push(jsonixFrame.value.frameRelation[frameRelationIterator]);
                frameRelationIterator++;
            }
        }
        return frameRelations;
    }

    /**
     * Extract all layer elements from a Jsonix unmarshalled <annotationSet>
     * @param jsonixAnnotationSet
     * @returns {Array}
     */
    static toJsonixLayerArray(jsonixAnnotationSet) {
        var layers = [];
        var layerIterator = 0;
        if (jsonixAnnotationSet.hasOwnProperty('layer')) {
            while (jsonixAnnotationSet.layer[layerIterator] !== undefined) {
                layers.push(jsonixAnnotationSet.layer[layerIterator]);
                layerIterator++;
            }
        }
        return layers;
    }

    /**
     * Extract all label elements from a Jsonix unmarshalled <layer>
     * @param jsonixLayer
     * @returns {Array}
     */
    static toJsonixLabelArray(jsonixLayer) {
        var labels = [];
        var labelIterator = 0;
        if (jsonixLayer.hasOwnProperty('label')) {
            while (jsonixLayer.label[labelIterator] !== undefined) {
                labels.push(jsonixLayer.label[labelIterator]);
                labelIterator++;
            }
        }
        return labels;
    }

    /**
     * Extract all lexeme elements from a Jsonix unmarshalled <lexUnit>
     * @param jsonixLexUnit
     * @returns {Array}
     */
    static toJsonixLexemeArray(jsonixLexUnit){
        var lexemes = [];
        var lexemeIterator = 0;
        if(jsonixLexUnit.hasOwnProperty('lexeme')){
            while(jsonixLexUnit.lexeme[lexemeIterator] !== undefined){
                lexemes.push(jsonixLexUnit.lexeme[lexemeIterator]);
                lexemeIterator++;
            }
        }
        return lexemes;
    }

    /**
     * Extract all lexUnit elements from a Jsonix unmarshalled <frame>
     * @param jsonixFrame
     * @returns {Array}
     */
    static toJsonixLexUnitArray(jsonixFrame){
        var lexUnits = [];
        var lexUnitIterator = 0;
        if(jsonixFrame.value.hasOwnProperty('lexUnit')){
            while(jsonixFrame.value.lexUnit[lexUnitIterator] !== undefined){
                lexUnits.push(jsonixFrame.value.lexUnit[lexUnitIterator]);
                lexUnitIterator++;
            }
        }
        return lexUnits;
    }

    /**
     * Extract all pattern elements from a Jsonix unmarshalled <lexUnit>
     * @param jsonixLexUnit
     * @returns {Array}
     */
    static toJsonixPatternArray(jsonixLexUnit) {
        var patterns = [];
        if (jsonixLexUnit.value.hasOwnProperty('valences')) {
            var valences = jsonixLexUnit.value.valences;
            if (valences.hasOwnProperty(('feGroupRealization'))) {
                var feGroupRealizationIterator = 0;
                while (valences.feGroupRealization[feGroupRealizationIterator] !== undefined) {
                    var feGRealization = valences.feGroupRealization[feGroupRealizationIterator];
                    if (feGRealization.hasOwnProperty('pattern')) {
                        var patternIterator = 0;
                        while (feGRealization.pattern[patternIterator] !== undefined) {
                            patterns.push(feGRealization.pattern[patternIterator]);
                            patternIterator++;
                        }
                    }
                    feGroupRealizationIterator++;
                }
            }
        }
        return patterns;
    }

    /**
     * Extract all semType elements from a Jsonix unmarshalled <frame> or <fe> or <lexUnit>
     * @param jsonixElement can be either a jsonixFrame, a jsonixFrameElement or a jsonixLexUnit
     * @returns {Array}
     */
    static toJsonixSemTypeArray(jsonixElement){
        var semTypes = [];
        var semTypeIterator = 0;
        if(jsonixElement.value !== undefined && jsonixElement.value.hasOwnProperty('semType')){
            while(jsonixElement.value.semType[semTypeIterator] !== undefined){
                semTypes.push(jsonixElement.value.semType[semTypeIterator]);
                semTypeIterator++;
            }
        }else if (jsonixElement.hasOwnProperty('semType')){
            while(jsonixElement.semType[semTypeIterator] !== undefined){
                semTypes.push(jsonixElement.semType[semTypeIterator]);
                semTypeIterator++;
            }
        }
        return semTypes;
    }

    /**
     * Extract all valence (unit) elements from a Jsonix unmarshalled <pattern>
     * @param jsonixPattern
     * @returns {Array}
     */
    static toJsonixValenceUnitArray(jsonixPattern) {
        var valenceUnits = [];
        var valenceUnitsIterator = 0;
        if (jsonixPattern.hasOwnProperty('valenceUnit')) {
            while (jsonixPattern.valenceUnit[valenceUnitsIterator] !== undefined) {
                valenceUnits.push(jsonixPattern.valenceUnit[valenceUnitsIterator]);
                valenceUnitsIterator++;
            }
        }
        return valenceUnits;
    }
}

module.exports = JsonixUtils;