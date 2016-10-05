'use strict';

if(!String.prototype.hashCode){
    String.prototype.hashCode = function(){
        //return jenkins.oaat(this);
        //return jenkins.lookup2(this);
        //return murmur.murmur3(this, 42);
        //return murmur.murmur2(this, 42);
        //return murmur3.hash128(this).raw();

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