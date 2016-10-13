'use strict';

// [A.B.C, D.E.F, G.H.I] --> [[A, B, C], [D, E, F], [G, H, I]]
function toTokenArray(valenceArray) {
    var tokenArray = [];
    for(let i = 0; i < valenceArray.length; i++) {
        if(_containsPeriod(valenceArray[i])) {
            var labelArray = [];
            var iterator = 0;
            for(let j = 0; j < valenceArray[i].length; j++) {
                if(_isPeriod(valenceArray[i].charAt(j))) {
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
}

function _containsPeriod(string){
    return /\./.test(string);
}

function _isPeriod(char){
    if(char.length === 1){
        return /\./.test(char);
    }
}

export default {
    toTokenArray
};