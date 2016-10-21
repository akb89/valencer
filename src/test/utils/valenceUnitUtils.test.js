'use strict';

import chai from 'chai';
import utils from './../../main/utils/valenceUnitUtils';

const should = chai.should(); // eslint-disable-line no-unused-vars

describe('ValenceUnitUtils', () => {
  it('#toTokenArray() should convert a valenceUnit array of sub-strings separated by a comma to an array of' +
      ' strings', () => {
    utils.toTokenArray(['A.B.C', 'D.E.F', 'G.H.I']).should.deep
        .equal([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']]);
  });
  it('#toTokenArray() should be able to process a valenceUnit array containing a single string',
      () => {
        utils.toTokenArray(['A.B.C']).should.deep.equal([['A', 'B', 'C']]);
      });
  it('#toTokenArray() should be able to process a valenceUnit array containing a single char',
      () => {
        utils.toTokenArray(['A']).should.deep.equal([['A']]);
      });
  it('#toTokenArray() should be able to process a valenceUnit array of single char(s)', () => {
    utils.toTokenArray(['A', 'B', 'C']).should.deep.equal([['A'], ['B'], ['C']]);
  });
  it('#toTokenArray() should be able to process a valenceUnit array containing char(s) and string(s) or' +
      ' sub-string(s) in any configuration', () => {
    utils.toTokenArray(['A', 'B.C', 'D.E.F']).should.deep
        .equal([['A'], ['B', 'C'], ['D', 'E', 'F']]);
  });
  it('#toTokenArray() should be able to process typos (mutliple dots)', () => {
    utils.toTokenArray(['A', 'B..C', 'D...E.F']).should.deep
        .equal([['A'], ['B', 'C'], ['D', 'E', 'F']]);
  });
});