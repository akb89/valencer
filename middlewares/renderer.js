function renderAnnotationSets(context, next) {
  context.body = context.valencer.results.annotationSets;
  return next();
}

function renderLexUnits(context, next) {
  context.body = context.valencer.results.lexUnits;
  return next();
}

module.exports = {
  renderAnnotationSets,
  renderLexUnits,
};
