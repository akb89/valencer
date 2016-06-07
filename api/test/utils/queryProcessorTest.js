const chai = require('chai');
const should = chai.should();
const QueryProcessor = require('../../src/utils/queryUtils');

describe('QueryUtils', function(){
    it('toValenceArray() should convert a string to an array of sub-strings where each array element is a substring of the input string separated by a whitespace', function(){
        QueryProcessor.toValenceArray('A.B.C D.E.F G.H.I').should.deep.equal(['A.B.C', 'D.E.F', 'G.H.I']);
    });
    it('toValenceArray() should return an array containing a single element if the input string does not contain any whitespace', function() {
        QueryProcessor.toValenceArray('Test').should.deep.equal(['Test']);
    });
    it('toValenceArray() should process trimmed string', function(){
        QueryProcessor.toValenceArray('  Test   ').should.deep.equal(['Test']);
    });
    it('toValenceArray() should handle any king of whitespace (regex /\s/)', function(){
        QueryProcessor.toValenceArray(' A.B.C   D.E.F \n G.H.I   ').should.deep.equal(['A.B.C', 'D.E.F', 'G.H.I']);
    });
    it('toTokenArray() should convert a valence array of sub-strings separated by a comma to an array of strings', function(){
        QueryProcessor.toTokenArray(['A.B.C', 'D.E.F', 'G.H.I']).should.deep.equal([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']]);
    });
    it('toTokenArray() should be able to process a valence array containing a single string', function(){
        QueryProcessor.toTokenArray(['A.B.C']).should.deep.equal([['A', 'B', 'C']]);
    });
    it('toTokenArray() should be able to process a valence array containing a single char', function(){
        QueryProcessor.toTokenArray(['A']).should.deep.equal([['A']]);
    });
    it('toTokenArray() should be able to process a valence array of single char(s)', function(){
        QueryProcessor.toTokenArray(['A', 'B', 'C']).should.deep.equal([['A'], ['B'], ['C']]);
    });
    it('toTokenArray() should be able to process a valence array containing char(s) and string(s) or sub-string(s) in any configuration', function(){
        QueryProcessor.toTokenArray(['A', 'B.C', 'D.E.F']).should.deep.equal([['A'], ['B', 'C'], ['D', 'E', 'F']]);
    });
    it('toTokenArray() should be able to process typos (mutliple dots)', function(){
        QueryProcessor.toTokenArray(['A', 'B..C', 'D...E.F']).should.deep.equal([['A'], ['B', 'C'], ['D', 'E', 'F']]);
    });
});