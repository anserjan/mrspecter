const mongoose = require("mongoose")

// gametime is saved as "amount of seconds"
const GamemodeModel = new mongoose.Schema({
  mrx: { type: String, required: true },
  gameBorders: { type: [{ lat: { type: String }, lng: { type: String } }] },
  gametime: Number,
}, { timestamp: true })

module.exports = mongoose.model("Gamemode", GamemodeModel)