'use strict';

import patternUtils from './../utils/patternUtils';
import valenceUnitUtils from './../utils/valenceUnitUtils';

function processor(query) {
  return {
    query,
    tokenArray: valenceUnitUtils
      .toTokenArray(patternUtils
        .toValenceArray(query)),
  };
}

export default {
  processor,
};
