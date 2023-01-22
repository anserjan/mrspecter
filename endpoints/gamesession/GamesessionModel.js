const mongoose = require("mongoose")
const User = require("../user/userModel")
const Schema = mongoose.Schema

const sessionIdValidator = (v) => {
  if (v.length === 5) {
    return true;
  }
  else { return false; }
}

const GamesessionModel = new Schema({
  creator: { type: Schema.ObjectId, ref: User, required: true },
  users: [{ type: Schema.ObjectId, ref: User }],
  gametime: { type: Number, default: 600 },
  huntedRefreshTime: { type: Number, default: 30 },
  starttime: { type: Date, default: null },
  gamestate: { type: String, default: "LOBBY" },
  maximumUsers: { type: Number },
  reason: { type: String },
  borders: [{ lat: String, lng: String }],
  huntedUser: { type: String, default: null },
  sessionId: { type: String, required: true, validate: { validator: sessionIdValidator }, unique: true },
  ruleViolations: [{ userId: { type: Schema.ObjectId, ref: User }, borderViolationTime: Number }],
})

module.exports = mongoose.model("Gamesession", GamesessionModel)