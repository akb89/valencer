'use strict';

const logger = require('./../../logger');

class PatternUtils{
    // A.B.C D.E.F G.H.I --> [A.B.C, D.E.F, G.H.I]
    static toValenceArray(string){
        string = string.trim();
        if(containsWhiteSpace(string)){
            var array = [];
            var iterator = 0;
            for(var i = 0; i < string.length; i++){
                if(isWhiteSpace(string.charAt(i))){
                    if(iterator !== i){
                        array.push(string.substring(iterator, i));
                    }
                    iterator = i+1;
                }
            }
            array.push(string.substring(iterator, string.length));
            return array;
        }else{
            return [string];
        }
    };
}

function containsWhiteSpace(string){
    return /\s/.test(string);
}

function isWhiteSpace(char){
    if(char.length > 1){
        throw new IllegalArgumentException('Method should be called on a single char, not a string.')
    }else{
        return /\s/.test(char);
    }
}

module.exports = PatternUtils;