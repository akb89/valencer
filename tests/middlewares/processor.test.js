import chai from 'chai';
import rewire from 'rewire';

const should = chai.should(); // eslint-disable-line no-unused-vars

const $processvp = rewire('./../middlewares/preprocessor.js').__get__('$processvp');

describe('processor', () => {
  it('', () => {

  });
});
