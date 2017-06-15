/**
 * The core middleware to retrieve FrameNet patterns from the database.
 * This is where the core Valencer algorithm lies.
 * All other FrameNet middlewares are wrappers around core to pass parameters
 * and process the output
 */
const FrameElement = require('noframenet-core').FrameElement;
const Pattern = require('noframenet-core').Pattern;
const ValenceUnit = require('noframenet-core').ValenceUnit;
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const combinatorics = require('js-combinatorics');
const TMPattern = require('./../models/tmpattern');
const ApiError = require('./../exceptions/apiException');
const config = require('./../config');

const Promise = bluebird.Promise;
const logger = config.logger;

function getKCombinations(array, k) {
  return combinatorics.combination(array, k);
}

function getKNCombinations(k, n) {
  // Get all combinations of k elements in an array of n elements
  const array = [];
  for (let i = 0; i < n; i += 1) {
    array.push(i);
  }
  return getKCombinations(array, k);
}

async function getPatternsIDs(arrayOfArrayOfValenceUnitIDs) {
  let set;
  for (let i = arrayOfArrayOfValenceUnitIDs.length - 1; i >= 0; i -= 1) {
    console.log(`i = ${i}`);
    const combinations = getKNCombinations(i, arrayOfArrayOfValenceUnitIDs.length);
  }
}

if (require.main === module) {
  const test = [[1], [2], [3], [4]];
  //getPatternsIDs(test);
  const cmb = getKCombinations([1, 2, 3, 4, 5, 6], 6);
  let combi
  while (combi = cmb.next()) {
    console.log(combi);
  }
}
