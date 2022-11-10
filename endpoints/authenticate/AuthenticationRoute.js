const express = require('express')
const router = express.Router()
const authenticationService = require('./AuthenticationService')

router.get("/", (req, res, next) => {
  if(!req.headers.authorization || req.headers.authorization.indexOf("Basic") === -1) {
    res.status(401)
    res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"')
    return res.json({error: "Missing authorization header"})
  } else {
    const base64Credentials = req.headers.authorization.split(" ")[1]
    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii")
    const [userID, password] = credentials.split(":")

    authenticationService.createSessionToken({userID, password}, (err, token, user) => {
      if(!user) {
        return res.status(401).json({error: "Invalid authorization credentials"})
      } else {
          res.setHeader("Authorization", "Bearer " + token)
        return res.status(200).json({userID: user.userID, userName: user.userName, isAdministrator: user.isAdministrator})
      }
    })
  }
})

router.post("/login", (req, res, next) => {
  authenticationService.createSessionToken(req.body, (err, token, user => {
    if(token) {
        res.header("Authorization", "Bearer " + token)
        if(user) {
          const {id, userID, userName, ...partialObject} = user
          const subset = {id, userID, userName }
          console.log(JSON.stringify(subset))
          res.send(subset)
        } else {
          logger.error("User is null, even though a tokan has been created. Error: " + err)
          res.send(subset)
        }
    } else {
      res.send("Could not create token")
    }
  }))
})


module.exports = router