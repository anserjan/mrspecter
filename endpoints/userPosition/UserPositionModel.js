const mongoose = require("mongoose")
const User = require("../user/userModel")
const Schema = mongoose.Schema

const UserPosition = new Schema({
  userId: { type: Schema.ObjectId, ref: User, required: true },
  lat: { type: String, required:true }, 
  lng: { type: String, required:true },
  gamesessionId: { type: Schema.ObjectId, ref: "Gamesession", required: true }
  }, { timestamps: true }
)

module.exports = mongoose.model("UserPosition", UserPosition)