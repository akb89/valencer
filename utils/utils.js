function containsWhiteSpace(string) {
  return /\+/.test(string);
}

function isWhiteSpace(char) {
  if (char.length === 1) {
    return /\+/.test(char);
  }
}

// A.B.C+D.E.F+G.H.I --> [A.B.C, D.E.F, G.H.I]
// Check for invalid characters (regex, everything except . and +)
// Check for invalid combinations: ++ +. .+ .start end.
function toValenceArray(string) {
  string = string.trim();
  if (containsWhiteSpace(string)) {
    const array = [];
    let iterator = 0;
    for (let i = 0; i < string.length; i += 1) {
      if (isWhiteSpace(string.charAt(i))) {
        if (iterator !== i) {
          array.push(string.substring(iterator, i));
        }
        iterator = i + 1;
      }
    }
    array.push(string.substring(iterator, string.length));
    return array;
  }
  return [string];
}

function containsPeriod(string) {
  return /\./.test(string);
}

function isPeriod(char) {
  if (char.length === 1) {
    return /\./.test(char);
  }
}

// TODO throw error if length of valenceArray is > 3
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
  toValenceArray,
  toTokenArray,
};
