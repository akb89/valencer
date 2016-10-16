# Valencer
[![GitHub release](https://img.shields.io/github/release/akb89/valencer.svg?style=flat-square)]()
[![Build Status](https://img.shields.io/travis/akb89/valencer.svg?style=flat-square)](https://travis-ci.org/akb89/valencer)
[![MIT License](http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square)](LICENSE.txt)
[![node](https://img.shields.io/node/v/gh-badges.svg?style=flat-square)](https://nodejs.org/en/download/current/)
[![Coverage Status](https://img.shields.io/coveralls/akb89/valencer/dev.svg?style=flat-square)](https://coveralls.io/r/akb89/valencer?branch=master)
[![Code Quality](https://img.shields.io/codeclimate/github/akb89/valencer.svg?style=flat-square)](https://codeclimate.com/github/akb89/valencer)
[![FrameNet](https://img.shields.io/badge/framenet-1.6-blue.svg?style=flat-square)](https://framenet.icsi.berkeley.edu/fndrupal/)

Welcome to **Valencer**, a RESTful API to search for annotated sentences matching a given combination of syntactic realizations of the arguments of a predicate --- aka *valence pattern* --- in the FrameNet database.

## HowTo
MongoDB data are available in valencer_data.zip  
I personally run the program on Node v6.7.0 with:  
`babel-node src/main/server.js`  
You can test the output of the program via:  
`http://localhost:3030/annoSets?vp=Donor.NP.Ext%20Theme.NP.Obj%20Recipient.PP[to].Dep`

## TODO
### Querying for patterns with duplicate valence units (e.g. NP.Obj NP.Obj) 
This is a major shortcoming of the API. Querying for NP.Obj NP Obj does not return patterns with at least 2 distinct NP.Obj valence units.   
See the detailed implementation under getController#_getPatternSet

### Documentation
1. Swagger.io + JSDocs  
2. Final version of the README  

### Tests
1. Unit tests
2. Behavior tests
3. Travis continuous integration 

### Performances
Add performances review directly in the README
