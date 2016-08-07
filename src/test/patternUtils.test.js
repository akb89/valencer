'use strict';

const chai = require('chai');
const should = chai.should();
const PatternUtils = require('../../../main/pattern/utils/patternUtils');

describe('PatternUtils', () => {
    it('#toValenceArray() should convert a string to an array of sub-strings where each array element is a substring' +
        ' of the input string separated by a whitespace', () => {
        PatternUtils.toValenceArray('A.B.C D.E.F G.H.I').should.deep.equal(['A.B.C', 'D.E.F', 'G.H.I']);
    });
    it('#toValenceArray() should return an array containing a single element if the input string does not contain' +
        ' any whitespace', () => {
        PatternUtils.toValenceArray('Test').should.deep.equal(['Test']);
    });
    it('#toValenceArray() should process trimmed string', () => {
        PatternUtils.toValenceArray('  Test   ').should.deep.equal(['Test']);
    });
    it('#toValenceArray() should handle any king of whitespace (regex /\s/)', () => {
        PatternUtils.toValenceArray(' A.B.C   D.E.F \n G.H.I   ').should.deep.equal(['A.B.C', 'D.E.F', 'G.H.I']);
    });
});