'use strict';

import AnnotationSet from '../models/annotationSet';
import LexUnit from '../models/lexUnit';
import { getPatternSet } from './getController';
import config from '../config';

const logger = config.logger;

async function getAll(context) {
  const query = context.query.vp;
  logger.info(`Querying for all distinct lexUnits with a valence pattern matching: ${query}`);
  const patternSet = await getPatternSet(query);
  const luIds = await AnnotationSet
      .find()
      .where('pattern')
      .in(patternSet.toArray())
      .distinct('lexUnit');
  const lexUnits = await LexUnit
      .find()
      .where('_id')
      .in(luIds)
      .distinct('frame');
  // .select('name frame -_id');
  logger.info(`${lexUnits.length} unique frames found for specified input`);
  context.body = lexUnits.sort();
}

export default { getAll };
