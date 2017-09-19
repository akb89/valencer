const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getFramesWithModel(Frame) {
  return async function getFrames(frameIDs, countMode = false,
                                  projections = {}, populations = [],
                                  skip, limit) {
    if (countMode) {
      return Frame.find().where('_id').in(frameIDs).count();
    }
    const frames = Frame.find({}, projections).where('_id').in(frameIDs)
                        .skip(skip)
                        .limit(limit);
    return populations.reduce((query, p) => query.populate(p), frames);
  };
}

function getFrameIDsWithModel(AnnotationSet) {
  return async function getFrameIDs(filteredPatternsIDs) {
    return Array.from((await AnnotationSet.find({}, 'lexUnit').where('pattern')
                           .in(filteredPatternsIDs).populate('lexUnit', 'frame'))
                     .reduce((frameIDset, annoSet) => {
                       if (!frameIDset.has(annoSet.lexUnit.frame)) {
                         frameIDset.add(annoSet.lexUnit.frame);
                       }
                       return frameIDset;
                     }, new Set()));
  };
}

async function getByVP(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for Frames with skip =
    '${context.valencer.query.skip}', limit = '${context.valencer.query.limit}'
    and vp = '${context.query.vp}'`);
  const frameIDs = await getFrameIDsWithModel(
    context.valencer.models.AnnotationSet)(
      context.valencer.results.tmp.filteredPatternsIDs);
  const [count, results] = await Promise.all([
    getFramesWithModel(context.valencer.models.Frame)(frameIDs, true),
    getFramesWithModel(context.valencer.models.Frame)(frameIDs, false,
                                                      context.valencer.query.projections,
                                                      context.valencer.query.populations,
                                                      context.valencer.query.skip,
                                                      context.valencer.query.limit),
  ]);
  context.set({
    'Total-Count': count,
    Skip: context.valencer.query.skip,
    Limit: context.valencer.query.limit,
  });
  context.valencer.results.frames = results;
  logger.verbose(`${results.length} unique Frames out of ${count} retrieved
    from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByVP,
};
