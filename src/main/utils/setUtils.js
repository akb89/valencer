'use strict';

/**
 * Utility classes to define custom 'Set' objects extending collections/fast-set to handle
 * valencer objects comparison
 */

import FastSet from 'collections/fast-set';
import './utils'; // for hashcode

/**
 * A Set of (Mongoose) objects. Equals and hashcode are based on the _id parameter and the
 * Mongoose equals method
 */
export class Set extends FastSet { // FIXME: export default class
  constructor(collection) {
    super(collection, (a, b) => {
      return a._id.equals(b._id); // FIXME: implicit return
    }, (object) => {
      return object._id.toString(); // FIXME: implicit return
    });
  }
}
