import utils from './../utils/utils';
import config from '../config';

const logger = config.logger;

function processvp(context, next) {
  const vp = context.query.vp;
  logger.debug(`Processing valence pattern: ${vp}`);
  context.processedQuery = utils.toTokenArray(utils.toValenceArray(vp));
  return next();
}

function processid(context, next) {
  logger.debug(`Processing id = ${context.params.id}`);
  return next();
}

export default {
  processvp,
  processid,
};
