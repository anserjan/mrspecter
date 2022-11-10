var mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
  userID: {type: String, unique: true},
  userName: {type: String, required: true},
  password: String,
  isAdministrator: {type: Boolean, default: false},
  lobby: {
      type: Schema.Types.ObjectId, ref: 'Lobby'
  }
  // image: String
}, {timestamps: false});

UserSchema.pre('save', function(next) {
  let user = this
  if(!user.isModified('password')) return next()
  bcrypt.hash(user.password, 10).then((hashedPassword) => {
    user.password = hashedPassword
    next()
  }, (err) => {
    next(err)
  })
})

UserSchema.methods.comparePassword = function (candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if(err) {
      return next(err)
    } else {
      next(null, isMatch)
    }
  })
}

module.exports = mongoose.model("User", UserSchema);