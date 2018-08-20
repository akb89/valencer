# Valencer
[![GitHub release][release-image]][release-url]
[![Build][travis-image]][travis-url]
[![Dependencies][david-image]][david-url]
[![DevDependencies][david-dev-dep-image]][david-dev-url]
[![Code Coverage][coverage-image]][coverage-url]
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

## Documentation
The full documentation of the API is available on our [GitHub Page](https://akb89.github.io/valencer/)

## Background
For additional details regarding the background of the API, its architecture and use cases, refer to our [COLING 2016 paper](https://www.aclweb.org/anthology/C/C16/C16-2033.pdf)

## Requirements
- [Mongo](https://docs.mongodb.com/manual/administration/install-community/) >= v3.4
- [Node](https://nodejs.org/en/download/) >= v7.6

To import FrameNet data to a Mongo database, check out
[NoFrameNet](https://github.com/akb89/noframenet)

Alternatively, we provide two MongoDB dumps for
[FrameNet 1.5](data/fn_en_150.7z) and
[FrameNet 1.7](data/fn_en_170.7z) data.
If you are running MongoDB on localhost and port 27017,
you can easily import the dumps once unzipped via:
```
mongorestore -d fn_en_170 /path/to/fn_en_170/
```
More information is available via the MongoDB
[documentation](https://docs.mongodb.com/manual/tutorial/backup-and-restore-tools/)

If you are using our dumps, please do not forget to file in a [FrameNet Data Request](https://framenet.icsi.berkeley.edu/fndrupal/framenet_request_data).


## HowTo &ndash; Start the Valencer server

### Install the required dependencies
Run the following command in your terminal, under the Valencer directory:
```
npm install
```

### Set-up the configuration
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

### Start the server
To start a single instance of the Valencer, run the following command in your
terminal, under the Valencer directory:
```
npm run start
```
For better performances, you can also start multiple instances of the Valencer.
To do so, pass on the `-i` argument to npm:
```
npm run start -- -i num_instances
```
To create the maximum number of instances depending on available threads, do:
```
npm run start -- -i 0
```

### Stop the server
To stop the server, run:
```
npm run stop
```
Note that it will stop ALL instances of the Valencer

### Monitoring
To monitor the Valencer API once started, run:
```
pm2 monit valencer
```
If pm2 is not installed globally in your environment, you can also do:
```
./node_modules/.bin/pm2 monit valencer
```

To access the Valencer logs, run:
```
pm2 logs valencer
```

## HowTo &ndash; Shoot your first query
Here is a sample HTTP request querying the first 10 AnnotationSets in the
database referring to the valence pattern `Donor.NP.Ext Theme.NP.Obj`:
```
curl -i "http://localhost:3030/v5/en/170/annoSets?vp=Donor.NP.Ext+Theme.NP.Obj"
```
The above query should output:
```
HTTP/1.1 200 OK
Vary: Origin, Accept-Encoding
Total-Count: 190
Skip: 0
Limit: 10
Content-Type: application/json; charset=utf-8
Content-Length: 4069
Date: Wed, 24 Jan 2018 09:27:14 GMT
Connection: keep-alive

[{"labels":["5a62f8d9e3bf318cbac8aef0","5a62f8d9e3bf318cbac8aef1","5a62f8d9e3bf318cbac8aef2","5a62f8d9e3bf318cbac8aef3","5a62f8d9e3bf318cbac8aef4","5a62f8d9e3bf318cbac8aef5","5a62f8d9e3bf318cbac8aef6","5a62f8d9e3bf318cbac8aef7","5a62f8d9e3bf318cbac8aef8","5a62f8d9e3bf318cbac8aef9","5a62f8d9e3bf318cbac8aefa"],"_id":2614616,"lexUnit":11593,"sentence":1569707,"pattern":"5a62f8d9e3bf318cbac8aefc"},{"labels":["5a62fb28e3bf318cba2ca68f","5a62fb28e3bf318cba2ca690","5a62fb28e3bf318cba2ca691","5a62fb28e3bf318cba2ca692","5a62fb28e3bf318cba2ca693","5a62fb28e3bf318cba2ca694","5a62fb28e3bf318cba2ca695","5a62fb28e3bf318cba2ca696","5a62fb28e3bf318cba2ca697","5a62fb28e3bf318cba2ca698"],"_id":6525725,"lexUnit":11593,"sentence":4096745,"pattern":"5a62f8d9e3bf318cbac8aefc"},{"labels":["5a62fb22e3bf318cba2b987f","5a62fb22e3bf318cba2b9880","5a62fb22e3bf318cba2b9881","5a62fb22e3bf318cba2b9882","5a62fb22e3bf318cba2b9883","5a62fb22e3bf318cba2b9884","5a62fb22e3bf318cba2b9885","5a62fb22e3bf318cba2b9886","5a62fb22e3bf318cba2b9887","5a62fb22e3bf318cba2b9888"],"_id":6527126,"lexUnit":11593,"sentence":4097344,"pattern":"5a62f8d9e3bf318cbac8aefc"},{"labels":["5a62fb25e3bf318cba2c3666","5a62fb25e3bf318cba2c3667","5a62fb25e3bf318cba2c3668","5a62fb25e3bf318cba2c3669","5a62fb25e3bf318cba2c366a","5a62fb25e3bf318cba2c366b","5a62fb25e3bf318cba2c366c","5a62fb25e3bf318cba2c366d","5a62fb25e3bf318cba2c366e","5a62fb25e3bf318cba2c366f"],"_id":6540825,"lexUnit":11593,"sentence":4100815,"pattern":"5a62f8d9e3bf318cbac8aefc"},{"labels":["5a62fb02e3bf318cba27b2ed","5a62fb02e3bf318cba27b2ee","5a62fb02e3bf318cba27b2ef","5a62fb02e3bf318cba27b2f0","5a62fb02e3bf318cba27b2f1","5a62fb02e3bf318cba27b2f2","5a62fb02e3bf318cba27b2f3","5a62fb02e3bf318cba27b2f4","5a62fb02e3bf318cba27b2f5","5a62fb02e3bf318cba27b2f6","5a62fb02e3bf318cba27b2f7"],"_id":6542617,"lexUnit":11593,"sentence":4101222,"pattern":"5a62f8d9e3bf318cbac8aefc"},{"labels":["5a62f8d9e3bf318cbac8aff1","5a62f8d9e3bf318cbac8aff2","5a62f8d9e3bf318cbac8aff3","5a62f8d9e3bf318cbac8aff4","5a62f8d9e3bf318cbac8aff5","5a62f8d9e3bf318cbac8aff6","5a62f8d9e3bf318cbac8aff7","5a62f8d9e3bf318cbac8aff8","5a62f8d9e3bf318cbac8aff9","5a62f8d9e3bf318cbac8affa","5a62f8d9e3bf318cbac8affb","5a62f8d9e3bf318cbac8affc","5a62f8d9e3bf318cbac8affd","5a62f8d9e3bf318cbac8affe"],"_id":2615829,"lexUnit":11593,"sentence":1569663,"pattern":"5a62f8d9e3bf318cbac8b000"},{"labels":["5a62f8d9e3bf318cbac8b019","5a62f8d9e3bf318cbac8b01a","5a62f8d9e3bf318cbac8b01b","5a62f8d9e3bf318cbac8b01c","5a62f8d9e3bf318cbac8b01d","5a62f8d9e3bf318cbac8b01e","5a62f8d9e3bf318cbac8b01f","5a62f8d9e3bf318cbac8b020","5a62f8d9e3bf318cbac8b021"],"_id":2615833,"lexUnit":11593,"sentence":1569671,"pattern":"5a62f8d9e3bf318cbac8b022"},{"labels":["5a62fb2ae3bf318cba2cfde5","5a62fb2ae3bf318cba2cfde6","5a62fb2ae3bf318cba2cfde7","5a62fb2ae3bf318cba2cfde8","5a62fb2ae3bf318cba2cfde9","5a62fb2ae3bf318cba2cfdea","5a62fb2ae3bf318cba2cfdeb","5a62fb2ae3bf318cba2cfdec","5a62fb2ae3bf318cba2cfded","5a62fb2ae3bf318cba2cfdee","5a62fb2ae3bf318cba2cfdef","5a62fb2ae3bf318cba2cfdf0","5a62fb2ae3bf318cba2cfdf1"],"_id":6522246,"lexUnit":11593,"sentence":4096543,"pattern":"5a62f8d9e3bf318cbac8b0ff"},{"labels":["5a62fb25e3bf318cba2c3bf3","5a62fb25e3bf318cba2c3bf4","5a62fb25e3bf318cba2c3bf5","5a62fb25e3bf318cba2c3bf6","5a62fb25e3bf318cba2c3bf7","5a62fb25e3bf318cba2c3bf8","5a62fb25e3bf318cba2c3bf9","5a62fb25e3bf318cba2c3bfa","5a62fb25e3bf318cba2c3bfb","5a62fb25e3bf318cba2c3bfc","5a62fb25e3bf318cba2c3bfd","5a62fb25e3bf318cba2c3bfe","5a62fb25e3bf318cba2c3bff"],"_id":6540732,"lexUnit":11593,"sentence":4100829,"pattern":"5a62f8d9e3bf318cbac8b0ff"},{"labels":["5a62f8e9e3bf318cbaccc46f","5a62f8e9e3bf318cbaccc470","5a62f8e9e3bf318cbaccc471","5a62f8e9e3bf318cbaccc472","5a62f8e9e3bf318cbaccc473","5a62f8e9e3bf318cbaccc474","5a62f8e9e3bf318cbaccc475","5a62f8e9e3bf318cbaccc476","5a62f8e9e3bf318cbaccc477","5a62f8e9e3bf318cbaccc478","5a62f8e9e3bf318cbaccc479","5a62f8e9e3bf318cbaccc47a","5a62f8e9e3bf318cbaccc47b"],"_id":2447117,"lexUnit":12046,"sentence":1500476,"pattern":"5a62f8e9e3bf318cbaccc480"}]
```

[release-image]:https://img.shields.io/github/release/akb89/valencer.svg?style=flat-square
[release-url]:https://github.com/akb89/valencer/releases/latest
[travis-image]:https://img.shields.io/travis/akb89/valencer.svg?style=flat-square
[travis-url]:https://travis-ci.org/akb89/valencer
[coverage-image]:https://img.shields.io/coveralls/akb89/valencer/master.svg?style=flat-square
[coverage-url]:https://coveralls.io/github/akb89/valencer?branch=master
[quality-image]:https://img.shields.io/codeclimate/maintainability/Nickersoft/dql.svg?style=flat-square
[quality-url]:https://codeclimate.com/github/akb89/valencer/maintainability
[framenet-image]:https://img.shields.io/badge/framenet-1.5%E2%87%A1-blue.svg?style=flat-square
[framenet-url]:https://framenet.icsi.berkeley.edu/fndrupal
[license-image]:http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:LICENSE.txt
[david-url]: https://david-dm.org/akb89/valencer
[david-image]: https://david-dm.org/akb89/valencer.svg?style=flat-square
[david-dev-dep-image]: https://img.shields.io/david/dev/akb89/valencer.svg?style=flat-square
[david-dev-url]: https://david-dm.org/akb89/valencer?type=dev
