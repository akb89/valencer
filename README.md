# Valencer
This is a dev readme listing all the todos and required modifications to improve the API. 

## HowTo
MongoDB data are available in valencer_data.zip  
I personally run the program on Node v6.7.0 with:  
`babel-node src/main/server.js`  
You can test the output of the program via:  
`http://localhost:3030/annoSets?vp=Donor.NP.Ext%20Theme.NP.Obj%20Recipient.PP[to].Dep`

## TODO
### Data import scripts
First todos are related to the import scripts and the MongoDB (see scripts under src/main/framenet).  
1. Add script to import fulltext directory (and add related corpus/document models)  
2. Audit database and list all necessary indexes. Add index creation to scripts.  
3. Refactor scripts to ES67  
4. Audit scripts and performances  
5. Add error handling on invalid directories (see more specific TODOs in scripts)  
6. Add behavior tests (and possibly unit tests)  
7. Audit *pattern* structure (see below)  

### Querying for patterns with duplicate valence units (e.g. NP.Obj NP.Obj) 
This is a major shortcoming of the API. Querying for NP.Obj NP Obj does not return patterns with at least 2 distinct NP.Obj valence units.   
See the detailed implementation under getController#_getPatternSet

### Pattern
The *pattern* model (an array of *valence units* - FE.PT.GF triplets) constitutes a compromise between performance and usability:  
Ideally, one would want to have a collection of unique elements, but given its size (about 50,000 unique patterns), uniqueness checks hurt performances during import, hence the choice of a non-unique elements collection.   
However, accessing the number of unique elements in the collection, performance via lodash uniqWith (_isEqual) takes about 1h on a collection of 90,000 non-unique elements. This is too much... 
 
### WebServer
1. Switch to Koa2 and ES7 <-- Done  
2. Set-up clean data validation and error handling  
3. Set-up authentication   
4. Implementation unit and behavior tests  

### ES67 proposals
1. Class-based Mongoose models: src/main/model/annotationSetModel_es67 vs. src/main/mode/annotationSetModel  
2. In getController.js I would like to turn for let ... of ... to a forEach(async (...) => ). I tried but so far it didn't work 

### Documentation
1. Swagger.io + JSDocs  
2. Final version of the README  

### Final Demo Paper
1. Add a paragraph on literature review (comparable programs and softwares)     
2. Add a paragraph on architectural considerations: more motivations for MongoDB and underlying JS techno    
3. Add a paragraph on performances (import, queries execution time)  

### Corentin Ribeyre comments
1. I don't see the point of using class-based mongoose models. Is there a rational behind it? See this Stackoverflow [http://stackoverflow.com/questions/34560235/how-to-write-a-mongoose-model-in-es6-es2015](post) with wich I definitely agree. I won't use Mongoose models and schemas with classes.
2. In utils, you are using classes with static functions. This is a way to do it in Java, but Javascript has no problem with free functions. Just use free functions in modules, this is way more idiomatic.
3. I've changed the way config works to have a file where you put everything that is environment independent.
4. Exporting the config in server and reimporting server as config is not the way to go. You break the semantics behind server (and you are considering that your main entry point is not a real one)
