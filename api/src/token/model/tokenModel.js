'use strict';

class Token {
    constructor(tokenType, tokenName, startPos, endPos){
        this.type = tokenType; // FE/PT/GF...
        this.name = tokenName; // Addresse.../NP.../Obj...
        this.startPos = startPos; // starting position
        this.endPos = endPos; // ending position
    }
}

module.exports = Token;