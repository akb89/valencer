# Valencer
[![GitHub release][release-image]][release-url]
[![Build][travis-image]][travis-url]
[![Dependencies][david-image]][david-url]
[![MIT License][license-image]][license-url]
[![Code Coverage][coverage-image]][coverage-url]
[![Code Quality][quality-image]][quality-url]
[![FrameNet][framenet-image]][framenet-url]

Welcome to **Valencer**, a RESTful API to query combinations of syntactic realizations of the arguments of a predicate &ndash; aka *valence patterns* &ndash; in the FrameNet database.

#### Are you using us in your work? Please cite us!
```latex
@InProceedings{kabbach-ribeyre:2016:COLINGDEMO,
  author    = {Kabbach, Alexandre  and  Ribeyre, Corentin},
  title     = {{Valencer: an API to Query Valence Patterns in FrameNet}},
  booktitle = {{Proceedings of COLING 2016, the 26th International Conference on Computational Linguistics: System Demonstrations}},
  month     = dec,
  year      = {2016},
  address   = {Osaka, Japan},
  publisher = {The COLING 2016 Organizing Committee},
  pages     = {156--160},
  url       = {http://aclweb.org/anthology/C16-2033}
}
```

## Requirements
- [Mongo](https://docs.mongodb.com/manual/administration/install-community/) >= v3.4
- [Node](https://nodejs.org/en/download/) >= v7.6

To import FrameNet data to a Mongo database, check out [NoFrameNet](https://github.com/akb89/noframenet)

## HowTo &ndash; Start the Valencer server

### 1. Install the required dependencies
Run the following command in your terminal, under the Valencer directory:
```
npm install
```

### 2. Set-up the configuration
Modify the `config/production.js` file
```
const config = {
  dbUri: 'mongodb://localhost:27017/noframenet16',
  port: 3030,
  logger: logger.info,
};
```
The `dbUri` parameter should refer to your Mongo database instance containing FrameNet data.

### 3. Start the server
Run the following command in your terminal, under the Valencer directory:
```
npm run start
```

## HowTo &ndash; Shoot your first query
Here is a sample HTTP request querying all the AnnotationSets in the database referring to the valence pattern `Donor.NP.Ext Theme.NP.Obj Recipient.PP[to].Dep`:
```
http://localhost:3030/annoSets?vp=Donor.NP.Ext+Theme.NP.Obj+Recipient.PP[to].Dep&populate=true
```
Copy-paste the above url to your web-browser.

You can use [JSONView](https://addons.mozilla.org/en-US/firefox/addon/jsonview/) to format JSON in your web-browser and make it more reader-friendly.

## Documentation
The full documentation of the API is available on our [GitHub Page](https://akb89.github.io/valencer/)

## Background
For additional details regarding the background of the API, its architecture and use cases, refer to our [COLING 2016 paper](https://www.aclweb.org/anthology/C/C16/C16-2033.pdf).

[release-image]:https://img.shields.io/github/release/akb89/valencer.svg?style=flat-square
[release-url]:https://github.com/akb89/valencer/releases/latest
[travis-image]:https://img.shields.io/travis/akb89/valencer.svg?style=flat-square
[travis-url]:https://travis-ci.org/akb89/valencer
[coverage-image]:https://img.shields.io/coveralls/valencer/valencer.svg?style=flat-square
[coverage-url]:https://coveralls.io/github/akb89/valencer
[quality-image]:https://img.shields.io/codeclimate/github/akb89/valencer.svg?style=flat-square
[quality-url]:https://codeclimate.com/github/akb89/valencer
[framenet-image]:https://img.shields.io/badge/framenet-1.5%E2%87%A1-blue.svg?style=flat-square
[framenet-url]:https://framenet.icsi.berkeley.edu/fndrupal
[license-image]:http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:LICENSE.txt
[david-url]: https://david-dm.org/akb89/valencer
[david-image]: https://david-dm.org/akb89/valencer.svg?style=flat-square
