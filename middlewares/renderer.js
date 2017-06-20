function renderAnnotationSets(context, next) {
  context.body = context.valencer.results.annotationSets;
  return next();
}

module.exports = {
  renderAnnotationSets,
};
