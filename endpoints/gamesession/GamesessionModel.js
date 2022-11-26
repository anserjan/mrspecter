const mongoose = require("mongoose")
const User = require("../user/userModel")
const Gamemode = require ("../gamemode/GamemodeModel")
const UserPosition = require("../userPosition/UserPositionModel")
const Schema = mongoose.Schema

const GamesessionModel = new Schema({
  gamemode: { type: Schema.ObjectId, ref: Gamemode, required: true },
  users: { type: [{ type: Schema.ObjectId, ref: User }] },
  userPositions: { type: Schema.ObjectId, ref: UserPosition, required: true },
  gameFinished: { type: boolean }
})

module.exports = mongoose.model("Gamesession", GamesessionModel)