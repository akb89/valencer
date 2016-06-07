//import jsdom from 'jsdom';
var jsdom = require('jsdom');
//import chai from 'chai';
var chai = require('chai');
//import chaiImmutable from 'chai-immutable';
var chaiImmutable = require('chai-immutable');

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;

Object.keys(window).forEach(key => {
    if (!(key in global)) {
        global[key] = window[key];
    }
});

chai.use(chaiImmutable);

//# sourceMappingURL=test_helper-compiled.js.map