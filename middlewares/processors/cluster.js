const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getClusterLexUnitsWithModel(LexUnit) {
  return async function getClusterLexUnits(lexunits, frameID) {
    const tmpLUs = await LexUnit.find().where({ frame: frameID }).where('_id').in(lexunits);
    return tmpLUs.reduce((clusterLexUnits, lexunit) => {
      const item = { data: { id: lexunit._id,
                             name: lexunit.name,
                             frame: frameID } };
      clusterLexUnits.push(item);
      const relation = { data: { source: frameID,
                                 target: lexunit._id,
                                 type: 'frame' } };
      clusterLexUnits.push(relation);
      return clusterLexUnits;
    }, []);
  };
}

function getClusterFramesWithModel(FrameRelation) {
  return async function getClusterFrames(frames) {
    const clusterFrames = frames.map(frame => ({ data: { _id: frame._id, name: frame.name } }));
    const relations = await FrameRelation.find(
      { $and: [{ subFrame: { $in: frames } }, { supFrame: { $in: frames } }] })
      .populate('type', 'name');
    const clusterRelations = relations.map(relation => ({
      data: { id: relation._id,
              source: relation.supFrame,
              target: relation.subFrame,
              type: relation.type.name } }));
    return clusterFrames.concat(clusterRelations);
  };
}

async function getFrames(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all cluster frames with a valence pattern matching: '${context.query.vp}'`);
  context.valencer.results.cluster = await getClusterFramesWithModel(
    context.valencer.models.FrameRelation)(
      context.valencer.results.frames);
  logger.verbose(`${context.valencer.results.cluster.length} cluster frames
    retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

async function getLexUnits(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all cluster lexUnits in frame._id =
    ${context.valencer.query.frameID} with a valence pattern matching:
    '${context.query.vp}'`);
  context.valencer.results.cluster = await getClusterLexUnitsWithModel(
    context.valencer.models.LexUnit)(
      context.valencer.results.lexUnits,
      context.valencer.query.frameID);
  logger.verbose(`${context.valencer.results.cluster.length} cluster lexUnits
        retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getFrames,
  getLexUnits,
};
