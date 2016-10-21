'use strict';

// TODO throw error if length of valenceArray is > 3
// TODO if query contains 'PP', points toward all PP[] variants: PP[about], PP[of], etc.
// TODO do the same fo 'PPing' and distinguish 'PP' and 'PPing'.

function containsWhiteSpace(string) {
  return /\s/.test(string);
}

function isWhiteSpace(char) {
  if (char.length === 1) {
    return /\s/.test(char);
  }
}

// A.B.C D.E.F G.H.I --> [A.B.C, D.E.F, G.H.I]
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

export default {
  toValenceArray,
};
