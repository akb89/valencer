const AnnotationSet = require('noframenet-core').AnnotationSet;
const ApiError = require('./../../exceptions/apiException');
const config = require('./../../config');

const logger = config.logger;

async function getByNoPopulateID(context) {
  const startTime = process.hrtime();
  const annoSet = await AnnotationSet
    .findOne()
    .where('_id')
    .equals(context.params.id);
  if (!annoSet) {
    throw ApiError.NotFoundError(`Could not find AnnotationSet with _id = ${context.params.id}`);
  } else {
    context.body = annoSet;
    logger.verbose(`AnnotationSet retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
  }
}

// TODO : replace findOne with findById in Mongoose
async function getByPopulateID(context) {
  const startTime = process.hrtime();
  const annoSet = await AnnotationSet
    .findOne()
    .where('_id')
    .equals(context.params.id)
    .populate([{
      path: 'pattern',
      populate: {
        path: 'valenceUnits',
      },
    }, {
      path: 'sentence',
    }, {
      path: 'lexUnit',
      populate: {
        path: 'frame',
        populate: [{
          path: 'lexUnits',
          select: 'name',
        }, {
          path: 'frameElements',
        }],
      },
    }, {
      path: 'labels',
    }]);
  if (!annoSet) {
    throw ApiError.NotFoundError(`Could not find AnnotationSet with _id = ${context.params.id}`);
  } else {
    context.body = annoSet;
    logger.verbose(`AnnotationSet retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
  }
}

async function getByID(context) {
  logger.info(`Querying for AnnotationSet with _id = ${context.params.id}`);
  const populate = context.query.populate === 'true';
  logger.info(`Return populated documents: ${populate}`);
  if (populate) {
    await getByPopulateID(context);
  } else {
    await getByNoPopulateID(context);
  }
}

async function getByNoPopulateVP(context) {
  const startTime = process.hrtime();
  const annoSets = await AnnotationSet
    .find()
    .where('pattern')
    .in(context.patterns);
  logger.info(`${annoSets.length} unique AnnotationSets found for specified valence pattern: ${context.query.vp}`);
  context.body = annoSets;
  logger.verbose(`AnnotationSets retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByPopulateVP(context) {
  const startTime = process.hrtime();
  const annoSets = await AnnotationSet
    .find()
    .where('pattern')
    .in(context.patterns)
    .populate([{
      path: 'pattern',
      populate: {
        path: 'valenceUnits',
      },
    }, {
      path: 'sentence',
    }, {
      path: 'lexUnit',
      populate: {
        path: 'frame',
        populate: [{
          path: 'lexUnits',
          select: 'name',
        }, {
          path: 'frameElements',
        }],
      },
    }, {
      path: 'labels',
    }]);
  logger.info(`${annoSets.length} unique AnnotationSets found for specified valence pattern: ${context.query.vp}`);
  context.body = annoSets;
  logger.verbose(`AnnotationSets retrieved from db in ${process.hrtime(startTime)[1] / 1000000}ms`);
}

async function getByVP(context) {
  
}

module.exports = {
  getByID,
  getByVP,
};
