'use strict';

class Valencer {
    constructor(text, tokens){
        this.text = text; // the content of the annotated sentence
        this.tokens = tokens; // an array of labels (the annotation)
    }
}

module.exports = Valencer;