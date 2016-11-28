import patternUtils from './../utils/patternUtils';
import valenceUnitUtils from './../utils/valenceUnitUtils';
import config from '../config';

const logger = config.logger;

/*
function process(query) {
  return {
    query,
    tokenArray: valenceUnitUtils
      .toTokenArray(patternUtils
        .toValenceArray(query)),
  };
}*/

function preprocess(context, next) {
  logger.debug(`Preprocessing Query: ${context.query.vp}`);
  context.query.preprocessed = valenceUnitUtils.toTokenArray(patternUtils.toValenceArray(context.query.vp));
  return next();
}

export default {
  preprocess,
};
