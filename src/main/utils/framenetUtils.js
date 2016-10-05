'use strict';

import FastSet from 'collections/fast-set';
import './utils' // for hashcode

class PatternSet extends FastSet{
    constructor(){
        super(null, function (a, b) {
            return a._id.equals(b._id);
        }, function (object) {
            return object._id.toString();
        })
    }
}

export {
    PatternSet,

}