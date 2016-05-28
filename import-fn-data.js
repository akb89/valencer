var Jsonix = require('jsonix').Jsonix;

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./public/resources/properties.ini');

var FrameSchema = require('./mappings/FrameSchema.js').FrameSchema;

var LexUnitSchema = require('./mappings/LexUnitSchema').LexUnitSchema;

var context = new Jsonix.Context([FrameSchema, LexUnitSchema]);

var unmarshaller = context.createUnmarshaller();

var frameDir = properties.get('main.frame.directory');
var lexUnitDir = properties.get('main.lexunit.directory');

var MongoClient = require('mongodb').MongoClient, assert = require('assert');

function insertFNDataToDB(){
    MongoClient.connect("mongodb://localhost:27017/framenet", function(err, db) {
        if(err) {
            return console.dir(err);
        }else{
            console.log("Connected to the MongoDB: "+db.name);
            insertAllFrameToDB(db);
        }
    });
}

function insertAllFrameToDB(db){
    var frames = db.collection('frames');
    console.log("Processing all frames in directory: "+frameDir)
    var filesystem = require("fs");
    filesystem.readdirSync(frameDir).forEach(function(file) {
        if(file.endsWith(".xml")){
            console.log("Processing file "+file);
            var frameName = file.substring(0, file.indexOf(".xml"));
            file = frameDir+'/'+file;
            unmarshaller.unmarshalFile(file,
                function(frame){
                    frames.insertOne(frame.value);
                    console.log(frameName + " saved to DB");
                });
        }else{
            console.error("Invalid xml file: "+file)
        }
    });
}

insertFNDataToDB();

/*
function insertAllLexUnitToDB(){

}

unmarshaller.unmarshalFile(properties.get('main.lexunit.directory')+'lu2.xml',
    function(lexUnit){
       console.log(lexUnit.value);
    });

    */