'use strict';

function* validatePatternSyntax(next){
    var rawQuery = this.request.querystring;
    var formattedQuery = PatternUtils.toValenceArray(rawQuery);
    if(isValidQuery(formattedQuery)){
        this.valQuery = formattedQuery;
        yield next;
    }else{
        // Send Json as error
        // Code 200 (validation?)?
        // ex syntax: this.throw(400, 'name required');
    }
}

function isValidQuery(query){
    return true; // TODO: code method
}

module.exports = validatePatternSyntax;