import { InvalidQuery, InvalidQueryParams } from './../exceptions/apiException';
import utils from './../utils/utils';
import config from '../config';

const logger = config.logger;

function processvp(context, next) {
  context.query.processed = utils.toTokenArray(utils.toValenceArray(context.query.vp));
  return next();
}

function $processvp(context, next) {
  const query = context.query;
  try {
    query.preprocessed = utils.toTokenArray(utils.toValenceArray(query.vp));
    return next();
  } catch (err) {
    context.body = {
      message: err.message,
    };
  }
  return null;
}

function processid(context, next) {
  logger.debug(`Processing id = ${context.params.id}`);
  return next();
}

export default {
  processvp,
  processid,
};
