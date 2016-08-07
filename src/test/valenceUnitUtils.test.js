'use strict';

const chai = require('chai');
const should = chai.should();
const ValenceUnitUtils = require('../../../main/valenceUnit/utils/valenceUnitUtils');

describe('ValenceUnitUtils', () => {
    it('#toTokenArray() should convert a valenceUnit array of sub-strings separated by a comma to an array of' +
        ' strings', () => {
        ValenceUnitUtils.toTokenArray(['A.B.C', 'D.E.F', 'G.H.I']).should.deep.equal([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']]);
    });
    it('#toTokenArray() should be able to process a valenceUnit array containing a single string', () => {
        ValenceUnitUtils.toTokenArray(['A.B.C']).should.deep.equal([['A', 'B', 'C']]);
    });
    it('#toTokenArray() should be able to process a valenceUnit array containing a single char', () => {
        ValenceUnitUtils.toTokenArray(['A']).should.deep.equal([['A']]);
    });
    it('#toTokenArray() should be able to process a valenceUnit array of single char(s)', () => {
        ValenceUnitUtils.toTokenArray(['A', 'B', 'C']).should.deep.equal([['A'], ['B'], ['C']]);
    });
    it('#toTokenArray() should be able to process a valenceUnit array containing char(s) and string(s) or' +
        ' sub-string(s) in any configuration', () => {
        ValenceUnitUtils.toTokenArray(['A', 'B.C', 'D.E.F']).should.deep.equal([['A'], ['B', 'C'], ['D', 'E', 'F']]);
    });
    it('#toTokenArray() should be able to process typos (mutliple dots)', () => {
        ValenceUnitUtils.toTokenArray(['A', 'B..C', 'D...E.F']).should.deep.equal([['A'], ['B', 'C'], ['D', 'E', 'F']]);
    });
});