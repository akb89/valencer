import chai from 'chai';
import validator from './../../middlewares/validator';

const should = chai.should(); // eslint-disable-line no-unused-vars

describe('validator', () => {
  it('#validate should throw InvalidQuery when both vp and params are empty', () => {
    const next = {};
    const context = {
      query: {
        vp: '   ',
      },
      params: {
        id: '   ',
      },
    };
    (() => validator.validate(context, next)).should.throw('InvalidQuery: Empty query and parameters');
  });
  it('#validate should throw InvalidQuery when request combines vp and parameters', () => {
    const next = {};
    const context = {
      query: {
        vp: 'A.B.C',
      },
      params: {
        id: '123',
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
    (() => validator.validate(context, next)).should.throw('InvalidQueryParams: populate parameter should be true or false');
  });
  it('#validate should throw InvalidQueryParams when :id is not a Number or an ObjectID', () => {
    const next = {};
    const context = {
      query: {
        random: 'true',
      },
      params: {
        id: '?fail',
      },
    };
    (() => validator.validate(context, next)).should.throw('InvalidQueryParams: :id should be a Number or an ObjectID');
  });
  it('#validate should throw InvalidQueryParams when vp contains an invalid character (non-alphanumeric except for . and space)', () => {
    const next = {};
    const context = {
      query: {
        vp: 'A.B.$',
      },
    };
    (() => validator.validate(context, next)).should.throw('InvalidQueryParams: Invalid character in vp \'A.B.$\' at index 4');
  });
  it('#validate should throw InvalidQueryParams when vp contains a forbidden sequence (++ | .+ | +. | .. | starting/ending with + or .)', () => {
    const next = {};
    const context = {
      query: {
        vp: 'A.B.C  D.E.F',
      },
    };
    (() => validator.validate(context, next)).should.throw('InvalidQueryParams: Invalid sequence in vp \'A.B.C  D.E.F\' starting at index 5');
    context.query.vp = '.A.B.C D.E.F';
    (() => validator.validate(context, next)).should.throw('InvalidQueryParams: Invalid sequence in vp \'.A.B.C D.E.F\' starting at index 0');
    context.query.vp = 'A.B.C. D.E.F';
    (() => validator.validate(context, next)).should.throw('InvalidQueryParams: Invalid sequence in vp \'A.B.C. D.E.F\' starting at index 5');
    context.query.vp = 'A.B.C .D.E.F';
    (() => validator.validate(context, next)).should.throw('InvalidQueryParams: Invalid sequence in vp \'A.B.C .D.E.F\' starting at index 5');
    context.query.vp = 'A.B.C D.E.F ';
    (() => validator.validate(context, next)).should.throw('InvalidQueryParams: Invalid sequence in vp \'A.B.C D.E.F \' starting at index 11');
    context.query.vp = 'A.B.C..D.E.F';
    (() => validator.validate(context, next)).should.throw('InvalidQueryParams: Invalid sequence in vp \'A.B.C..D.E.F\' starting at index 5');
  });
  it('#validate should throw InvalidQueryParams when at least one valence in the vp contains more than 3 tokens separated by a dot', () => {
    const next = {};
    const context = {
      query: {
        vp: 'A.B.C D.E.F.G',
      },
    };
    (() => validator.validate(context, next)).should.throw('InvalidQueryParams: MaxValenceLengthExceeded in vp \'A.B.C D.E.F.G\'. A valence can only contain up to 3 tokens FE.PT.GF separated by a dot');
  });
});
