function renderAnnotationSets(context, next) {
  context.body = context.valencer.results.annotationSets;
  return next();
}

function renderFrames(context, next) {
  context.body = context.valencer.results.frames;
  return next();
}

function renderLexUnits(context, next) {
  context.body = context.valencer.results.lexUnits;
  return next();
}

function renderPatterns(context, next) {
  context.body = context.valencer.results.patterns;
  return next();
}

function renderValenceUnits(context, next) {
  context.body = context.valencer.results.valenceUnits;
  return next();
}

module.exports = {
  renderAnnotationSets,
  renderFrames,
  renderLexUnits,
  renderPatterns,
  renderValenceUnits,
};
