var Jsonix = require('jsonix').Jsonix;

//var filesystem = require("graceful-fs");
var filesystem = require("fs");

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./public/resources/properties.ini');

var FrameSchema = require('./../mappings/FrameSchema.js').FrameSchema;
var LexUnitSchema = require('./../mappings/LexUnitSchema').LexUnitSchema;

var context = new Jsonix.Context([FrameSchema, LexUnitSchema]);
var unmarshaller = context.createUnmarshaller();

var frameDir = properties.get('main.frame.directory');
var lexUnitDir = properties.get('main.lexunit.directory');

var MongoClient = require('mongodb').MongoClient, assert = require('assert');

// Main function call
insertFNDataToDB();

function insertFNDataToDB(){
    MongoClient.connect("mongodb://localhost:27017/framenet", function(err, db) {
        if(err) {
            console.error(err);
        }else{
            console.log("Connected to the MongoDB: "+db.name);
            insertAllFrameToDB(db);
            //insertAllLexUnitToDB(db);
        }
    });
}

function insertAllFrameToDB(db){
    var frames = db.collection('frames');
    console.log("Processing all frames in directory: "+frameDir);
    filesystem.readdir(frameDir, function(error, files){
        if(error){
            console.error("Error listing file content in directory: "+frameDir);
        }else{
            var readFiles = function(index){
                if(index == files.length){
                    console.log("Done processing directory: "+frameDir);
                }else{
                    var frameName = files[index].substring(0, files[index].indexOf(".xml"));
                    var file = frameDir+'/'+files[index];
                    if(!file.endsWith(".xml")){
                        console.error("Invalid xml file: "+files[index]);
                        readFiles(index+1);
                    }else{
                        console.log("Processing file: "+files[index]);
                        unmarshaller.unmarshalFile(file, function(frame){
                            frames.insertOne(frame.value);
                            console.log(frameName + " saved to DB");
                            readFiles(index+1);
                        });
                    }
                }
            };
            readFiles(0);
        }
    });
}

function insertAllLexUnitToDB(db){
    var lexunits = db.collection('lexunits');
    console.log("Processing all lus in directory: "+lexUnitDir);
    filesystem.readdir(lexUnitDir, function(error, files){
        if(error){
            console.error("Error listing file content in directory: "+lexUnitDir);
        }else{
            var readFiles = function(index){
                if(index == files.length){
                    console.log("Done processing directory: "+lexUnitDir);
                }else{
                    var luName = files[index].substring(0, files[index].indexOf(".xml"));
                    var file = lexUnitDir+'/'+files[index];
                    if(!file.endsWith(".xml")){
                        console.error("Invalid xml file: "+files[index]);
                        readFiles(index+1);
                    }else{
                        console.log("Processing file: "+files[index]);
                        unmarshaller.unmarshalFile(file, function(lexunit){
                            lexunits.insertOne(lexunit.value);
                            console.log(luName + " saved to DB");
                            readFiles(index+1);
                        });
                    }
                }
            };
            readFiles(0);
        }
    });
}
