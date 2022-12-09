const mongoose = require("mongoose")
const User = require("../user/userModel")
const Schema = mongoose.Schema


const GamesessionModel = new Schema({
  creator: { type: Schema.ObjectId, ref: User, required: true },
  users: [{type: Schema.ObjectId, ref: User}],
  gametime: { type: Number, default: 5000},
  gamestate: { type: String, default: "lobby"},
  maximumUsers:{ type: Number },
  reason: { type: String },
  borders: [{ lat : String, lng : String }],
  huntedUser: { type: String, default: null },
})

module.exports = mongoose.model("Gamesession", GamesessionModel)