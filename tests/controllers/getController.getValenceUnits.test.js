import chai from 'chai';
import mongoose from 'mongoose';
import mockgoose from 'mockgoose';
import rewire from 'rewire';
import chaiAsPromised from 'chai-as-promised';
import { FrameElement, ValenceUnit } from 'noframenet-core';

chai.use(chaiAsPromised);
const should = chai.should();
const getValenceUnits = rewire('./../../controllers/getController.js').__get__('getValenceUnits');

describe('getController#getValenceUnits', () => {
  before(async () => {
    await mockgoose(mongoose);
    await mongoose.connect('mongodb://valencer.io/tests');
    mockgoose.reset();
    const aFE = new FrameElement({
      _id: 1,
      name: 'A',
    });
    await aFE.save();
    const bFE = new FrameElement({
      _id: 2,
      name: 'B',
    });
    await bFE.save();
    const cFE = new FrameElement({
      _id: 3,
      name: 'C',
    });
    await cFE.save();
    const dFE = new FrameElement({
      _id: 4,
      name: 'D',
    });
    await dFE.save();
    const aNPObj = new ValenceUnit({
      FE: 1,
      PT: 'NP',
      GF: 'Obj',
    });
    await aNPObj.save();
    const bNPObj = new ValenceUnit({
      FE: 2,
      PT: 'NP',
      GF: 'Obj',
    });
    await bNPObj.save();
    const cNPExt = new ValenceUnit({
      FE: 3,
      PT: 'NP',
      GF: 'Ext',
    });
    await cNPExt.save();
    const dPPaExt = new ValenceUnit({
      FE: 4,
      PT: 'PP[about]',
      GF: 'Ext',
    });
    await dPPaExt.save();
  });
  after(() => {
    mongoose.disconnect();
    mockgoose.reset();
  });
  it('#getValenceUnits should be able to process FE.PT.GF', async () => {
    const set = await getValenceUnits(['A', 'NP', 'Obj']);
    set.length.should.equal(1);
    set.toArray()[0].FE.should.equal(1);
    set.toArray()[0].PT.should.equal('NP');
    set.toArray()[0].GF.should.equal('Obj');
  });
/*it('#getValenceUnits should be able to process PT.FE.GF', async () => {
  const set = await getValenceUnits(['NP', 'A', 'Obj']);
  set.length.should.equal(1);
  set.toArray()[0].FE.should.equal(1);
  set.toArray()[0].PT.should.equal('NP');
  set.toArray()[0].GF.should.equal('Obj');
});
it('#getValenceUnits should be able to process GF.PT.FE', async () => {
  const set = await getValenceUnits(['Obj', 'NP', 'A']);
  set.length.should.equal(1);
  set.toArray()[0].FE.should.equal(1);
  set.toArray()[0].PT.should.equal('NP');
  set.toArray()[0].GF.should.equal('Obj');
});
it('#getValenceUnits should be able to process FE', async () => {
  const set = await getValenceUnits(['A']);
  set.length.should.equal(1);
});
it('#getValenceUnits should be able to process PT', async () => {
  const set = await getValenceUnits(['NP']);
  set.length.should.equal(3);
});
it('#getValenceUnits should be able to process PT.GF', async () => {
  const set = await getValenceUnits(['NP', 'Obj']);
  set.length.should.equal(2);
});
it('#getValenceUnits should be able to process FE.GF', async () => {
  const set = await getValenceUnits(['A', 'Obj']);
  set.length.should.equal(1);
});*/
});
