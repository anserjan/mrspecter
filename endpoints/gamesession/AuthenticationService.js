var jwt = require("jsonwebtoken")
var config = require("config")
const User = require('../user/userModel')

function createSessionToken(user, callback) {
  var privatekey = config.get('session.tokenKey')
  let token = jwt.sign({ "_id": user._id, "userName": user.userName}, privatekey, { algorithm: 'HS256' })
  callback(null, token, user);
}

function isAuthenticated(req, res, next){
  if (typeof req.headers.authorization!="undefined"){
    let token = req.headers.authorization.split(" ")[1]
    var privateKey = config.get('session.tokenKey')
    jwt.verify(token, privateKey, {algorithm : "HS256"}, (err, user)=> {
      if (err) return res.status(401).json({error: "Not authorized"})

      User.findById(user._id, (err, result) => {
        if(!result) return res.status(401).json({error: "User doesn't exist anymore"})
        req.authenticatedUser = {id:user._id, name: user.userName}
        return next()
      })
    })
  } else {
    return res.status(401).json({error: "Authorization header missing"})
  }
}


module.exports = {
    createSessionToken,
    isAuthenticated
}