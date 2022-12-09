const mongoose = require("mongoose")
const User = require("../user/userModel")
const Gamesession = require("../gamesession/GamesessionModel")
const Schema = mongoose.Schema

const AttendeeModel = new Schema({
    userId: { type: Schema.ObjectId, ref: User, required: true },
    gamesessionId: { type: Schema.ObjectId, ref: Gamesession, required: true },
    isHunted: { type: Boolean, required: true, default: false },
  })
  
  module.exports = mongoose.model("Attendee", AttendeeModel)