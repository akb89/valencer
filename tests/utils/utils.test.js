const chai = require('chai');
const rewire = require('rewire');

const should = chai.should();

const toValenceArray = rewire('./../../utils/utils').__get__('toValenceArray');
const toTokenArray = rewire('./../../utils/utils').__get__('toTokenArray');
const getKNCombinations = rewire('./../../utils/utils').__get__('getKNCombinations');

describe('utils', () => {
  it('#toValenceArray should convert a string to an array of sub-strings where each array element is a substring of the input string separated by a \\s', () => {
    toValenceArray('A.B.C D.E.F G.H.I').should.deep.equal(['A.B.C', 'D.E.F', 'G.H.I']);
  });
  it('#toValenceArray should convert a string to an array of sub-strings where each array element is a substring of the input string separated by multiple \\s', () => {
    toValenceArray('A.B.C    D.E.F   G.H.I').should.deep.equal(['A.B.C', 'D.E.F', 'G.H.I']);
  });
  it('#toValenceArray should return an array containing a single element if the input string does not contain any \\s', () => {
    toValenceArray('Test').should.deep.equal(['Test']);
  });
  it('#toTokenArray should convert a valenceUnit array of sub-strings separated by a dot to an array of strings', () => {
    toTokenArray(['A.B.C', 'D.E.F', 'G.H.I']).should.deep
      .equal([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']]);
  });
  it('#toTokenArray should be able to process a valenceUnit array containing a single string', () => {
    toTokenArray(['A.B.C']).should.deep.equal([['A', 'B', 'C']]);
  });
  it('#toTokenArray should be able to process a valenceUnit array containing a single string and []', () => {
    toTokenArray(['A.B[to].C']).should.deep.equal([['A', 'B[to]', 'C']]);
  });
  it('#toTokenArray should be able to process a valenceUnit array containing a single string separated by multiple dots', () => {
    toTokenArray(['A...B..C']).should.deep.equal([['A', 'B', 'C']]);
  });
  it('#toTokenArray should be able to process a valenceUnit array containing a single char', () => {
    toTokenArray(['A']).should.deep.equal([['A']]);
  });
  it('#toTokenArray should be able to process a valenceUnit array of single char(s)', () => {
    toTokenArray(['A', 'B', 'C']).should.deep.equal([['A'], ['B'], ['C']]);
  });
  it('#toTokenArray should be able to process a valenceUnit array containing char(s) and string(s) or sub-string(s) in any configuration', () => {
    toTokenArray(['A', 'B.C', 'D.E.F']).should.deep
      .equal([['A'], ['B', 'C'], ['D', 'E', 'F']]);
  });
  it('#getKNCombinations should return the correct number of combinations', () => {
    getKNCombinations(1, 3).length.should.equal(3);
    getKNCombinations(2, 4).length.should.equal(6);
    getKNCombinations(2, 5).length.should.equal(10);
    getKNCombinations(3, 5).length.should.equal(10);
    getKNCombinations(3, 6).length.should.equal(20);
    getKNCombinations(7, 10).length.should.equal(120);
    getKNCombinations(5, 5).length.should.equal(1);
    getKNCombinations(1, 1).length.should.equal(1);
  });
});
