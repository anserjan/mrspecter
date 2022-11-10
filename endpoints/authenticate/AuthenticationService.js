var userService = require('../user/userService')
var userModel = require("../user/userModel")
var jwt = require('jsonwebtoken')
var config = require('config')

function createSessionToken(props, callback) {
  if(!props) {
    return callback("JSON-Body is missing", null, null)
  }
  userService.getUser(props.userName, (err, user) => {
    if(user) {
      user.comparePassword(props.password, (err, isMatch) => {
        if(err) {
          return callback(err, null, null)
        } else if(isMatch){
          var issuedAt = new Date().getTime()
          var expirationTime = config.get('session.timeout')
          var expiresAt = issuedAt + (expirationTime * 1000)
          var privateKey = config.get('session.tokenKey')
          let token = jwt.sign({"user": user.userID, "userName": user.userName, "isAdministrator": user.isAdministrator}, privateKey, {expiresIn: expiresAt, algorithm: 'HS256'})
          return callback(null, token ,user)
        } else {
        return callback("Could not create Session Token", null, null)
        }
      })
    } else {
      return callback("Did not find user", null, null)
    }
  })
}

module.exports = {createSessionToken}