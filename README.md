# Valencer
[![GitHub release][release-image]][release-url]
[![Build][travis-image]][travis-url]
[![Dependencies][david-image]][david-url]
[![Code Coverage][coverage-image]][coverage-url]
[![Code Quality][quality-image]][quality-url]
[![FrameNet][framenet-image]][framenet-url]
[![MIT License][license-image]][license-url]

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

Alternatively, we provide two MongoDB dumps for [FrameNet 1.5](data/fn_en_150.tar.bz2) and [FrameNet 1.7](data/fn_en_170.tar.bz2) data. If you are running MongoDB on localhost and port 27017, you can easily import the dumps once unzipped via:
```
mongorestore fn_en_170/
```
More information is available via the MongoDB [documentation](https://docs.mongodb.com/manual/tutorial/backup-and-restore-tools/)

If you are using our dumps, please do not forget to file in a [FrameNet Data Request](https://framenet.icsi.berkeley.edu/fndrupal/framenet_request_data).


## HowTo &ndash; Start the Valencer server

### 1. Install the required dependencies
Run the following command in your terminal, under the Valencer directory:
```
npm install
```

### 2. Set-up the configuration
Modify the `config/production.js` file according to your desired settings:
```
const config = {
  logger: logger.info,
  api: {
    port: 3030,
  },
  databases: {
    server: 'localhost',
    port: 27017,
    names: {
      en: {
        150: 'fn_en_150',
        160: 'fn_en_160',
        170: 'fn_en_170',
      },
      ja: {
        100: 'fn_ja_100',
      },
    },
  },
};
```

### 3. Start the server
Run the following command in your terminal, under the Valencer directory:
```
npm run start
```

## HowTo &ndash; Shoot your first query
Here is a sample HTTP request querying all the AnnotationSets in the database referring to the valence pattern `Donor.NP.Ext Theme.NP.Obj Recipient.PP[to].Dep`:
```
http://localhost:3030/v4/en/170/annoSets?vp=Donor.NP.Ext+Theme.NP.Obj
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
[coverage-image]:https://coveralls.io/repos/github/akb89/valencer/badge.svg?branch=master
[coverage-url]:https://coveralls.io/github/akb89/valencer?branch=master
[quality-image]:https://img.shields.io/codeclimate/github/akb89/valencer.svg?style=flat-square
[quality-url]:https://codeclimate.com/github/akb89/valencer
[framenet-image]:https://img.shields.io/badge/framenet-1.5%E2%87%A1-blue.svg?style=flat-square
[framenet-url]:https://framenet.icsi.berkeley.edu/fndrupal
[license-image]:http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:LICENSE.txt
[david-url]: https://david-dm.org/akb89/valencer
[david-image]: https://david-dm.org/akb89/valencer.svg?style=flat-square
