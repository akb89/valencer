'use strict';

class JsonixUtils{

    static isValidXml(file){
        return file.endsWith('.xml');
    }

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

    static toJsonixAnnotationSetArray(jsonixSentence) {
        var annotationSets = [];
        var annoSetIterator = 0;
        if (jsonixSentence.hasOwnProperty('annotationSet')) {
            while (jsonixSentence.annotationSet[annoSetIterator] !== undefined) {
                let annotationSet = jsonixSentence.annotationSet[annoSetIterator];
                annotationSets.push(annotationSet);
                annoSetIterator++;
            }
        }
        return annotationSets;
    }

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

    static toJsonixLabelArray(jsonixLayer) {
        var _labels = [];
        var labelIterator = 0;
        if (jsonixLayer.hasOwnProperty('label')) {
            while (jsonixLayer.label[labelIterator] !== undefined) {
                var _label = jsonixLayer.label[labelIterator];
                _labels.push(_label);
                labelIterator++;
            }
        }
        return _labels;
    }

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