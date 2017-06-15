const chai = require('chai');
const utils = require('./../../utils/utils');

const should = chai.should();

describe('utils', () => {
  it('#toValenceArray should convert a string to an array of sub-strings where each array element is a substring of the input string separated by a +', () => {
    utils.toValenceArray('A.B.C+D.E.F+G.H.I').should.deep.equal(['A.B.C', 'D.E.F', 'G.H.I']);
  });
  it('#toValenceArray should return an array containing a single element if the input string does not contain any +', () => {
    utils.toValenceArray('Test').should.deep.equal(['Test']);
  });
  it('#toTokenArray should convert a valenceUnit array of sub-strings separated by a dot to an array of strings', () => {
    utils.toTokenArray(['A.B.C', 'D.E.F', 'G.H.I']).should.deep
      .equal([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']]);
  });
  it('#toTokenArray should be able to process a valenceUnit array containing a single string',
    () => {
      utils.toTokenArray(['A.B.C']).should.deep.equal([['A', 'B', 'C']]);
    });
  it('#toTokenArray should be able to process a valenceUnit array containing a single char',
    () => {
      utils.toTokenArray(['A']).should.deep.equal([['A']]);
    });
  it('#toTokenArray should be able to process a valenceUnit array of single char(s)', () => {
    utils.toTokenArray(['A', 'B', 'C']).should.deep.equal([['A'], ['B'], ['C']]);
  });
  it('#toTokenArray should be able to process a valenceUnit array containing char(s) and string(s) or sub-string(s) in any configuration', () => {
    utils.toTokenArray(['A', 'B.C', 'D.E.F']).should.deep
      .equal([['A'], ['B', 'C'], ['D', 'E', 'F']]);
  });
  it('#getKNCombinations should return the correct number of combinations', () => {
    utils.getKNCombinations(1, 3).length.should.equal(3);
    utils.getKNCombinations(2, 4).length.should.equal(6);
    utils.getKNCombinations(2, 5).length.should.equal(10);
    utils.getKNCombinations(3, 5).length.should.equal(10);
    utils.getKNCombinations(3, 6).length.should.equal(20);
    utils.getKNCombinations(7, 10).length.should.equal(120);
    utils.getKNCombinations(5, 5).length.should.equal(1);
    utils.getKNCombinations(1, 1).length.should.equal(1);
  });
});
