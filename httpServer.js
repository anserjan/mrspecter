const express = require('express')
const testRoutes = require("./endpoints/test/testRoutes")
const userRoutes = require("./endpoints/user/userRoutes")
const lobbyRoutes = require("./endpoints/lobby/LobbyRoutes")
const gamesessionRoutes = require("./endpoints/gamesession/GamessessionRoutes")
const database = require('./database/db')

const app = express()
const port = 8080
const User = require('./endpoints/user/userModel')

// var server = http.createServer(app);

app.use(express.json())

app.use('/', testRoutes);
app.use('/user', userRoutes)
app.use('/lobby', lobbyRoutes)
app.use('/gamesession', gamesessionRoutes)


database.initDb(function(err, db){
  if(db){
    createAdmin()
    startExpressServer()
  }
  else{
    console.warning("ERROR: "+err)
  }
})


function startExpressServer(){
  app.listen(port, () => console.info(`Example app listening on http://localhost:${port}!`))
}


function createAdmin() {
  User.findOne({userID: "admin"}, (err, doc) => {
    if(err) {
      console.log("Could not create admin" + err)
    } else if(doc) {
      console.log("Failed to create admin. Admin already exists")
    } else {
      User.create(
        {
          "userID": "admin",
          "userName": "admin",
          "password": "123",
          "isAdministrator": true
        }, (error) => {
          if(error) {
            console.log("Could not create admin user " + error)
          } else {
            console.info("Created admin user")
          }
        }
      )
    }
  })
}
// server.listen(443,() => console.log(`HttpServer listening on https://localhost!`));