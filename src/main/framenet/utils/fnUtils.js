'use strict';

import FastSet from 'collections/fast-set';
import './utils'; // For Hashcode

class FrameSet extends FastSet{
    constructor() {
        super(null, function (a, b) { // We need this for frameRelations. Frames can be added
            // before the corresponding file is parsed
            return a._id.equals(b._id); // ObjectID equals method of Mongo/Mongoose
        }, function (object) {
            return object._id.toString();
        })
    }
}

class FrameElementSet extends FastSet{
    constructor(){
        super(null, function (a, b) {
            return a._id.equals(b._id);
        }, function (object) {
            return object._id.toString();
        })
    }
}

class SemTypeSet extends FastSet{
    constructor(){
        super(null, function (a, b) {
            return a._id.equals(b._id);
        }, function (object) {
            return object._id.toString();
        })
    }
}

class ValenceUnitSet extends FastSet{
    constructor(){
        super(null, function (a, b) {
            return a.FE === b.FE
                && a.PT === b.PT
                && a.GF === b.GF;
        }, function (object) {
            var result = object.FE != null ? object.FE.hashCode() : 0;
            result = 31 * result + (object.PT != null ? object.PT.hashCode() : 0);
            result = 31 * result + (object.GF != null ? object.GF.hashCode() : 0);
            return result.toString();
        })
    }
}

export {
    FrameSet,
    FrameElementSet,
    SemTypeSet,
    ValenceUnitSet
}