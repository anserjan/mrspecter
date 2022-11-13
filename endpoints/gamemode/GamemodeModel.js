const mongoose = require("mongoose")
const Lobby = require("../lobby/LobbyModel")
const User = require("../user/userModel")
const Schema = mongoose.Schema

// gametime is saved as "amount of seconds"
const GamemodeModel = new Schema({
  // lobby: { type: Schema.ObjectId, ref: "Lobby" },
  huntedUser: { type: Schema.ObjectId, ref: User },
  gameBorders: { type: [{ lat: { type: String }, lng: { type: String } }] },
  gametime: Number,
}, { timestamp: true })

module.exports = mongoose.model("Gamemode", GamemodeModel)