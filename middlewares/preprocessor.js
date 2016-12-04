import patternUtils from './../utils/patternUtils';
import valenceUnitUtils from './../utils/valenceUnitUtils';
import config from '../config';

const logger = config.logger;

function processvp(context, next) {
  logger.debug(`Preprocessing Query: ${context.query.vp}`);
  console.log(context.query);
  console.log(context.params);
  context.query.preprocessed = valenceUnitUtils.toTokenArray(patternUtils.toValenceArray(context.query.vp));
  return next();
}

function processid(context, next) {
  console.log(context.params.id);
}

export default {
  processvp,
  processid,
};
