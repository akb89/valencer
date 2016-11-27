import _ from 'lodash';
import { AnnotationSet, LexUnit } from 'noframenet-core';
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
  let lexUnits = await LexUnit
    .find()
    .where('_id')
    .in(luIds)
    .populate({
      path: 'frame',
      select: 'name',
    })
    .select('frame name -_id');
  lexUnits = _.sortBy(lexUnits, ['frame', 'name']);
  logger.info(`${lexUnits.length} unique lexical units found for specified input`);
  this.context.body = lexUnits;
}

export default {
  getAll,
};
