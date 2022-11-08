const {mongoose} = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');

class DB {
    static mongo
    static connected = false
    
    static async connect() {
        if(DB.connected === true) { throw new Error("DB is already running")}
        DB.mongo = await MongoMemoryServer.create();
        const uri = DB.mongo.getUri();
        await mongoose.connect(uri);
        DB.connected = true
    }

    static async close(){
        if(DB.connected === false) { throw new Error("DB is already stopped")}
        await mongoose.connection.close();
        await DB.mongo.stop()
        DB.connected = false
    }

    static async clear(){
        if(!DB.connected) { throw new Error("DB is not running")}
        await mongoose.connection.dropDatabase();
    }
}

module.exports = { DB }