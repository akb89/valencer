import { ValenceUnit } from 'noframenet-core';
import getController from './getController';
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

async function getByNoPopulateID(context) {

}

async function getByPopulateID(context) {

}

async function getByNoPopulateID(context) {

}

async function getByPopulateID(context) {

}

async function getByID(context) {
  logger.info(`Querying for Pattern with _id = ${context.params.id}`);
  const populate = context.query.populate === 'true';
  logger.info(`Return populated documents: ${populate}`);
  if (populate) {
    await getByPopulateID(context);
  } else {
    await getByNoPopulateID(context);
  }
}

async function getByNoPopulateVP(context) {

}

async function getByPopulateVP(context) {

}

async function getByVP(context) {
  logger.info(`Querying for all Patterns matching: ${context.query.vp}`);
  const populate = context.query.populate === 'true';
  logger.info(`Return populated documents: ${populate}`);
  if (populate) {
    await getByPopulateVP(context);
  } else {
    await getByNoPopulateVP(context);
  }
}

export default {
  getByID,
  getByVP,
};
