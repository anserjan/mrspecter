const Gamesession = require("./GamesessionModel")
<<<<<<< HEAD
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
=======
const Attendees = require("../attendee/AttendeeService")
const PositionData = require("../userPosition/UserPositionModel")
const Attendee = require("../attendee/AttendeeModel")

function getGamesessions(callback){  
    Gamesession.find((err, gamesessions) => {
        if(err){
            return callback(err, null);
        }
        else{
            return callback(null, gamesessions);
        }
    })
}

function joinGamesession(userId, gamesessionId){
    Attendees.createAttendee(userId, gamesessionId);
}

function getGamesession(req, callback){  
    Gamesession.findById(req.params.gamesessionId, (err, gamesession) => {
        if(err){
            return callback(err, null);
        }
        if(gamesession){
            if(!(gamesession.users.includes(req.authenticatedUser.id))){
                gamesession.users.push(req.authenticatedUser.id)
                gamesession.save().then(() => {
                  return callback(null, gamesession)
                })
            }else{
                return callback(null, gamesession);
            }
        }
        else{
            return callback(new Error("404"));
        }
    })
    
}

function updateGamesession(gamesessionId, gamesessionData, callback) {
  Gamesession.findById(gamesessionId, (error, gamesession) => {
    if(error) return callback(error, null)
    if(gamesession) {
      if(gamesessionData.huntedUser) gamesession.huntedUser = gamesessionData.huntedUser
      if(gamesessionData.gametime) gamesession.gametime = gamesessionData.gametime
      if(gamesessionData.borders) gamesession.borders = gamesessionData.borders
      if(gamesessionData.maximumUsers) gamesession.maximumUsers = gamesessionData.maximumUsers
      gamesession.save().then(() => {
        return callback(null, gamesession)
      })
    } else {
      return callback(new Error("unknown gamesessionUpdate problem"), null)
    }
  })
}

function create(req, callback){
    let gamesession_object = {
        ...req.body,
        creator: req.authenticatedUser.id,
        users:[req.authenticatedUser.id]
    }  
    Gamesession.create(gamesession_object, (err, gamesession) => {
        if(err){
            return callback(err, null);
        }
        if(gamesession){
            return callback(null, gamesession);
        }
        else{
            return callback(new Error("Couldn't create"));
        }
    })
}

function deleteGamesession(gamesessionId, callback){  
    Gamesession.deleteOne({'_id': gamesessionId}, (err, res) => {
        if(err){
            return callback(err, null);
        }
        else if (res.deletedCount == 1){
            return callback(null, null);
        }
        else{
            return callback(new Error(404), null)
        }
    })
}

function removeUserFromSession(userId, gamesessionId, callback){
    Gamesession.findById(gamesessionId, (err, gamesession) => {
        if(err){
            return callback(err, null);
        }
        if(gamesession){
            
            index = gamesession.users.indexOf(userId);
            gamesession.users.splice(index);
            gamesession.save().then(() => {
                return callback(null, null);
            })
            
        }
        else{
            return callback(new Error("Couldn't find gamesession"));
        }
    })
}

function changeState(gamesessionId, gamestate, callback){  
    Gamesession.findById(gamesessionId, (err, gamesession) => {
        if(err){
            return callback(err, null);
        }
        if(gamesession){
            gamesession.gamestate = gamestate;
            gamesession.gameFinished = true;
            gamesession.save().then(() => {
                return callback(null, gamesession);
            })
        }
        else{
            return callback(new Error("404"));
        }
    })
}

module.exports = {
    getGamesessions,
    create,
    getGamesession,
    deleteGamesession,
    removeUserFromSession,
    changeState,
    joinGamesession,
    updateGamesession
>>>>>>> main
}