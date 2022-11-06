
const mongoose = require("mongoose");
const client = require("mongodb").MongoClient;
const config = require("config");
let _db;

function initDb(callback) {
    if (_db) {
        return callback(null, _db);
    }

    else{
        mongoose.connect(config.db.connectionString);
    }

    client.connect(config.db.connectionString, config.db.connectionOptions, connected); function connected(err, db) {
    if (err) {
        return callback(err);
    }
    console.log("DB initialized - connected to: " + config.db.connectionString);
    _db = db;
    return callback(null, _db);
    }
}
function getDb() {
    return _db;
}


module.exports = {
getDb,
initDb
};