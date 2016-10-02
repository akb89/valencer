# Valencer
This is a dev readme listing all the todos and required modifications to improve the API. 

## TODO
### Data import scripts
First todos are related to the import scripts and the MongoDB (see scripts under src/main/framenet).
1. Add script to import fulltext directory (and add related corpus/document models)  
2. Audit database and list all necessary indexes. Add index creation to scripts.  
3. Refactor scripts to ES67 (see below)  
4. Audit scripts and performances  
5. Add error handling on invalid directories (see more specific TODOs in scripts)  
6. Add behavior tests (and possibly unit tests)  
7. Audit *pattern* structure (see below)  


### Pattern
The *pattern* model (an array of *valence units* - FE.PT.GF triplets) constitutes a compromise between performance and usability:  
Ideally, one would want to have a collection of unique elements, but given its size (about 50,000 unique patterns), uniqueness checks hurt performances during import, hence the choice of a non-unique elements collection.   
However, accessing the number of unique elements in the collection, performance via lodash uniqWith (_isEqual) takes about 1h on a collection of 90,000 non-unique elements. This is too much... 
 
### WebServer
1. Switch to Koa2 and ES7
2. Set-up clean data validation and error handling
3. Set-up authentication 
4. Implementation unit and behavior tests

### ES67 proposals
1. Class-based Mongoose models: src/main/model/annotationSetModel_es67 vs. src/main/mode/annotationSetModel
2. 

### Miscellaneous
1. Fix problems related to environment-based configuration