import chai from 'chai';
import {Pattern} from 'noframenet-core';
import { Set } from './../../utils/setUtils';

const should = chai.should(); // eslint-disable-line no-unused-vars

describe('SetUtils', () => {
  it('Set#equals should correctly identify same _id patterns', () => {
    const pattern1 = new Pattern({ _id: '57fc93d66cc52246ae36adc6' });
    const pattern2 = new Pattern({ _id: '57fc93d66cc52246ae36adc6' });
    const pSet = new Set([pattern1]);
    pSet.has(pattern2).should.equal(true);
    pSet.add(pattern2);
    pSet.length.should.equal(1);
  });
});

