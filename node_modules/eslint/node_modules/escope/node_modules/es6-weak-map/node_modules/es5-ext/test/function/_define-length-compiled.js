'use strict';

module.exports = function (t, a) {
	var foo = 'raz',
	    bar = 'dwa',
	    fn = function fn(a, b) {
		return this + a + b + foo + bar;
	},
	    result;

	result = t(fn, 3);
	a(result.call('marko', 'el', 'fe'), 'markoelferazdwa', "Content");
	a(result.length, 3, "Length");
	a(result.prototype, fn.prototype, "Prototype");
};

//# sourceMappingURL=_define-length-compiled.js.map