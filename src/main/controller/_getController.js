'use strict';

const Valencer = require('../model/valencer');
const dbController = require('./dbController');
const FrameNet = require('../model/framenet');

// [[A, B, C], [D, E, F], [G, H, I]] -->
// [[{type(A), A}, {type(B), B}, {type(C), C}],
// [{type(D), D}, {type(E), E}, {type(F), F}],
// [{type(G), G}, {type(H), H}, {type(I), I}]]
// Takes an array of arrays of tokens as input, outputs an array of arrays of labeled token: {type, name} according to FrameNet standards
// Check each token, if not found in the database (frameElementIndex, phraseTypeIndex, grammaticalFunctionIndex), throw exception
// If two tokens in the same array are of identical type, throw exception
function labelValenceArray(valenceArray){
    var labeledValenceArray = [];
    for(var i = 0; i < valenceArray.length; i++){
        var labeledTokenArray = labelTokenArray(valenceArray[i]);
        // TODO once processed, parse the labeled tokenArray to check whether there are duplicate tokensTypes (PT.PT, GF.GF, FE.FE, etc.) (e.g. NP.VP, Ext.Obj, etc.)
        if(isWellFormed(labeledTokenArray)){
            labeledValenceArray.push(labeledTokenArray);
        }
    }
    return labeledValenceArray;
}


function labelTokenArray(tokenArray){
    var labeledTokenArray = [];
    for(var i = 0; i < tokenArray.length; i++){
        var labeledToken = toLabeledToken(tokenArray[i]);
        tokenArray.push(labeledToken);
    }
    return labeledTokenArray;
}

function toLabeledToken(token){
    var labeledToken = new Valencer.Token();
    labeledToken.name = token;
    labeledToken.type = getTokenType(token);
    return labeledToken;
}

// [[A, B, C], [D, E, F], [G, H, I]] with labeltypes
function findValencePatterns(labeledValenceArray){
    for(var i = 0; i < labeledValenceArray.length; i++){
        var valence = findValence(labeledValenceArray[i]);
        if (valence !== null){
            var pattern = findPattern(valence);
        }else{
            return 'ValenceUnit not found: '+ labeledValenceArray[i];
        }
    }
}

function findValence(labeledTokenArray){
    return dbController.executeQuery(toFindQuery(labeledTokenArray));
}

function findPattern(valence){
    
}