import { ValenceUnit } from 'noframenet-core';
import { getValenceUnitSet } from './getController';
import config from '../config';

const logger = config.logger;

async function getAll(context) {
  const query = context.query.vp;
  logger.info(`Querying for all valenceUnits matching: ${query}`);
  const valenceUnitSet = await getValenceUnitSet(query);

  const valenceUnits = await ValenceUnit
    .find()
    .where('_id')
    .in(valenceUnitSet.toArray())
    .select('-_id');
  logger.info(`${valenceUnits.length} unique valenceUnits found for specified entry`);
  context.body = valenceUnits;
}

export default {
  getAll,
};
