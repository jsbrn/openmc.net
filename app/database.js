var MongoClient = require('mongodb').MongoClient;
var database;

function connect() {
    var url = "mongodb+srv://"
        +process.env.MONGODB_USERNAME+":"
        +process.env.MONGODB_PASSWORD
        +"@cluster0-j4cuz.mongodb.net/test?retryWrites=true";
    MongoClient.connect(url, function(err, db) {
        if (err) { console.log("Error connecting to database at URL "+url+" : "+err.message); return; }
        database = db.db("openmc");
        console.log("Connected to database!");
    });
}

function update(collectionName, query, new_values, onSuccess, onFailure) {
    var collection = database.collection(collectionName);
    collection.update(query, {$set: new_values}, function(err, docs) {
        if (err) { 
            console.log(err.message); 
            onFailure();
        } else {
            onSuccess(docs);
        }
    });
}

function insert(collectionName, entries, onSuccess, onFailure) {
    var collection = database.collection(collectionName);
    collection.insertMany(entries, function(err, docs) {
        if (err) { 
            console.log(err.message); 
            onFailure();
        } else {
            onSuccess(docs);
        }
    });
};

function get(collectionName, findQuery, sortQuery, limit, onSuccess, onFailure) {
    // Get the collection
    var collection = database.collection(collectionName);
    // Find some entries that match
    collection.find(findQuery)
        .sort(sortQuery)
        .limit(limit < 0 ? Number.MAX_SAFE_INTEGER : limit)
        .toArray(function(err, docs) {
            if (err) { 
                console.log(err.message); 
                onFailure();
            } else {
                onSuccess(docs);
            }
    });
};

function remove(collectionName, query, onSuccess, onFailure) {
    var collection = database.collection(collectionName);
    collection.deleteMany(query, function(err, docs) {
        if (err) { 
            console.log(err.message); 
            onFailure();
        } else {
            onSuccess(docs);
        }
    });
};

function exists(collectionName, query, callback) {
    database.get("players", {uuid: request.params.uuid}, {username: -1}, 1, (docs) => { if (docs.length > 0) callback(docs[0]); });
}

module.exports.connect = connect;
module.exports.insert = insert;
module.exports.get = get;
module.exports.update = update;
module.exports.remove = remove;