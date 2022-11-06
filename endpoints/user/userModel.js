var mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    userName: {type: String, required: true}
    // image: String
}, {timestamps: false});


const User = mongoose.model("User", UserSchema)

module.exports = User;