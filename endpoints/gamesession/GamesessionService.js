const Gamesession = require("./GamesessionModel")
const Lobby = require("../lobby/LobbyModel")

function getGamesessions() {
  Gamesession.find((error, gamesessions) => {
    if(error) return callback (err, null)
    if(gamesessions) return callback(null, gamesessions)
    return callback(new Error("Something went wrong"), null)
  })
}

function createGamesession(gamesessionData) {
  Lobby.findOne({_id: gamesessionData.lobby}, (error, lobby) => {
    if(error) return callback(error, null)
    Gamesession.create({
      gamemode: lobby.gamemode,
      users: lobby.users
    }, (error, gamesession) => {
      if(error) return callback(error, null)
      if(gamesession) {
        return callback(
          null,
          {
            _id: gamesession._id,  
            gamemode: gamesession.gamemode,
            users: gamesession.users
          }
        )
      }
    })
  })
}

module.exports = { 
  getGamesessions,
  createGamesession
}