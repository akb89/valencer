import config from '../config';
import { InvalidQuery, InvalidQueryParams } from './../exceptions/apiException';

const logger = config.logger;

function validate(context, next) {
  const query = context.query;
  const params = context.params;
  logger.debug(`Validating query: ${query} and/or parameters: ${params}`);
  if (query.vp !== undefined && params !== undefined) {
    throw InvalidQuery(query, 'Cannot combine vp and parameters.');
  }
  if (query.populate !== undefined
    && query.populate !== true
    && query.populate !== false) {
    throw InvalidQueryParams('populate', 'should be true or false');
  }
  return next();
}

export default {
  validate,
};
