var mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    lobby: {
        type: Schema.Types.ObjectId, ref: 'Lobby'
    }
    // image: String
}, {timestamps: false});


const User = mongoose.model("User", UserSchema)

module.exports = User;