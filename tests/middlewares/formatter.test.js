const chai = require('chai');
const rewire = require('rewire');
const mongoose = require('mongoose');
const config = require('./../../config');
const FrameElement = require('noframenet-core').FrameElement;

const should = chai.should();

const formatValencePatternToArrayOfArrayOfTokens = rewire('./../../middlewares/formatter').__get__('formatValencePatternToArrayOfArrayOfTokens');
const replaceFrameElementNamesByFrameElementIds = rewire('./../../middlewares/formatter').__get__('replaceFrameElementNamesByFrameElementIds');
const formatProjectionString = rewire('./../../middlewares/formatter').__get__('formatProjectionString');
const formatPopulationString = rewire('./../../middlewares/formatter').__get__('formatPopulationString');
const extractFEnamesSet = rewire('./../../middlewares/formatter').__get__('extractFEnamesSet');

describe('formatter', () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.dbUri, {
        keepAlive: 1,
        connectTimeoutMS: 30000,
      });
    }
    const aFE = new FrameElement({
      _id: 1,
      name: 'A',
    });
    await aFE.save();
    const eFE1 = new FrameElement({
      _id: 4,
      name: 'E',
    });
    await eFE1.save();
    const eFE2 = new FrameElement({
      _id: 5,
      name: 'E',
    });
    await eFE2.save();
    const iFE1 = new FrameElement({
      _id: 9,
      name: 'I',
    });
    await iFE1.save();
    const iFE2 = new FrameElement({
      _id: 10,
      name: 'I',
    });
    await iFE2.save();
    const iFE3 = new FrameElement({
      _id: 11,
      name: 'I',
    });
    await iFE3.save();
    const aaFE = new FrameElement({
      _id: 12,
      name: 'AA',
    });
    await aaFE.save();
    const eeeFE = new FrameElement({
      _id: 13,
      name: 'EEE',
    });
    await eeeFE.save();
    const eeFE = new FrameElement({
      _id: 14,
      name: 'eE',
    });
    await eeFE.save();
    const eeeFE2 = new FrameElement({
      _id: 15,
      name: 'eee',
    });
    await eeeFE2.save();
    // await FrameElement.collection.createIndex({
    //   name: 'text',
    // });
  });
  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
  it('#formatValencePatternToArrayOfArrayOfTokens should convert a full string formatted valence pattern to an array of array of tokens', () => {
    const next = () => {};
    const context = {
      query: {
        vp: 'A.B.C  D.E.F G.H.I',
      },
      valencer: {
        query: {
          vp: {},
        },
      },
    };
    formatValencePatternToArrayOfArrayOfTokens(context, next);
    context.valencer.query.vp.formatted.should.deep.equal([
      ['A', 'B', 'C'],
      ['D', 'E', 'F'],
      ['G', 'H', 'I'],
    ]);
  });
  it('#formatValencePatternToArrayOfArrayOfTokens should convert a full string formatted valence pattern to an array of array of tokens', () => {
    const next = () => {};
    const context = {
      query: {
        vp: 'A.B.C  D.E.F G.H.I',
      },
      valencer: {
        query: {
          vp: {},
        },
      },
    };
    formatValencePatternToArrayOfArrayOfTokens(context, next);
    context.valencer.query.vp.formatted.should.deep.equal([
      ['A', 'B', 'C'],
      ['D', 'E', 'F'],
      ['G', 'H', 'I'],
    ]);
  });
  it('#formatValencePatternToArrayOfArrayOfTokens should convert a full string formatted valence pattern to an array of array of tokens', () => {
    const next = () => {};
    const context = {
      query: {
        vp: 'A.B.C  D.E.F G.H.I',
      },
      valencer: {
        query: {
          vp: {},
        },
      },
    };
    formatValencePatternToArrayOfArrayOfTokens(context, next);
    context.valencer.query.vp.formatted.should.deep.equal([
      ['A', 'B', 'C'],
      ['D', 'E', 'F'],
      ['G', 'H', 'I'],
    ]);
  });
  it('#replaceFrameElementNamesByFrameElementIds should return an array of valenceunits (i.e. an array of array of tokens) with an array of FrameElement ids in place of the FE name', async () => {
    const next = () => {};
    const context = {
      valencer: {
        models: {
          FrameElement,
        },
        query: {
          vp: {
            formatted: [
              ['A', 'B', 'C'],
              ['D', 'E', 'F'],
              ['G', 'H', 'I'],
            ],
          },
        },
      },
    };
    await replaceFrameElementNamesByFrameElementIds(context, next);
    context.valencer.query.vp.withFEids.should.deep.equal([
      [
        [1], 'B', 'C',
      ],
      ['D', [4, 5], 'F'],
      ['G', 'H', [9, 10, 11]],
    ]);
  });
  it('#replaceFrameElementNamesByFrameElementIds should be case insensitive', async () => {
    const next = () => {};
    const context = {
      valencer: {
        models: {
          FrameElement,
        },
        query: {
          vp: {
            formatted: [
              ['Aa', 'B', 'C'],
              ['D', 'eEe', 'F'],
            ],
          },
        },
      },
    };
    await replaceFrameElementNamesByFrameElementIds(context, next);
    context.valencer.query.vp.withFEids.should.deep.equal([
      [
        [12], 'B', 'C',
      ],
      ['D', [13, 15], 'F'],
    ]);
  });
  it('#formatProjectionString should return an object with projection_field as keys and 1 as values', async () => {
    const next = () => {};
    const context = {
      params: {
        projection: 'name,test,field_1',
      },
      valencer: {
        query: {
          projections: {},
        },
      },
    };
    await formatProjectionString(context, next);
    context.valencer.query.projections.should.deep.equal({
      name: 1,
      test: 1,
      field_1: 1,
    });
  });
  it('#formatProjectionString should return an object with projection_field as keys and 1 as values', async () => {
    const next = () => {};
    const context = {
      params: {
        population: 'name[test|name],name.test, name.ok[no|dac],field_1[ok|no]',
      },
      valencer: {
        query: {
          populations: {},
        },
      },
    };
    await formatPopulationString(context, next);
  });
  it('#extractFEnamesSet should return a valid set of FE names', async () => {
    const next = () => {};
    const context = {
      valencer: {
        models: {
          FrameElement,
        },
        query: {
          vp: {
            formatted: [
              ['Aa', 'B', 'C'],
              ['D', 'eEe', 'F'],
            ],
          },
          feNamesSet: new Set(),
        },
      },
    };
    await extractFEnamesSet(context, next);
    context.valencer.query.feNamesSet.size.should.equal(2);
    context.valencer.query.feNamesSet.has('Aa').should.be.true;
    context.valencer.query.feNamesSet.has('eEe').should.be.true;
  });
});
