const combinatorics = require('js-combinatorics');

// A.B.C+D.E.F+G.H.I --> [A.B.C, D.E.F, G.H.I]
function toValenceArray(string) {
  const trimmedStr = string.trim();
  if (/\+/.test(trimmedStr)) {
    const array = [];
    let iterator = 0;
    for (let i = 0; i < trimmedStr.length; i += 1) {
      if (/\+/.test(trimmedStr.charAt(i))) {
        if (iterator !== i) {
          array.push(trimmedStr.substring(iterator, i));
        }
        iterator = i + 1;
      }
    }
    array.push(trimmedStr.substring(iterator, trimmedStr.length));
    return array;
  }
  return [string];
}

// [A.B.C, D.E.F, G.H.I] --> [[A, B, C], [D, E, F], [G, H, I]]
function toTokenArray(valenceArray) {
  const tokenArray = [];
  for (let i = 0; i < valenceArray.length; i += 1) {
    if (/\./.test(valenceArray[i])) {
      const labelArray = [];
      let iterator = 0;
      for (let j = 0; j < valenceArray[i].length; j += 1) {
        if (/\./.test(valenceArray[i].charAt(j))) {
          if (iterator !== j) {
            labelArray.push(valenceArray[i].substring(iterator, j));
          }
          iterator = j + 1;
        }
      }
      labelArray.push(valenceArray[i].substring(iterator, valenceArray[i].length));
      tokenArray.push(labelArray);
    } else {
      tokenArray.push([valenceArray[i]]);
    }
  }
  return tokenArray;
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

module.exports = {
  toValenceArray,
  toTokenArray,
  getKNCombinations,
};
