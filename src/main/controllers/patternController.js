'use strict';

import _ from 'lodash';
import Pattern from '../models/pattern';
import { getPatternSet } from './getController';
import config from '../config';

const logger = config.logger;

async function getAll(context) {
  const query = context.query.vp;
  logger.info(`Querying for all patterns with a valence pattern matching: ${query}`);
  const patternSet = await getPatternSet(query);
  const patterns = await Pattern
      .find()
      .where('_id')
      .in(patternSet.toArray())
      .populate({ path: 'valenceUnits' });

  // Patterns with no _id
  const cleanPatterns = patterns.map((pattern) => {
    return pattern.valenceUnits.map((valenceUnit) => {
      return {
        FE: valenceUnit.FE,
        PT: valenceUnit.PT,
        GF: valenceUnit.GF,
      };
    });
  });
  const uniquePatterns = _.uniqWith(cleanPatterns, _.isEqual); // Will remove duplicate patterns in
                                                             // cleanPatterns
  logger.info(`${uniquePatterns.length} unique patterns found for specified entry`);
  logger.info(`${cleanPatterns.length} exemplifying sentences found for specified entry`);
  context.body = uniquePatterns;
}

export default { getAll };
