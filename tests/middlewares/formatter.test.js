const chai = require('chai');
const formatter = require('./../../middlewares/formatter');

const should = chai.should();

describe('formatter', () => {
  it('#formatValencePatternToArrayOfArrayOfTokens should convert a full string formatted valence pattern to an array of array of tokens', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C+D.E.F+G.H.I' } };
    formatter.formatValencePatternToArrayOfArrayOfTokens(context, next);
    context.valencer.query.vp.formatted.should.deep.equal([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']]);
  });
  it('#replaceFrameElementNamesByFrameElementIds should ', async () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C+D.E.F+G.H.I' } };
    (() => 1).should.equal(2);
  });
});
