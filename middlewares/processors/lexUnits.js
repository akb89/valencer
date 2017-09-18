const config = require('../../config');
const utils = require('../../utils/utils');

const logger = config.logger;

function getLexUnitsWithLexUnitModel(LexUnit) {
  return async function getLexUnits(annotationSets, projections = {}, populations = []) {
    const lexunits = LexUnit.find({}, projections).where('_id')
        .in(annotationSets.map(annoset => annoset.lexUnit));
    return populations.reduce((query, p) => query.populate(p), lexunits);
  };
}

function getLexUnitCytoEdges(lexunits) {
  const edges = [];
  const maxCounter = 5; // max number of LU relations to display
  for (let iterator = 0; iterator < lexunits.length; iterator += 1) {
    let notfound = true;
    let counter = 0;
    for (let i = iterator + 1; i < lexunits.length; i += 1) {
      if (lexunits[iterator].frame === lexunits[i].frame) {
        edges.push({ data: { source: lexunits[iterator]._id,
                             target: lexunits[i]._id,
                             frame: lexunits[iterator].frame } });
        notfound = false;
        counter += 1;
        if (counter === maxCounter) {
          break;
        }
      }
    }
    if (notfound === true) {
      counter = 0;
      for (let j = 0; j < iterator; j += 1) {
        if (lexunits[iterator].frame === lexunits[j].frame) {
          edges.push({ data: { source: lexunits[iterator]._id,
                               target: lexunits[j]._id,
                               frame: lexunits[iterator].frame } });
          counter += 1;
          if (counter === maxCounter) {
            break;
          }
        }
      }
    }
  }
  return edges;
}

function getHeadLexUnits(lexunits) {
  return lexunits.reduce((headLexunits, lexunit) => {
    if (!headLexunits.has(lexunit.frame)) {
      headLexunits.set(lexunit.frame, lexunit._id);
    }
    return headLexunits;
  }, new Map());
}

function getCytoLexUnitsWithLexUnitModel(LexUnit, FrameRelation) {
  return async function getCytoLexUnits(annotationSets) {
    const lexunits = await LexUnit.find({}, 'name frame').where('_id')
        .in(annotationSets.map(annoset => annoset.lexUnit));
    const cytolexunits = lexunits.map(lexunit => ({
      data: { id: lexunit._id, name: lexunit.name, frame: lexunit.frame } }));
    const lexunitEdges = getLexUnitCytoEdges(lexunits);
    const headLexunits = getHeadLexUnits(lexunits); // Get one lexunit per
    // frame cluster to map frame relations
    const frameIDs = Array.from(headLexunits.keys());
    const relations = await FrameRelation.find(
      { $and: [{ subFrame: { $in: frameIDs } }, { supFrame: { $in: frameIDs } }] })
      .populate('type');
    const frameEdges = relations.map(relation => ({
      data: { id: relation._id,
              source: headLexunits.get(relation.supFrame),
              target: headLexunits.get(relation.subFrame),
              type: relation.type.name } }));
    return cytolexunits.concat(lexunitEdges).concat(frameEdges);
  };
}

async function getByAnnotationSets(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all LexUnits with a valence pattern matching: '${context.query.vp}'`);
  if (context.valencer.query.format === 'cytoscape') {
    context.valencer.results.lexUnits = await getCytoLexUnitsWithLexUnitModel(
      context.valencer.models.LexUnit,
      context.valencer.models.FrameRelation)(context.valencer.results.annotationSets);
  } else {
    context.valencer.results.lexUnits = await getLexUnitsWithLexUnitModel(
            context.valencer.models.LexUnit)(context.valencer.results.annotationSets,
                                             context.valencer.query.projections,
                                             context.valencer.query.populations);
  }
  // FIXME for cytolexunits
  logger.verbose(`${context.valencer.results.lexUnits.length} unique LexUnits
    retrieved from database in ${utils.getElapsedTime(startTime)}ms`);
  return next();
}

module.exports = {
  getByAnnotationSets,
};
