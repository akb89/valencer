'use strict';

import FastSet from 'collections/fast-set';
import './utils'; // for hashcode

class PatternSet extends FastSet {
  constructor(collection) {
    super(collection, (a, b) => {
      return a._id.equals(b._id); // TODO: check this
      // return a._id === b._id;
    }, (object) => {
      return object._id.toString();
    });
  }
}

export default {
  PatternSet,
};
