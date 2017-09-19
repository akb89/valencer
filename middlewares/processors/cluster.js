const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getLexUnitsWithFNmodels(LexUnit) {
  return async function getClusterLexUnits(annotationSets, frameID) {
    const lexunits = await LexUnit.find({}, 'frame').where({ frame: frameID }).where('_id')
                                  .in(annotationSets.map(annoset => annoset.lexUnit));
    return lexunits.reduce((clusterLexUnits, lexunit) => {
      const item = { data: { id: lexunit._id,
                             name: lexunit.name } };
      clusterLexUnits.append(item);
      const relation = { data: { id: lexunit._id,
                                 source: lexunit._id,
                                 target: frameID,
                                 type: 'frame' } };
      clusterLexUnits.append(relation);
      return clusterLexUnits;
    }, []);
  };
}

// TODO: refactor with mongo $unwind
function getFramesWithFNmodels(Frame, LexUnit, FrameRelation) {
  return async function getClusterFrames(annotationSets) {
    const lexunits = await LexUnit.find({}, 'frame').where('_id')
                                  .in(annotationSets.map(annoset => annoset.lexUnit))
                                  .populate('frame', 'name');
    // console.log(lexunits);
    const clusterFrames = Array.from(lexunits.reduce((frameMap, lexunit) => {
      if (!frameMap.has(lexunit.frame._id)) {
        frameMap.set(lexunit.frame._id,
          { data: { _id: lexunit.frame._id, name: lexunit.frame.name } });
      }
      return frameMap;
    }, new Map()).values());
    // console.log(clusterFrames);
    const frameIDs = clusterFrames.map(frame => frame.data._id);
    // console.log(frameIDs);
    const relations = await FrameRelation.find(
      { $and: [{ subFrame: { $in: frameIDs } }, { supFrame: { $in: frameIDs } }] })
      .populate('type');
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
  context.valencer.results.cluster = await getFramesWithFNmodels(
    context.valencer.models.Frame, context.valencer.models.LexUnit,
    context.valencer.models.FrameRelation)(
      context.valencer.results.annotationSets);
  // logger.verbose(`${context.valencer.results.frames.length} unique Frames retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

async function getLexUnits(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all cluster lexUnits in frame._id = ${context.valencer.query.frameID} with a valence pattern matching: '${context.query.vp}'`);
  context.valencer.results.cluster = await getLexUnitsWithFNmodels(
    context.valencer.models.LexUnit)(
      context.valencer.results.annotationSets,
      context.valencer.query.frameID);
  return next();
}

module.exports = {
  getFrames,
  getLexUnits,
};
