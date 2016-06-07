'use strict';

// query = [[A, B, C], [D, E, F], [G, H, I]]
function* validateTokenType(next){
    var query = this.valQuery;
    var labeledValenceArray = [];
    for(var i = 0; i < query.length; i++){
        var labeledTokenArray = [];
        for(var j = 0; j < query[i].length; j++){
            var tokenType = getTokenType(query[i][j]);
            if(tokenType !== null){
                var token = new Token();
                token.name = query[i][j];
                token.type = tokenType;
                labeledTokenArray.push(token);
            }else{
                //TODO Stop and return error message
            }
        }
        labeledValenceArray.push(labeledTokenArray);
    }
    this.valQuery = labeledValenceArray;
    yield next;
}

function getTokenType(token){
    var grammaticalFunction = findGF(token);
    if(grammaticalFunction !== null){
        return 'GF';
    }else{
        var phraseType = findPT(token);
        if(phraseType !== null){
            return 'PT';
        }else{
            var fe = findFE(token);
            if(fe !== null){
                return 'FE';
            }
        }
    }
    return null;
}

function findGF (token){

}

function findPT (token){

}

function findFE (token){

}

module.exports = {
    findGF : findGF,
    findPT : findPT,
    findFE : findFE
};