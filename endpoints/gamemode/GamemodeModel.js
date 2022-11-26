const mongoose = require("mongoose")
const User = require("../user/userModel")
const Schema = mongoose.Schema

// gametime is saved as "amount of seconds"
const GamemodeModel = new Schema({
  huntedUser: { type: Schema.ObjectId, ref: User },
  gameBorders: { type: [{ lat: { type: String }, lng: { type: String } }] },
  gametime: { type: Number },
}, { timestamp: true })

module.exports = mongoose.model("Gamemode", GamemodeModel)