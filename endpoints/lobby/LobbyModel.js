var mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const User = require("../user/userModel");
const Schema = mongoose.Schema

function arrayLimit(val) {
    return val.length <= 12;
  }

const LobbySchema = new mongoose.Schema({
    
    creator: {type: Schema.ObjectId, ref: 'User'},
    gamemode: String,
    users: {type: [{ type: Schema.ObjectId, ref: 'User' }], validate: [arrayLimit, 'Max 12 Users']}
    
}, {timestamps: true} 
)

const Lobby = mongoose.model("Lobby", LobbySchema);
module.exports = Lobby;