'use strict';

const Valencer = require('../models/valencer');
const dbController = require('./dbController');
const FrameNet = require('../models/framenet');

// [[A, B, C], [D, E, F], [G, H, I]] -->
// [[{labelType(A), A}, {labelType(B), B}, {labelType(C), C}],
// [{labelType(D), D}, {labelType(E), E}, {labelType(F), F}],
// [{labelType(G), G}, {labelType(H), H}, {labelType(I), I}]]
// Takes an array of arrays of tokens as input, outputs an array of arrays of labeled token: {labelType, labelName} according to FrameNet standards
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
            return 'Valence not found: '+ labeledValenceArray[i];
        }
    }
}

function findValence(labeledTokenArray){
    return dbController.executeQuery(toFindQuery(labeledTokenArray));
}

function toFindQuery(labeledTokenArray){
    var query = 'FrameNet.Valence.find()';
    for(var i = 0; i < labeledTokenArray; i++){
        query += '.where(\''+labeledTokenArray[i].type+'\').equals(\''+labeledTokenArray[i].name+'\')';
    }
    return query;
}

function findPattern(valence){
    
}