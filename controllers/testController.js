import {
  SemType,
} from 'noframenet-core';

async function test(context) {
  console.log('Testing');
  //const query = context.query.vp;
  //logger.info(`Testing query: ${query}`);
  const semTypes = await SemType
    .findOne()
    .populate({
      path: 'superTypes'
    });
  console.log(semTypes.length);
  console.log(semTypes);
  context.body = semTypes;
}

export default {
  test
};
