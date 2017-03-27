// A.B.C+D.E.F+G.H.I --> [A.B.C, D.E.F, G.H.I]
function toValenceArray(string) {
  const trimmedStr = string.trim();
  if (/\s/.test(trimmedStr)) {
    const array = [];
    let iterator = 0;
    for (let i = 0; i < trimmedStr.length; i += 1) {
      if (/\s/.test(trimmedStr.charAt(i))) {
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

module.exports = {
  toValenceArray,
  toTokenArray,
};
