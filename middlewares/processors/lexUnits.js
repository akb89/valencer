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

function getCytoEdges(lexunits) {
  const edges = [];
  for (let i = 1; i < lexunits.length; i += 1) {
    if (lexunits[0].frame === lexunits[i].frame) {
      edges.push({ data: { source: lexunits[0]._id, target: lexunits[i]._id } });
    }
  }
  if (lexunits.length > 1) {
    const slice = lexunits.slice(1);
    edges.push(...getCytoEdges(slice));
  }
  return edges;
}

function getCytoLexUnitsWithLexUnitModel(LexUnit) {
  return async function getCytoLexUnits(annotationSets) {
    const lexunits = await LexUnit.find({}, 'name frame').where('_id')
        .in(annotationSets.map(annoset => annoset.lexUnit));
    const cytolexunits = lexunits.map(lexunit => ({
      data: { id: lexunit._id, name: lexunit.name, frame: lexunit.frame } }));
    const edges = getCytoEdges(lexunits);
    return cytolexunits.concat(edges);
  };
}

async function getByAnnotationSets(context, next) {
  const startTime = utils.getStartTime();
  logger.info(`Querying for all LexUnits with a valence pattern matching: '${context.query.vp}'`);
  if (context.query.format === 'cytoscape') {
    context.valencer.results.lexUnits = await getCytoLexUnitsWithLexUnitModel(
      context.valencer.models.LexUnit)(context.valencer.results.annotationSets);
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
