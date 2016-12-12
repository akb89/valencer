import chai from 'chai';
import validator from './../../middlewares/validator';

const should = chai.should(); // eslint-disable-line no-unused-vars

describe('validator', () => {
  it('#validate should throw InvalidQuery when request combines vp and parameters', () => {
    const next = {};
    const context = {
      query: {
        vp: 'A.B.C',
      },
      params: {
        id: 123,
      },
    };
    (() => validator.validate(context, next)).should.throw('InvalidQuery: Cannot combine vp and parameters in request: undefined');
  });
  it('#validate should throw InvalidQueryParams when populate parameter is not true of false', () => {
    const next = {};
    const context = {
      query: {
        vp: 'A.B.C',
        populate: 'tru',
      },
    };
    (() => validator.validate(context, next)).should.throw('InvalidQueryParams: populate should be true or false');
  });
  it('#validate should throw InvalidQueryParams when :id is not specified', () => {
    const next = {};
    const context = {
      params: {
        id: undefined,
      },
    };
    (() => validator.validate(context, next)).should.throw('InvalidQueryParams: :id is not specified');
  });
  it('#validate should throw InvalidQueryParams when :id is not a number', () => {
    const next = {};
    const context = {
      params: {
        id: 'true',
      },
    };
    (() => validator.validate(context, next)).should.throw('InvalidQueryParams: :id should be a number');
  });
  it('#validate should throw IllFormedQuery when vp contains an invalid character (non-alphanumeric except for . and space)', () => {
    const next = {};
    const context = {
      query: {
        vp: 'A.B.$',
      },
    };
    (() => validator.validate(context, next)).should.throw('IllFormedQuery: Invalid character in vp \'A.B.$\' at index 4');
  });
  it('#validate should throw IllFormedQuery when vp contains a forbidden sequence (++ | .+ | +. | .. | starting/ending with + or .)', () => {
    const next = {};
    const context = {
      query: {
        vp: 'A.B.C  D.E.F',
      },
    };
    (() => validator.validate(context, next)).should.throw('IllFormedQuery: Invalid sequence in vp \'A.B.C  D.E.F\' starting at index 5');
    context.query.vp = '.A.B.C D.E.F';
    (() => validator.validate(context, next)).should.throw('IllFormedQuery: Invalid sequence in vp \'.A.B.C D.E.F\' starting at index 0');
    context.query.vp = 'A.B.C. D.E.F';
    (() => validator.validate(context, next)).should.throw('IllFormedQuery: Invalid sequence in vp \'A.B.C. D.E.F\' starting at index 5');
    context.query.vp = 'A.B.C .D.E.F';
    (() => validator.validate(context, next)).should.throw('IllFormedQuery: Invalid sequence in vp \'A.B.C .D.E.F\' starting at index 5');
    context.query.vp = 'A.B.C D.E.F ';
    (() => validator.validate(context, next)).should.throw('IllFormedQuery: Invalid sequence in vp \'A.B.C D.E.F \' starting at index 11');
    context.query.vp = 'A.B.C..D.E.F';
    (() => validator.validate(context, next)).should.throw('IllFormedQuery: Invalid sequence in vp \'A.B.C..D.E.F\' starting at index 5');
  });
  it('#validate should throw IllFormedQuery when at least one valence in the vp contains more than 3 tokens separated by a dot', () => {
    const next = {};
    const context = {
      query: {
        vp: 'A.B.C D.E.F.G',
      },
    };
    (() => validator.validate(context, next)).should.throw('IllFormedQuery: MaxValenceLength exceeded in vp \'A.B.C D.E.F.G\'. A valence can only contain up to 3 tokens FE.PT.GF separated by a dot');
  });
});
