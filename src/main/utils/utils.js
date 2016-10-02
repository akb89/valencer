'use strict';

import _ from 'lodash';

if(!Array.prototype.flatten){
    Array.prototype.flatten = function(){
        return _.flatten(this);
    };
}

if(!Array.prototype.chunk){
    Array.prototype.chunk = function(chunkLength){
        var chunks = [];
        if(this.length <= chunkLength){
            chunks.push(this);
            return chunks;
        }
        var iterator = 0;
        while(iterator + chunkLength <= this.length){
            chunks.push(this.slice(iterator, iterator+chunkLength));
            iterator+= chunkLength;
        }
        if(this.slice(iterator).length !== 0){
            chunks.push(this.slice(iterator));
        }
        return chunks;
    }
}

if(!String.prototype.hashCode){
    String.prototype.hashCode = function(){
        var hash = 0, i, chr, len;
        if (this.length === 0) return hash;
        for (i = 0, len = this.length; i < len; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
}