const chai = require('chai');
const rewire = require('rewire');
const ApiError = require('../../exceptions/apiException');
const constants = require('../../utils/constants');

const should = chai.should();

const getMaxValenceTokens = rewire('./../../middlewares/validator').__get__('getMaxValenceTokens');
const validateParamsNotEmpty = rewire('./../../middlewares/validator').__get__('validateParamsNotEmpty');
const validateParamsIDnotEmpty = rewire('./../../middlewares/validator').__get__('validateParamsIDnotEmpty');
const validateParamsIDisNumberOrObjectID = rewire('./../../middlewares/validator').__get__('validateParamsIDisNumberOrObjectID');
const validateProjectionString = rewire('./../../middlewares/validator').__get__('validateProjectionString');
const validateQuerySkipParameter = rewire('./../../middlewares/validator').__get__('validateQuerySkipParameter');
const validateQueryLimitParameter = rewire('./../../middlewares/validator').__get__('validateQueryLimitParameter');
const validateQueryStrictVUmatchingParameter = rewire('./../../middlewares/validator').__get__('validateQueryStrictVUmatchingParameter');
const validateQueryVPcontainsNoInvalidSequence = rewire('./../../middlewares/validator').__get__('validateQueryVPcontainsNoInvalidSequence');
const validateQueryVPvalenceUnitLength = rewire('./../../middlewares/validator').__get__('validateQueryVPvalenceUnitLength');
const validateQueryParamNotEmpty = rewire('./../../middlewares/validator').__get__('validateQueryParamNotEmpty');
const validateQueryNotEmpty = rewire('./../../middlewares/validator').__get__('validateQueryNotEmpty');
const validateQueryParamContainsNoInvalidCharacters = rewire('./../../middlewares/validator').__get__('validateQueryParamContainsNoInvalidCharacters');
const validateQueryWithExtraCoreFEsParameter = rewire('./../../middlewares/validator').__get__('validateQueryWithExtraCoreFEsParameter');
const validateQueryParametersCombination = rewire('./../../middlewares/validator').__get__('validateQueryParametersCombination');

describe('validator', () => {
  it('#getMaxValenceTokens should return the correct number of tokens', () => {
    let vp = 'A.B.C D.E.F G.H.I';
    getMaxValenceTokens(vp).should.equal(3);
    vp = 'A.B C.D.E.F.G H';
    getMaxValenceTokens(vp).should.equal(5);
  });
  it('#validateQueryNotNullOrUndefined should throw InvalidQuery when context.query object is null', () => {
    const next = () => {};
    const context = { query: null };
    try {
      validateQueryNotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQuery');
      err.message.should.equal('context.query object is empty, null or undefined');
    }
  });
  it('#validateQueryNotNullOrUndefined should throw InvalidQuery when context.query object is undefined', () => {
    const next = () => {};
    const context = { query: undefined };
    try {
      validateQueryNotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQuery');
      err.message.should.equal('context.query object is empty, null or undefined');
    }
  });
  it('#validateQueryNotNullOrUndefined should throw InvalidQuery when context.query object is empty', () => {
    const next = () => {};
    const context = { query: '' };
    try {
      validateQueryNotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQuery');
      err.message.should.equal('context.query object is empty, null or undefined');
    }
  });
  it('#validateParamsNotNullOrUndefined should throw InvalidParams when context.params object is null', () => {
    const next = () => {};
    const context = { params: null };
    try {
      validateParamsNotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params object is empty, null or undefined');
    }
  });
  it('#validateParamsNotNullOrUndefined should throw InvalidParams when context.params object is undefined', () => {
    const next = () => {};
    const context = { params: undefined };
    try {
      validateParamsNotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params object is empty, null or undefined');
    }
  });
  it('#validateParamsNotNullOrUndefined should throw InvalidParams when context.params object is empty', () => {
    const next = () => {};
    const context = { params: '' };
    try {
      validateParamsNotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params object is empty, null or undefined');
    }
  });
  it('#validateQueryParamNotEmpty should throw InvalidQueryParams when query parameter object is null', () => {
    try {
      validateQueryParamNotEmpty(null);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('query parameter is empty, null or undefined');
    }
  });
  it('#validateQueryParamNotEmpty should throw InvalidQueryParams when query parameter object is undefined', () => {
    try {
      validateQueryParamNotEmpty(undefined);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('query parameter is empty, null or undefined');
    }
  });
  it('#validateQueryParamNotEmpty should throw InvalidQueryParams when query parameter object is empty', () => {
    try {
      validateQueryParamNotEmpty('');
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('query parameter is empty, null or undefined');
    }
  });
  it('#validateParamsIDnotEmpty should throw InvalidParams when context.params.id object is null', () => {
    const next = () => {};
    const context = { params: { id: null } };
    try {
      validateParamsIDnotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params.id parameter is empty, null or undefined');
    }
  });
  it('#validateParamsIDnotEmpty should throw InvalidParams when context.params.id object is undefined', () => {
    const next = () => {};
    const context = { params: { id: undefined } };
    try {
      validateParamsIDnotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params.id parameter is empty, null or undefined');
    }
  });
  it('#validateParamsIDnotEmpty should throw InvalidParams when context.params.id object is empty', () => {
    const next = () => {};
    const context = { params: { id: '' } };
    try {
      validateParamsIDnotEmpty(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params.id parameter is empty, null or undefined');
    }
  });
  it('#validateParamsIDisNumberOrObjectID should not throw when context.params.id object is a plain Number', () => {
    const next = () => {};
    const context = { params: { id: 123 } };
    (() => validateParamsIDisNumberOrObjectID(context, next)).should.not.throw();
  });
  it('#validateParamsIDisNumberOrObjectID should not throw when context.params.id object is an ObjectID', () => {
    const next = () => {};
    const context = { params: { id: '5936efc57aa9948c54c157d8' } };
    (() => validateParamsIDisNumberOrObjectID(context, next)).should.not.throw();
  });
  it('#validateParamsIDisNumberOrObjectID should not throw when context.params.id object is a string-formatted Number', () => {
    const next = () => {};
    const context = { params: { id: '123' } };
    (() => validateParamsIDisNumberOrObjectID(context, next)).should.not.throw();
  });
  it('#validateParamsIDisNumberOrObjectID should throw InvalidParams when context.params.id object is neither a Number nor an ObjectID', () => {
    const next = () => {};
    const context = { params: { id: 'string' } };
    try {
      validateParamsIDisNumberOrObjectID(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params.id should be a Number or an ObjectID');
    }
  });
  it('#validateParamsIDisNumberOrObjectID should throw InvalidParams when context.params.id object is neither a Number nor an ObjectID', () => {
    const next = () => {};
    const context = { params: { id: '5936efc57aa99' } };
    try {
      validateParamsIDisNumberOrObjectID(context, next);
    } catch (err) {
      err.name.should.equal('InvalidParams');
      err.message.should.equal('context.params.id should be a Number or an ObjectID');
    }
  });
  it('#validateQueryParamContainsNoInvalidCharacters should throw InvalidQueryParams when query parameter object (string) contains an invalid character (non-alphanumeric except for . and whitespace)', () => {
    try {
      validateQueryParamContainsNoInvalidCharacters('A.B.$');
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('Invalid character in query parameter \'A.B.$\' at index = 4: \'$\'');
    }
  });
  it('#validateQueryParamContainsNoInvalidCharacters should not throw InvalidQueryParams when processing a regular valence pattern', () => {
    (() => validateQueryParamContainsNoInvalidCharacters('A.B.C D.E')).should.not.throw();
  });
  it('#validateQueryParamContainsNoInvalidCharacters should not throw InvalidQueryParams when processing underscores', () => {
    (() => validateQueryParamContainsNoInvalidCharacters('A_Z.B.C D.E')).should.not.throw();
  });
  it('#validateQueryParamContainsNoInvalidCharacters should not throw InvalidQueryParams when processing digits', () => {
    (() => validateQueryParamContainsNoInvalidCharacters('A_1.B.C D.E')).should.not.throw();
  });
  it('#validateQueryParamContainsNoInvalidCharacters should not throw InvalidQueryParams when processing hyphens', () => {
    (() => validateQueryParamContainsNoInvalidCharacters('A-Z.B.C D.E')).should.not.throw();
  });
  it('#validateQueryParamContainsNoInvalidCharacters should not throw InvalidQueryParams when processing multiple whitespaces', () => {
    (() => validateQueryParamContainsNoInvalidCharacters('A.B.C  D.E.F')).should.not.throw();
  });
  it('#validateQueryVPcontainsNoInvalidSequence should throw InvalidQueryParams when processing a valence pattern starting with a .', () => {
    const next = () => {};
    const context = { query: { vp: '.A.B.C D.E.F' } };
    try {
      validateQueryVPcontainsNoInvalidSequence(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('Invalid sequence in context.query.vp = \'.A.B.C D.E.F\' starting at index = 0');
    }
  });
  it('#validateQueryVPcontainsNoInvalidSequence should throw InvalidQueryParams when processing a valence pattern ending with a .', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C D.E.F.' } };
    try {
      validateQueryVPcontainsNoInvalidSequence(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('Invalid sequence in context.query.vp = \'A.B.C D.E.F.\' starting at index = 11');
    }
  });
  it('#validateQueryVPcontainsNoInvalidSequence should throw InvalidQueryParams when context.query.vp object (string) contains a .\\s sequence', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C. D.E.F' } };
    try {
      validateQueryVPcontainsNoInvalidSequence(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('Invalid sequence in context.query.vp = \'A.B.C. D.E.F\' starting at index = 5');
    }
  });
  it('#validateQueryVPcontainsNoInvalidSequence should throw InvalidQueryParams when context.query.vp object (string) contains a \\s. sequence', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C .D.E.F' } };
    try {
      validateQueryVPcontainsNoInvalidSequence(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('Invalid sequence in context.query.vp = \'A.B.C .D.E.F\' starting at index = 5');
    }
  });
  it('#validateQueryVPcontainsNoInvalidSequence should not throw InvalidQueryParams when processing multiple dots', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C..D.E.F' } };
    (() => validateQueryVPcontainsNoInvalidSequence(context, next)).should.not.throw();
  });
  it('#validateQueryVPvalenceUnitLength should throw InvalidQueryParams when context.query.vp object (string) contains more than 3 tokens separated by a dot', () => {
    const next = () => {};
    const context = { query: { vp: 'A.B.C D.E.F.G' } };
    try {
      validateQueryVPvalenceUnitLength(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('MaxValenceLengthExceeded in context.query.vp = \'A.B.C D.E.F.G\'. A valence can only contain up to 3 tokens FE.PT.GF separated by a dot');
    }
  });
  it('#validateQueryStrictVUmatchingParameter should set strictVUMatching to true when not specifying value', () => {
    const next = () => {};
    const context = { query: { strictVUMatching: '' } };
    validateQueryStrictVUmatchingParameter(context, next);
    context.query.strictVUMatching.should.equal(true);
  });
  it('#validateQueryStrictVUmatchingParameter should set strictVUMatching to false by default', () => {
    const next = () => {};
    const context = { query: { strictVUMatching: undefined } };
    validateQueryStrictVUmatchingParameter(context, next);
    context.query.strictVUMatching.should.equal(false);
  });
  it('#validateQueryStrictVUmatchingParameter should throw InvalidQueryParams when context.query.strictVUMatching parameter is neither true nor false', () => {
    const next = () => {};
    const context = { query: { strictVUMatching: 'fals' } };
    try {
      validateQueryStrictVUmatchingParameter(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('context.query.strictVUMatching parameter should be true or false');
    }
  });
  it('#validateQueryWithExtraCoreFEsParameter should set withExtraCoreFEs to true by default', () => {
    const next = () => {};
    const context = { query: { withExtraCoreFEs: undefined } };
    validateQueryWithExtraCoreFEsParameter(context, next);
    context.query.withExtraCoreFEs.should.equal(true);
  });
  it('#validateQueryWithExtraCoreFEsParameter should throw InvalidQueryParams when context.query.withExtraCoreFEs parameter is neither true nor false', () => {
    const next = () => {};
    const context = { query: { withExtraCoreFEs: 'tru' } };
    try {
      validateQueryWithExtraCoreFEsParameter(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('context.query.withExtraCoreFEs parameter should be true or false');
    }
  });
  it('#validateQueryParametersCombination should throw InvalidQueryParams when context.query.strictVUMatching is false, context.query.withExtraCoreFEs is false and context.valencer.query.vp.withFEids contains a ValenceUnit with an unspecified FrameElement', () => {
    const next = () => {};
    const context = { valencer: { query: { vp: { withFEids: ['PT', 'GF'] } } }, query: { strictVUMatching: false, withExtraCoreFEs: false } };
    try {
      validateQueryParametersCombination(context, next);
    } catch (err) {
      err.name.should.equal('InvalidQueryParams');
      err.message.should.equal('The Valencer API cannot process queries with strictVUMatching parameter set to false and withExtraCoreFEs parameter set to false if at least one Frame Element is unspecified in the input Valence Pattern');
    }
    context.valencer.query.vp.withFEids = [[1, 2, 3], 'PT', 'GF'];
    (() => validateQueryParametersCombination(context, next)).should.throw();
    context.valencer.query.vp.withFEids = ['PT', 'GF'];
    context.query.strictVUMatching = true;
    (() => validateQueryParametersCombination(context, next)).should.not.throw();
    context.query.strictVUMatching = false;
    context.query.withExtraCoreFEs = true;
    (() => validateQueryParametersCombination(context, next)).should.not.throw();
    context.query.strictVUMatching = true;
    context.query.withExtraCoreFEs = true;
    (() => validateQueryParametersCombination(context, next)).should.not.throw();
  });
  it('#validateProjectionString should throw InvalidQueryParams when disallowed characters are used', () => {
    const next = () => {};
    const disallowedChars = constants.DISALLOW_CHARS_PROJ_POPUL;
    disallowedChars.forEach((char) => {
      const context = { params: { projection: `name,${char}test,${char},${char}test2${char}` } };
      (() => validateProjectionString(context, next)).should.throw(ApiError.InvalidQueryParams);
    });
  });
  it('#validateQuerySkipParameter should throw InvalidQueryParams when specified skip parmeter is not a positive integer', () => {
    const next = () => {};
    const invalidSkipParams = ['-1', 'test', '1.7'];
    invalidSkipParams.forEach((param) => {
      const context = { query: { skip: param } };
      (() => validateQuerySkipParameter(context, next)).should.throw(ApiError.InvalidQueryParams);
    });
    const context = { query: { skip: '1' } };
    (() => validateQuerySkipParameter(context, next)).should.not.throw(ApiError.InvalidQueryParams);
  });
  it('#validateQueryLimitParameter should throw InvalidQueryParams when specified skip parmeter is not a positive integer', () => {
    const next = () => {};
    const invalidLimitParams = ['-1', 'test', '1.7'];
    invalidLimitParams.forEach((param) => {
      const context = { query: { limit: param } };
      (() => validateQueryLimitParameter(context, next)).should.throw(ApiError.InvalidQueryParams);
    });
    const context = { query: { limit: '1' } };
    (() => validateQueryLimitParameter(context, next))
      .should.not.throw(ApiError.InvalidQueryParams);
  });
});
