const combinatorics = require('js-combinatorics');

// A.B.C D.E.F G.H.I --> [A.B.C, D.E.F, G.H.I]
function toValenceArray(valencePattern) {
  return valencePattern.split(/\s+/);
}

// [A.B.C, D.E.F, G.H.I] --> [[A, B, C], [D, E, F], [G, H, I]]
function toTokenArray(valenceArray) {
  return valenceArray.map(valence => valence.split(/\.+/));
}

function getKCombinations(array, k) {
  // TODO: is using the generator more efficient?
  return combinatorics.combination(array, k).toArray();
}

function getKNCombinations(k, n) {
  // Get all combinations of k elements in an array of n elements
  const array = [];
  for (let i = 0; i < n; i += 1) {
    array.push(i);
  }
  return getKCombinations(array, k);
}

function getStartTime() {
  return process.hrtime();
}

// Elapsed time since startTime in ms
function getElapsedTime(startTime) {
  return (process.hrtime(startTime)[0] * 1000) + Math.round(process.hrtime(startTime)[1] / 1000000);
}

/**
 * Escapes characters in the string that are not safe to use in a RegExp.
 * @param {*} s The string to escape. If not a string, it will be casted
 *     to one.
 * @return {string} A RegExp safe, escaped copy of {@code s}.
 */
function regExpEscape(s) {
  return String(s).replace(/([-()[\]{}+?*.$^|,:#<!\\])/g, '\\$1')
    .replace(/\x08/g, '\\x08');
}

module.exports = {
  toValenceArray,
  toTokenArray,
  getKNCombinations,
  getStartTime,
  getElapsedTime,
  regExpEscape,
};
