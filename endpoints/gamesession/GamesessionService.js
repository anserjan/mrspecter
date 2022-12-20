const Gamesession = require("./GamesessionModel")
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
    Gamesession.findOne({"sessionId": req.params.gamesessionId}, (err, gamesession) => {
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
  Gamesession.findOne({"sessionId": gamesessionId}, (error, gamesession) => {
    if(error) return callback(error, null)
    if(gamesession) {
      if(gamesessionData.huntedUser) gamesession.huntedUser = gamesessionData.huntedUser
      if(gamesessionData.gametime) gamesession.gametime = gamesessionData.gametime
      if(gamesessionData.borders) gamesession.borders = gamesessionData.borders
      if(gamesessionData.maximumUsers) gamesession.maximumUsers = gamesessionData.maximumUsers
      if(gamesessionData.huntedRefreshTime) gamesession.huntedRefreshTime = gamesessionData.huntedRefreshTime
      gamesession.save().then(() => {
        return callback(null, gamesession)
      })
    } else {
        console.log("HUHHHHH")
      return callback(new Error("unknown gamesessionUpdate problem"), null)
    }
  })
}

function create(req, callback){
    let gamesession_object = {
        ...req.body,
        creator: req.authenticatedUser.id,
        users:[req.authenticatedUser.id],
        huntedUser: req.authenticatedUser.id
    } 
    createGenerateValue(0, (sessionId) => {
        if(sessionId == null){
            return callback(new Error("Sessions full"));
        }
        else{
            gamesession_object.sessionId = sessionId;
            Gamesession.create(gamesession_object, (err, gamesession) => {
                if(err){
                    return callback(err, null);
                }
                if(gamesession){
                    return callback(null, gamesession)
                }
                else{
                    return callback(new Error("Couldn't create"));
                }
            })
        }
    })
    
}

function createGenerateValue(count, callback){
    if(count== 100000){
        return callback(null);
    }
    else{
        let1 = Math.floor(Math.random() * 10);
    let2 = Math.floor(Math.random() * 10);
    let3 = Math.floor(Math.random() * 10);
    let4 = Math.floor(Math.random() * 10);
    let5 = Math.floor(Math.random() * 10);
    id = ""+let1+""+let2+""+let3+""+let4+""+let5;

    Gamesession.findOne({"sessionId": id}, (err, session) => {
        if(err){
            return callback(null);
        }
        if(session){
            return createGenerateValue(count++);
        }
        else{
            return callback(id);
        }
    })
    }
    
}

function deleteGamesession(gamesessionId, callback){  
    Gamesession.deleteOne({'sessionId': gamesessionId}, (err, res) => {
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
    Gamesession.findOne({'sessionId': gamesessionId}, (err, gamesession) => {
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

function changeState(gamesessionId, gamestate, reason, callback){  
    Gamesession.findOne({'sessionId': gamesessionId}, (err, gamesession) => {
        if(err){
            return callback(err, null);
        }
        if(gamesession){
            gamesession.gamestate = gamestate;
            if(gamestate == "RUNNING"){
                gamesession.starttime = Date.now()
            }
            if(reason)gamesession.reason = reason;
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
}