import { FrameElement } from 'noframenet-core';
import config from '../config';

const logger = config.logger;

async function test() {
  const fes = await FrameElement.find();
  let feMap = new Map();
  fes.forEach((fe) => {
    if (!feMap.has(fe.name)) {
      feMap.set(fe.name, fe.coreType);
    } else {
      if (feMap.get(fe.name) !== fe.coreType) {
        logger.error(`CoreType differ for FE = ${fe.name}`);
      }
    }
  });
}
export default {
  test,
}
