const chai = require('chai');
const validator = require('./../../middlewares/validator');

const should = chai.should();

describe('validator', () => {
  it('#validateQueryNotNullOrUndefined should throw InvalidQuery when context.query object is null', () => {
    const next = () => {};
    const context = { query: null };
    try {
      validator.validateQueryNotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQuery');
      err.message.should.equal('context.query object is empty, null or undefined');
    }
  });
  it('#validateQueryNotNullOrUndefined should throw InvalidQuery when context.query object is undefined', () => {
    const next = () => {};
    const context = { query: undefined };
    try {
      validator.validateQueryNotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQuery');
      err.message.should.equal('context.query object is empty, null or undefined');
    }
  });
  it('#validateQueryNotNullOrUndefined should throw InvalidQuery when context.query object is empty', () => {
    const next = () => {};
    const context = { query: '' };
    try {
      validator.validateQueryNotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQuery');
      err.message.should.equal('context.query object is empty, null or undefined');
    }
  });
  it('#validateParamsNotNullOrUndefined should throw InvalidParams when context.params object is null', () => {
    const next = () => {};
    const context = { params: null };
    try {
      validator.validateParamsNotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params object is empty, null or undefined');
    }
  });
  it('#validateParamsNotNullOrUndefined should throw InvalidParams when context.params object is undefined', () => {
    const next = () => {};
    const context = { params: undefined };
    try {
      validator.validateParamsNotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params object is empty, null or undefined');
    }
  });
  it('#validateParamsNotNullOrUndefined should throw InvalidParams when context.params object is empty', () => {
    const next = () => {};
    const context = { params: '' };
    try {
      validator.validateParamsNotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params object is empty, null or undefined');
    }
  });
  it('#validateQueryVPnotEmpty should throw InvalidQueryParams when context.query.vp object is null', () => {
    const next = () => {};
    const context = { query: { vp: null } };
    try {
      validator.validateQueryVPnotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('context.query.vp parameter is empty, null or undefined');
    }
  });
  it('#validateQueryVPnotEmpty should throw InvalidQueryParams when context.query.vp object is undefined', () => {
    const next = () => {};
    const context = { query: { vp: undefined } };
    try {
      validator.validateQueryVPnotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('context.query.vp parameter is empty, null or undefined');
    }
  });
  it('#validateQueryVPnotEmpty should throw InvalidQueryParams when context.query.vp object is empty', () => {
    const next = () => {};
    const context = { query: { vp: '' } };
    try {
      validator.validateQueryVPnotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('context.query.vp parameter is empty, null or undefined');
    }
  });
  it('#validateParamsIDnotEmpty should throw InvalidParams when context.params.id object is null', () => {
    const next = () => {};
    const context = { params: { id: null } };
    try {
      validator.validateParamsIDnotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params.id parameter is empty, null or undefined');
    }
  });
  it('#validateParamsIDnotEmpty should throw InvalidParams when context.params.id object is undefined', () => {
    const next = () => {};
    const context = { params: { id: undefined } };
    try {
      validator.validateParamsIDnotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params.id parameter is empty, null or undefined');
    }
  });
  it('#validateParamsIDnotEmpty should throw InvalidParams when context.params.id object is empty', () => {
    const next = () => {};
    const context = { params: { id: '' } };
    try {
      validator.validateParamsIDnotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params.id parameter is empty, null or undefined');
    }
  });
  it('#validateParamsIDisNumberOrObjectID should not throw when context.params.id object is a plain Number', () => {
    const next = () => {};
    const context = { params: { id: 123 } };
    (() => validator.validateParamsIDisNumberOrObjectID(context, next)).should.not.throw();
  });
  it('#validateParamsIDisNumberOrObjectID should not throw when context.params.id object is an ObjectID', () => {
    const next = () => {};
    const context = { params: { id: '5936efc57aa9948c54c157d8' } };
    (() => validator.validateParamsIDisNumberOrObjectID(context, next)).should.not.throw();
  });
  it('#validateParamsIDisNumberOrObjectID should not throw when context.params.id object is a string-formatted Number', () => {
    const next = () => {};
    const context = { params: { id: '123' } };
    (() => validator.validateParamsIDisNumberOrObjectID(context, next)).should.not.throw();
  });
  it('#validateParamsIDisNumberOrObjectID should throw InvalidParams when context.params.id object is neither a Number nor an ObjectID', () => {
    const next = () => {};
    const context = { params: { id: 'string' } };
    try {
      validator.validateParamsIDisNumberOrObjectID(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params.id should be a Number or an ObjectID');
    }
  });
  it('#validateParamsIDisNumberOrObjectID should throw InvalidParams when context.params.id object is neither a Number nor an ObjectID', () => {
    const next = () => {};
    const context = { params: { id: '5936efc57aa99' } };
    try {
      validator.validateParamsIDisNumberOrObjectID(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params.id should be a Number or an ObjectID');
    }
  });
  it('#validateQueryVPcontainsNoInvalidCharacters should throw InvalidQueryParams when context.query.vp object (string) contains an invalid character (non-alphanumeric except for . and whitespace)', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.$' } };
    try {
      validator.validateQueryVPcontainsNoInvalidCharacters(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('Invalid character in context.query.vp = \'A.B.$\' at index = 4: \'$\'');
    }
  });
  it('#validateQueryVPcontainsNoInvalidCharacters should throw InvalidQueryParams when context.query.vp object (string) contains an invalid character (non-alphanumeric except for . and whitespace)', () => {
    const next = () => {};
    const context = { query: { vp: 'A.7.C' } };
    try {
      validator.validateQueryVPcontainsNoInvalidCharacters(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('Invalid character in context.query.vp = \'A.7.C\' at index = 2: \'7\'');
    }
  });
  it('#validateQueryVPcontainsNoInvalidCharacters should throw InvalidQueryParams when context.query.vp object (string) contains an invalid character (non-alphanumeric except for . and whitespace)', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C D.E' } };
    (() => validator.validateQueryVPcontainsNoInvalidCharacters(context, next)).should.not.throw();
  });
  it('#validateQueryVPcontainsNoInvalidSequence should throw InvalidQueryParams when context.query.vp object (string) contains an invalid sequence (.\\s | \\s. | .. | starting/ending with .)', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C  D.E.F' } };
    try {
      validator.validateQueryVPcontainsNoInvalidSequence(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('Invalid sequence in context.query.vp = \'A.B.C  D.E.F\' starting at index = 5');
    }
  });
  it('#validateQueryVPcontainsNoInvalidSequence should throw InvalidQueryParams when context.query.vp object (string) contains an invalid sequence (.\\s | \\s. | .. | starting/ending with .)', () => {
    const next = () => {};
    const context = { query: { vp: '.A.B.C D.E.F' } };
    try {
      validator.validateQueryVPcontainsNoInvalidSequence(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('Invalid sequence in context.query.vp = \'.A.B.C D.E.F\' starting at index = 0');
    }
  });
  it('#validateQueryVPcontainsNoInvalidSequence should throw InvalidQueryParams when context.query.vp object (string) contains an invalid sequence (.\\s | \\s. | .. | starting/ending with .)', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C. D.E.F' } };
    try {
      validator.validateQueryVPcontainsNoInvalidSequence(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('Invalid sequence in context.query.vp = \'A.B.C. D.E.F\' starting at index = 5');
    }
  });
  it('#validateQueryVPcontainsNoInvalidSequence should throw InvalidQueryParams when context.query.vp object (string) contains an invalid sequence (.\\s | \\s. | .. | starting/ending with .)', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C .D.E.F' } };
    try {
      validator.validateQueryVPcontainsNoInvalidSequence(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('Invalid sequence in context.query.vp = \'A.B.C .D.E.F\' starting at index = 5');
    }
  });
  it('#validateQueryVPcontainsNoInvalidSequence should throw InvalidQueryParams when context.query.vp object (string) contains an invalid sequence (.\\s | \\s. | .. | starting/ending with .)', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C D.E.F ' } };
    try {
      validator.validateQueryVPcontainsNoInvalidSequence(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('Invalid sequence in context.query.vp = \'A.B.C D.E.F \' starting at index = 11');
    }
  });
  it('#validateQueryVPcontainsNoInvalidSequence should throw InvalidQueryParams when context.query.vp object (string) contains an invalid sequence (.\\s | \\s. | .. | starting/ending with .)', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C..D.E.F' } };
    try {
      validator.validateQueryVPcontainsNoInvalidSequence(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('Invalid sequence in context.query.vp = \'A.B.C..D.E.F\' starting at index = 5');
    }
  });
  it('#validateQueryVPvalenceUnitLength should throw InvalidQueryParams when context.query.vp object (string) contains more than 3 tokens separated by a dot', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C D.E.F.G' } };
    try {
      validator.validateQueryVPvalenceUnitLength(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('MaxValenceLengthExceeded in context.query.vp = \'A.B.C D.E.F.G\'. A valence can only contain up to 3 tokens FE.PT.GF separated by a dot');
    }
  });
  it('#validateQueryStrictVUmatchingParameter should set strictVUMatching to true when not specifying value', () => {
    const next = () => {};
    const context = { query: { strictVUMatching: '' } };
    validator.validateQueryStrictVUmatchingParameter(context, next);
    context.query.strictVUMatching.should.equal(true);
  });
  it('#validateQueryStrictVUmatchingParameter should set strictVUMatching to false by default', () => {
    const next = () => {};
    const context = { query: { strictVUMatching: undefined } };
    validator.validateQueryStrictVUmatchingParameter(context, next);
    context.query.strictVUMatching.should.equal(false);
  });
  it('#validateQueryStrictVUmatchingParameter should throw InvalidQueryParams when context.query.strictVUMatching parameter is neither true nor false', () => {
    const next = () => {};
    const context = { query: { strictVUMatching: 'fals' } };
    try {
      validator.validateQueryStrictVUmatchingParameter(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('context.query.strictVUMatching parameter should be true or false');
    }
  });
  it('#validateQueryWithExtraCoreFEsParameter should set withExtraCoreFEs to true by default', () => {
    const next = () => {};
    const context = { query: { withExtraCoreFEs: undefined } };
    validator.validateQueryWithExtraCoreFEsParameter(context, next);
    context.query.withExtraCoreFEs.should.equal(true);
  });
  it('#validateQueryWithExtraCoreFEsParameter should throw InvalidQueryParams when context.query.withExtraCoreFEs parameter is neither true nor false', () => {
    const next = () => {};
    const context = { query: { withExtraCoreFEs: 'tru' } };
    try {
      validator.validateQueryWithExtraCoreFEsParameter(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('context.query.withExtraCoreFEs parameter should be true or false');
    }
  });
  it('#validateQueryParametersCombination should throw InvalidQueryParams when context.query.strictVUMatching is false, context.query.withExtraCoreFEs is false and context.valencer.query.vp.withFEids contains a ValenceUnit with an unspecified FrameElement', () => {
    const next = () => {};
    const context = { valencer: { query: { vp: { withFEids: ['PT', 'GF'] } } }, query: { strictVUMatching: false, withExtraCoreFEs: false } };
    try {
      validator.validateQueryParametersCombination(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('the Valencer API cannot process queries with strictVUMatching parameter set to false and withExtraCoreFEs parameter set to false if at least one Frame Element is unspecified in the input Valence Pattern');
    }
    context.valencer.query.vp.withFEids = [[1, 2, 3], 'PT', 'GF'];
    (() => validator.validateQueryParametersCombination(context, next)).should.throw();
    context.valencer.query.vp.withFEids = ['PT', 'GF'];
    context.query.strictVUMatching = true;
    (() => validator.validateQueryParametersCombination(context, next)).should.not.throw();
    context.query.strictVUMatching = false;
    context.query.withExtraCoreFEs = true;
    (() => validator.validateQueryParametersCombination(context, next)).should.not.throw();
    context.query.strictVUMatching = true;
    context.query.withExtraCoreFEs = true;
    (() => validator.validateQueryParametersCombination(context, next)).should.not.throw();
  });
});
