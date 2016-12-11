import chai from 'chai';
import utils from './../../utils/utils';

const should = chai.should(); // eslint-disable-line no-unused-vars

describe('utils', () => {
  it('#toValenceArray() should convert a string to an array of sub-strings where each array element is a substring of the input string separated by a +', () => {
    utils.toValenceArray('A.B.C+D.E.F+G.H.I').should.deep.equal(['A.B.C', 'D.E.F', 'G.H.I']);
  });
  it('#toValenceArray() should return an array containing a single element if the input string does not contain any +', () => {
    utils.toValenceArray('Test').should.deep.equal(['Test']);
  });
  it('#toValenceArray() should process trimmed string', () => {
    utils.toValenceArray('  Test   ').should.deep.equal(['Test']);
  });
  it('#toValenceArray() should handle any kind of whitespace (regex /\s/)', () => { // eslint-disable-line no-useless-escape
    //utils.toValenceArray(' A.B.C   +D.E.F \n+G.H.I   ').should.deep
    //  .equal(['A.B.C', 'D.E.F', 'G.H.I']);
  });
  it('#toTokenArray() should convert a valenceUnit array of sub-strings separated by a comma to an array of strings', () => {
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
  it('#toTokenArray() should be able to process a valenceUnit array containing char(s) and string(s) or sub-string(s) in any configuration', () => {
    utils.toTokenArray(['A', 'B.C', 'D.E.F']).should.deep
      .equal([['A'], ['B', 'C'], ['D', 'E', 'F']]);
  });
  it('#toTokenArray() should be able to process typos (mutliple dots)', () => {
    utils.toTokenArray(['A', 'B..C', 'D...E.F']).should.deep
      .equal([['A'], ['B', 'C'], ['D', 'E', 'F']]);
  });
});
