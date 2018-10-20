var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://kay:"+process.env.MONGODB_PASSWORD+"@cluster0.mongodb.net/openmc";
var database;
var Tile = require('../app/tiles.js');
var socket = require('../app/socket.js');
var board = require('../app/board.js');

function connect() {
    MongoClient.connect(url, function(err, db) {
        if (err) { console.log("Error connecting to database: "+err.message); return; }
        database = db.db("openmc");
        database.createCollection("default_table", function(err, res) {});
    });
}

function update(collectionName, query, new_values, callback) {
    if (Object.keys(new_values).length == 0) { 
        console.log("No new values specified! Will not update "+collectionName+"."); 
        return; 
    }
    var collection = database.collection(collectionName);
    collection.update(query, {$set: new_values}, function(err, result) {
        console.log("Updating entries "+[result]+"!");
        if (err) { console.log("There was an error updating collection "+collectionName+"! "
                        +err.message); }
        if (callback) callback(err, result);
    });
}

function insert(collectionName, entries, callback) {
    var collection = database.collection(collectionName);
    collection.insertMany(entries, function(err, result) {
        if (err) { console.log(err.message); }
        callback(err, result);
    });
};

function get(collectionName, query, callback) {
    // Get the collection
    var collection = database.collection(collectionName);
    // Find some entries that match
    collection.find(query).toArray(function(err, docs) {
        if (err) { console.log(err.message); }
        callback(err, docs); //perform the defined action on the results (the docs)
    });
};

function remove(collectionName, query, callback) {
    var collection = database.collection(collectionName);
    collection.deleteMany(query, function(err, result) {
        if (err) { console.log(err.message); }
        callback(err, result);
    });
};

module.exports.connect = connect;
module.exports.insert = insert;
module.exports.get = get;
module.exports.update = update;
module.exports.remove = remove;