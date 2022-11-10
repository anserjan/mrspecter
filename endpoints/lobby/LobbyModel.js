var mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const User = require("../user/userModel");
const Schema = mongoose.Schema

const LobbySchema = new mongoose.Schema({
    
    creator: {type: Schema.ObjectId, ref: 'User'},
    gamemode: String,
    users: [{ type: Schema.ObjectId, ref: 'User' }]
    
}, {timestamps: true}
)

const Lobby = mongoose.model("Lobby", LobbySchema);
module.exports = Lobby;