'use strict';

/**
 * A meta function to remove boilerplate code from async mocha tests
 * @param fn
 * @returns {function(*)}
 */
const mochAsync = (fn) => {
  return async (done) => {
    try {
      await fn();
      done();
    } catch (err) {
      done(err);
    }
  };
};

export default mochAsync;
