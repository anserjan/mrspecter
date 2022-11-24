const Lobby = require("./LobbyModel")
const userService = require("../user/userService")
const GamemodeService = require("../gamemode/GamemodeService")

function getLobbies(callback){
  Lobby.find((err, lobbies) => {
      if(err) {
        return callback(err, null)
      } else {
        if(lobbies){
          return callback(null, lobbies)
        } else {
          return callback(new Error("Something went wrong", null))
        }
      }
  })
}

function getLobby(userID, lobbyID, callback){
  Lobby.findOne({_id: lobbyID}, (err, lobby) => {
    if(err) {
      return callback(err, null)
    } else {
      if(lobby){
        userService.getUser({_id: userID}, (err, user) => {
          if(err) return callback(err, null)
          if(!lobby.users.includes(user._id) && lobby.users.length < 13){
              lobby.users.push(user)
              lobby.save().then(() => {
                GamemodeService.getGamemode(lobby.gamemode, (error, gamemode) => {
                  if(error) return callback(error, null)
                  if(gamemode) {
                    return callback(
                      null,
                      {
                        _id: lobby._id,
                        creator: lobby.creator,
                        gamemode: gamemode,
                        maximumUsers: lobby.maximumUsers,
                        users: lobby.users
                      }
                    )
                  }
                })
              })
            } else {
            return callback(null, lobby)
          }
        })
      } else {
        return callback(new Error("no lobby found", null))
      }
    }
  })
}

function createLobby(userID, callback){
  GamemodeService.createGamemode((gamemodeError, gamemode) => {
    if(gamemodeError) return callback(gamemodeError, null)
    Lobby.create({creator: userID, gamemode: gamemode}, (lobbyError, lobby) => {
      if(lobbyError) return callback("Could not create lobby. " + lobbyError, null)
      if(lobby){
        lobby.users.push(userID)
        lobby.save().then(() => {
          GamemodeService.getGamemode(lobby.gamemode, (error, gamemode) => {
            if(error) return callback(error, null)
            if(gamemode) {
              return callback(
                null,
                {
                  _id: lobby._id,
                  creator: lobby.creator,
                  gamemode: gamemode,
                  maximumUsers: lobby.maximumUsers,
                  users: lobby.users
                }
              )
            }
          })  
        })
      } else {
        return callback(lobbyError, null)
      }  
    })
  })
}

function updateLobby(lobbyID, lobbyData, callback){
  Lobby.findById(lobbyID, (err, lobby) => {
    if(err) return callback(err, null)
    if(lobby) {
      lobby.update(lobbyData)
      lobby.save().then(() => {
        GamemodeService.updateGamemode(lobby.gamemode, lobbyData.gamemode, (error, gamemode) => {
          if(error) return callback(error, null)
          return callback(
            null,
            {
              _id: lobby._id,
              creator: lobby.creator,
              gamemode: gamemode,
              maximumUsers: lobby.maximumUsers,
              users: lobby.users
            }
          )
        })
      })
    } else {
      return callback(new Error("Error no Lobby"))
    }
  })
}

function deleteLobby(lobbyID, callback){
  Lobby.findOneAndDelete({_id: lobbyID}, (err, result) => {
    if(err) {
      return callback(err, null)
    } else {
      return callback(null, result)
    }
  })
}

function leaveLobby(userID, lobbyID, callback){
    Lobby.findById(lobbyID, (err, lobby) => {
        if(err){
            return callback(err, null)
        }
        else if(lobby){
            if(lobby.creator == userID){
                Lobby.deleteOne({_id: lobbyID}, (err, result) => {
                    if(err){
                        return callback(err, null)
                    }
                    else{
                        return callback(null, result)
                    }
                })
            }
            else if(lobby.users.includes(userID)){
                lobby.users.remove(userID)
                lobby.save().then(() => {
                    return callback(null, "Left Lobby")
                })
            }
            else{
                return callback(new Error("Cannot Leave Lobby/Not A Lobby Member"))
            }
        }
        else{
            return callback(new Error("No Lobby Found"), null)
        }
    })
}

module.exports = {
    getLobbies,
    getLobby,
    createLobby,
    updateLobby,
    deleteLobby,
    leaveLobby,
}