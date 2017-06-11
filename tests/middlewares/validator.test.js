const chai = require('chai');
const validator = require('./../../middlewares/validator');

const should = chai.should();

describe('validator', () => {
  it('#validateQueryNotNullOrUndefined should throw InvalidQuery when context.query object is null or undefined', () => {
    const next = () => {};
    const context = { query: null };
    (() => validator.validateQueryNotEmpty(context, next)).should.throw('InvalidQuery: context.query object is empty, null or undefined');
    context.query = undefined;
    (() => validator.validateQueryNotEmpty(context, next)).should.throw('InvalidQuery: context.query object is empty, null or undefined');
    context.query = '';
    (() => validator.validateQueryNotEmpty(context, next)).should.throw('InvalidQuery: context.query object is empty, null or undefined');
  });
  it('#validateParamsNotNullOrUndefined should throw InvalidParams when context.params object is null or undefined', () => {
    const next = () => {};
    const context = { params: null };
    (() => validator.validateParamsNotEmpty(context, next)).should.throw('InvalidParams: context.params object is empty, null or undefined');
    context.params = undefined;
    (() => validator.validateParamsNotEmpty(context, next)).should.throw('InvalidParams: context.params object is empty, null or undefined');
    context.params = '';
    (() => validator.validateParamsNotEmpty(context, next)).should.throw('InvalidParams: context.params object is empty, null or undefined');
  });
  it('#validateQueryVPnotEmpty should throw InvalidQueryParams when context.query.vp object is null or undefined', () => {
    const next = () => {};
    const context = { query: { vp: null } };
    (() => validator.validateQueryVPnotEmpty(context, next)).should.throw('InvalidQueryParams: context.query.vp parameter is empty, null or undefined');
    context.query.vp = undefined;
    (() => validator.validateQueryVPnotEmpty(context, next)).should.throw('InvalidQueryParams: context.query.vp parameter is empty, null or undefined');
    context.query.vp = '';
    (() => validator.validateQueryVPnotEmpty(context, next)).should.throw('InvalidQueryParams: context.query.vp parameter is empty, null or undefined');
  });
  it('#validateParamsIDnotEmpty should throw InvalidParams when context.params.id object is null or undefined', () => {
    const next = () => {};
    const context = { params: { id: null } };
    (() => validator.validateParamsIDnotEmpty(context, next)).should.throw('InvalidParams: context.params.id parameter is empty, null or undefined');
    context.params.id = undefined;
    (() => validator.validateParamsIDnotEmpty(context, next)).should.throw('InvalidParams: context.params.id parameter is empty, null or undefined');
    context.params.id = '';
    (() => validator.validateParamsIDnotEmpty(context, next)).should.throw('InvalidParams: context.params.id parameter is empty, null or undefined');
  });
  it('#validateParamsIDisNumberOrObjectID should throw InvalidParams when context.params.id object is neither a Number nor an ObjectID', () => {
    const next = () => {};
    const context = { params: { id: 123 } };
    (() => validator.validateParamsIDisNumberOrObjectID(context, next)).should.not.throw();
    context.params.id = '5936efc57aa9948c54c157d8';
    (() => validator.validateParamsIDisNumberOrObjectID(context, next)).should.not.throw();
    context.params.id = 'string';
    (() => validator.validateParamsIDisNumberOrObjectID(context, next)).should.throw('InvalidParams: context.params.id should be a Number or an ObjectID');
    context.params.id = '5936efc57aa99';
    (() => validator.validateParamsIDisNumberOrObjectID(context, next)).should.throw('InvalidParams: context.params.id should be a Number or an ObjectID');
  });
  it('#validateQueryVPcontainsNoInvalidCharacters should throw InvalidQueryParams when context.query.vp object (string) contains an invalid character (non-alphanumeric except for . and +)', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.$' } };
    (() => validator.validateQueryVPcontainsNoInvalidCharacters(context, next)).should.throw('InvalidQueryParams: Invalid character in context.query.vp = \'A.B.$\' at index = 4');
    context.query.vp = 'A.7.C';
    (() => validator.validateQueryVPcontainsNoInvalidCharacters(context, next)).should.throw('InvalidQueryParams: Invalid character in context.query.vp = \'A.7.C\' at index = 2');
    context.query.vp = 'A.B.C D.E';
    (() => validator.validateQueryVPcontainsNoInvalidCharacters(context, next)).should.throw('InvalidQueryParams: Invalid character in context.query.vp = \'A.B.C D.E\' at index = 5');
    context.query.vp = 'A.B.+';
    (() => validator.validateQueryVPcontainsNoInvalidCharacters(context, next)).should.not.throw();
  });
  it('#validateQueryVPcontainsNoInvalidSequence should throw InvalidQueryParams when context.query.vp object (string) contains an invalid sequence (++ | .+ | +. | .. | starting/ending with + or .)', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C++D.E.F' } };
    (() => validator.validateQueryVPcontainsNoInvalidSequence(context, next)).should.throw('InvalidQueryParams: Invalid sequence in context.query.vp = \'A.B.C++D.E.F\' starting at index = 5');
    context.query.vp = '.A.B.C+D.E.F';
    (() => validator.validateQueryVPcontainsNoInvalidSequence(context, next)).should.throw('InvalidQueryParams: Invalid sequence in context.query.vp = \'.A.B.C+D.E.F\' starting at index = 0');
    context.query.vp = 'A.B.C.+D.E.F';
    (() => validator.validateQueryVPcontainsNoInvalidSequence(context, next)).should.throw('InvalidQueryParams: Invalid sequence in context.query.vp = \'A.B.C.+D.E.F\' starting at index = 5');
    context.query.vp = 'A.B.C+.D.E.F';
    (() => validator.validateQueryVPcontainsNoInvalidSequence(context, next)).should.throw('InvalidQueryParams: Invalid sequence in context.query.vp = \'A.B.C+.D.E.F\' starting at index = 5');
    context.query.vp = 'A.B.C+D.E.F+';
    (() => validator.validateQueryVPcontainsNoInvalidSequence(context, next)).should.throw('InvalidQueryParams: Invalid sequence in context.query.vp = \'A.B.C+D.E.F+\' starting at index = 11');
    context.query.vp = 'A.B.C..D.E.F';
    (() => validator.validateQueryVPcontainsNoInvalidSequence(context, next)).should.throw('InvalidQueryParams: Invalid sequence in context.query.vp = \'A.B.C..D.E.F\' starting at index = 5');
  });
  it('#validateQueryVPvalenceUnitLength should throw InvalidQueryParams when context.query.vp object (string) contains more than 3 tokens separated by a dot', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C D.E.F.G' } };
    (() => validator.validateQueryVPvalenceUnitLength(context, next)).should.throw('InvalidQueryParams: MaxValenceLengthExceeded in context.query.vp = \'A.B.C D.E.F.G\'. A valence can only contain up to 3 tokens FE.PT.GF separated by a dot');
  });
  it('#validateQueryPopulateParameter should throw InvalidQueryParams when context.query.populate parameter is neither true nor false', () => {
    const next = () => {};
    const context = { query: { populate: 'tru' } };
    (() => validator.validateQueryPopulateParameter(context, next)).should.throw('InvalidQueryParams: context.query.populate parameter should be true or false');
  });
  it('#validateQueryStrictVUmatchingParameter should throw InvalidQueryParams when context.query.strictVUMatching parameter is neither true nor false', () => {
    const next = () => {};
    const context = { query: { strictVUMatching: 'fals' } };
    (() => validator.validateQueryStrictVUmatchingParameter(context, next)).should.throw('InvalidQueryParams: context.query.strictVUMatching parameter should be true or false');
  });
  it('#validateQueryWithExtraCoreFEsParameter should throw InvalidQueryParams when context.query.withExtraCoreFEs parameter is neither true nor false', () => {
    const next = () => {};
    const context = { query: { withExtraCoreFEs: 'tru' } };
    (() => validator.validateQueryWithExtraCoreFEsParameter(context, next)).should.throw('InvalidQueryParams: context.query.withExtraCoreFEs parameter should be true or false');
  });
  it('#validateQueryParametersCombination should throw InvalidQueryParams when context.query.strictVUMatching is false, context.query.withExtraCoreFEs is false and context.valencer.query.vp.withFEids contains a ValenceUnit with an unspecified FrameElement', () => {
    const next = () => {};
    const context = { valencer: { query: { vp: { withFEids: ['PT', 'GF'] } } }, query: { strictVUMatching: false, withExtraCoreFEs: false } };
    (() => validator.validateQueryParametersCombination(context, next)).should.throw('InvalidQueryParams: the Valencer API cannot process queries with strictVUMatching parameter set to false and withExtraCoreFEs parameter set to false if at least one Frame Element is unspecified in the input Valence Pattern');
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
