const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getFramesWithFrameModel(Frame, LexUnit) {
  return async function getFrames(annotationSets, projections = {}, populations = []) {
    const lexunits = await LexUnit.find({}, 'frame').where('_id')
                                  .in(annotationSets.map(annoset => annoset.lexUnit));
    const frames = Frame.find({}, projections).where('_id')
        .in(lexunits.map(lexunit => lexunit.frame));
    return populations.reduce((query, p) => query.populate(p), frames);
  };
}

function getCytoFramesWithFrameModel(Frame, LexUnit, FrameRelation) {
  return async function getCytoFrames(annotationSets) {
    const lexunits = await LexUnit.find({}, 'frame').where('_id')
                                  .in(annotationSets.map(annoset => annoset.lexUnit));
    // console.log(lexunits);
    const frames = await Frame.find({}, 'name').where('_id')
        .in(lexunits.map(lexunit => lexunit.frame));
    // console.log(frames);
    const frameIDs = frames.map(frame => frame._id);
    // const frameIDset = new Set(frameIDs);
    const relations = await FrameRelation.find(
      { $and: [{ subFrame: { $in: frameIDs } }, { supFrame: { $in: frameIDs } }] })
      .populate('type');
    // console.log(relations);
    const cytoframes = frames.map(frame => ({ data: { id: frame._id, name: frame.name } }));
    const cytorelations = relations.map(relation => ({
      data: { id: relation._id, source: relation.supFrame, target: relation.subFrame, type: relation.type.name } }));
    return cytoframes.concat(cytorelations);
  };
}

async function getByAnnotationSets(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all Frames containing lexical units with a valence pattern matching: '${context.query.vp}'`);
  if (context.query.format === 'cytoscape') {
    context.valencer.results.frames = await getCytoFramesWithFrameModel(
      context.valencer.models.Frame, context.valencer.models.LexUnit,
      context.valencer.models.FrameRelation)(
        context.valencer.results.annotationSets);
  } else {
    context.valencer.results.frames = await getFramesWithFrameModel(
      context.valencer.models.Frame,
      context.valencer.models.LexUnit)(context.valencer.results.annotationSets,
                                       context.valencer.query.projections,
                                       context.valencer.query.populations);
  }
  // FIXME for cytoframes
  logger.verbose(`${context.valencer.results.frames.length} unique Frames retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByAnnotationSets,
};
