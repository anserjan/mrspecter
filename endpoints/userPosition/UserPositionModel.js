const mongoose = require("mongoose")
const User = require("../user/userModel")
const Schema = mongoose.Schema

const UserPosition = new Schema({
  userId: { type: Schema.ObjectId, ref: User, required: true },
  position: { type: [{ lat: { type: String }, lng: { type: String } }] },
  }, { timestamp: true }
)

module.exports = mongoose.model("UserPosition", UserPosition)