'use strict';

/**
 * Utility classes extending collections/fast-set to handle object comparison
 */

import FastSet from 'collections/fast-set';
import './utils'; // for hashcode

/**
 * A Set of {@link patternModel:Pattern}
 */
export class PatternSet extends FastSet { // FIXME: export default class
  constructor(collection) {
    super(collection, (a, b) => {
      return a._id.equals(b._id); // FIXME: implicit return
    }, (object) => {
      return object._id.toString(); // FIXME: implicit return
    });
  }
}
