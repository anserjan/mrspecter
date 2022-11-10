const Lobby = require("./LobbyModel")

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

function getLobby(lobbyID, callback){
    
        Lobby.findOne({lobbyId: lobbyID}, (err, lobby) => {
            if(err){
                return callback(err, null)
            }
            else{
                if(lobby){
                    return callback(null, lobby)
                }
                return callback(new Error("no lobby found", null))
            }
        })
}

function createLobby(lobbyData, callback){
        Lobby.create(lobbyData, (err, lobby) => {
            if(err){ 
                return callback(err, null)
            }
            else{
                if(lobby){
                    console.log(lobby)
                    return callback(null, lobby)
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

module.exports = {
    getLobbies,
    getLobby,
    createLobby,
    updateLobby,
    deleteLobby,
}