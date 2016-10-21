'use strict';

import chai from 'chai';
import utils from './../../main/utils/patternUtils';

const should = chai.should(); // eslint-disable-line no-unused-vars

describe('PatternUtils', () => {
  it('#toValenceArray() should convert a string to an array of sub-strings where each array element is a substring' +
      ' of the input string separated by a whitespace', () => {
    utils.toValenceArray('A.B.C D.E.F G.H.I').should.deep.equal(['A.B.C', 'D.E.F', 'G.H.I']);
  });
  it('#toValenceArray() should return an array containing a single element if the input string does not contain' +
      ' any whitespace', () => {
    utils.toValenceArray('Test').should.deep.equal(['Test']);
  });
  it('#toValenceArray() should process trimmed string', () => {
    utils.toValenceArray('  Test   ').should.deep.equal(['Test']);
  });
  it('#toValenceArray() should handle any king of whitespace (regex /\s/)', () => { // eslint-disable-line no-useless-escape
    utils.toValenceArray(' A.B.C   D.E.F \n G.H.I   ').should.deep
        .equal(['A.B.C', 'D.E.F', 'G.H.I']);
  });
});