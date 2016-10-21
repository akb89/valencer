'use strict';

function containsPeriod(string) {
  return /\./.test(string);
}

function isPeriod(char) {
  if (char.length === 1) {
    return /\./.test(char);
  }
}

// [A.B.C, D.E.F, G.H.I] --> [[A, B, C], [D, E, F], [G, H, I]]
function toTokenArray(valenceArray) {
  const tokenArray = [];
  for (let i = 0; i < valenceArray.length; i += 1) {
    if (containsPeriod(valenceArray[i])) {
      const labelArray = [];
      let iterator = 0;
      for (let j = 0; j < valenceArray[i].length; j += 1) {
        if (isPeriod(valenceArray[i].charAt(j))) {
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

export default {
  toTokenArray,
};
