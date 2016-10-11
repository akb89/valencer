'use strict';

import FastSet from 'collections/fast-set';
import './utils' // for hashcode

class PatternSet extends FastSet{
    constructor(collection){
        super(collection, function (a, b) {
            return a._id.equals(b._id); // TODO: check this
            //return a._id === b._id;
        }, function (object) {
            return object._id.toString();
        })
    }
}

export {
    PatternSet,

}