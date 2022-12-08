const mongoose = require("mongoose")
const User = require("../user/userModel")
const Gamemode = require ("../gamemode/GamemodeModel")
const UserPosition = require("../userPosition/UserPositionModel")
const Schema = mongoose.Schema


const GamesessionModel = new Schema({
  creator: { type: Schema.ObjectId, ref: User, required: true },
  gametime: { type: int, default: 5000},
  gamestate: { type: string, default: "lobby"},
  maximumUsers:{ type: Number },
  reason: { type: String },
  borders: [{ lat : String, lng : String }],
  huntedUser: { type: string },
})

module.exports = mongoose.model("Gamesession", GamesessionModel)