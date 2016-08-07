'use strict';

class ValenceUnitUtils{
    // [A.B.C, D.E.F, G.H.I] --> [[A, B, C], [D, E, F], [G, H, I]]
    static toTokenArray(valenceArray) {
        var tokenArray = [];
        for (var i = 0; i < valenceArray.length; i++) {
            if (containsPeriod(valenceArray[i])) {
                var labelArray = [];
                var iterator = 0;
                for (var j = 0; j < valenceArray[i].length; j++) {
                    if (isPeriod(valenceArray[i].charAt(j))) {
                        if(iterator !== j){
                            labelArray.push(valenceArray[i].substring(iterator, j));
                        }
                        iterator = j + 1;
                    }
                }
                labelArray.push(valenceArray[i].substring(iterator, valenceArray[i].length));
                tokenArray.push(labelArray);
            } else {
                tokenArray.push([valenceArray[i]]);
            }
        }
        return tokenArray;
    };
}

function containsPeriod(string){
    return /\./.test(string);
}

function isPeriod(char){
    if(char.length > 1){
        throw new IllegalArgumentException('Method should be called on a single char, not a string.')
    }else{
        return /\./.test(char);
    }
}

module.exports = ValenceUnitUtils;