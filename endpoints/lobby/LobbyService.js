const Lobby = require("./LobbyModel")
const userService = require("../user/userService")
const GamemodeService = require("../gamemode/GamemodeService")
const User = require("../user/userModel")

function getLobbies(callback){
    Lobby.find((err, lobbies) => {
        if(err){
            return callback(err, null)
        }
        else{
            if(lobbies){
                return callback(null, lobbies)
            }
            else{
                return callback(new Error("Something went wrong", null))
            }
        }
    })
}

function getLobby(userID, lobbyID, callback){
        Lobby.findOne({_id: lobbyID}, (err, lobby) => {
            if(err){
                return callback(err, null)
            }
            else{
                if(lobby){
                    userService.getUser({_id: userID}, (err, user) => {
                        if(err){
                            return callback(err, null)
                        }
                        if(user){
                            //ObjectId('...')
                            if(!lobby.users.includes(user._id) && lobby.users.length < 13){
                                lobby.users.push(user)
                                lobby.save().then(() => {
                                    return callback(null, lobby)
                                })
                            }
                            else{
                                return callback(null, lobby)
                            }
                        }
                        else{
                            return callback(new Error("Something went wrong"), null)
                        }
                    })
                }
                else{
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
          return callback(null, lobby)
        })
      } else {
        return callback(lobbyError, null)
      }  
    })
  })
}

function updateLobby(lobbyID, lobbyData, callback){
        Lobby.findById(lobbyID, (err, lobby) => {
            if(err){
                return callback(err, null)
            }
            else{
                if(lobby){
                    lobby.update(lobbyData)
                    lobby.save().then(() => {
                        return callback(null, lobby)
                    })
                }
                else{
                return callback(new Error("no lobby found"))
                }
                
            }
        })
}

function deleteLobby(lobbyID, callback){
    //hier spaeter nochmal schauen, ob gesuchte Lobby auch existiert, damit 404 geworfen werden kann falls nicht
        Lobby.deleteOne({lobbyID: lobbyID}, (err, result) => {
            if(err){
                return callback(err, null)
            }
            else{
                return callback(null, ":D")
            }
        })
}

function leaveLobby(userID, lobbyID, callback){
    Lobby.findById(lobbyID, (err, lobby) => {
        if(err){
            return callback(err, null)
        }
        else if(lobby){
            console.log("CREATOR: " + lobby.creator + "\nUSERID: "+userID)
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