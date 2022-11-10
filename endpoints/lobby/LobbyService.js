const Lobby = require("./LobbyModel")
const userService = require("../user/userService")
const User = require("../user/userModel")

function getLobbies(callback){
    Lobby.find((err, lobbies) => {
        if(err){
            return callback(err, null)
        }
        else{
            if(lobbies){
                console.log(lobbies)
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
                    console.log(lobby)
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

function createLobby(userID, lobbyData, callback){
        Lobby.create(lobbyData, (err, lobby) => {
            if(err){ 
                return callback(err, null)
            }
            else{
                if(lobby){
                    User.findById(userID, (err, user) => {
                        lobby.users.push(user)
                        lobby.creator = user
                        lobby.save().then(() => {
                            console.log(lobby)
                            return callback(null, lobby)
                        })
                    })
                }
                else{
                    return callback(err, null)
                }
            
            }
        })
}

function updateLobby(lobbyID, lobbyData, callback){
        Lobby.findById(lobbyID, (err, lobby) => {
            if(err){
                console.log(err)
                return callback(err, null)
            }
            else{
                if(lobby){
                    console.log(lobby)
                    //Hier evtl noch auf "nur "gamemode" spezifizieren
                    for(data in lobbyData){
                        lobby[data] = lobbyData[data]
                    }
    
                    lobby.save().then(() => {
                        console.log(lobby)
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