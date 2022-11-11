const mongoose = require("mongoose")
const User = require("../user/userModel")
const Gamemode = require ("../gamemode/GamemodeModel")
const Schema = mongoose.Schema

function arrayLimit(val) {
    return val.length <= 12;
  }

const LobbySchema = new Schema({
  creator: {type: Schema.ObjectId, ref: 'User'},
  gamemode: {type: Schema.ObjectId, ref: 'Gamemode'},
  users: {type: [{ type: Schema.ObjectId, ref: 'User' }], validate: [arrayLimit, 'Max 12 Users']}
}, {timestamps: true} 
)

module.exports = mongoose.model("Lobby", LobbySchema)