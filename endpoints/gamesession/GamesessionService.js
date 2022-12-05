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

function getGamesession(gamesessionId, callback){  
    Attendee.find({gamesessionId: gamesessionId}, (err, attendees) => {
        if(err){
            return callback(err, null);
        }
        if(attendees){
            arrayAttendees = [];
            for(let attendee in attendees){
                arrayAttendees.push(attendee.userId);
            }
            PositionData.find({gamesessionId: gamesessionId}, (err2, positions) => {
                if(err2){
                    return callback(err2)
                }
                else if(positions){
                    newestpositions = []
                    for(let attendee in attendees){
                        let tempPos = [];
                        for(let pos in positions){
                            if(pos.userId === attendee.userId){
                                tempPos.push(pos);
                            }
                        }
                        sort(function compareFn(a, b) {
                            if (a.createdAt < b.createdAt) {
                                return -1;
                              }
                            if (a.createdAt > b.createdAt) {
                                return 1;
                            }
                            return 0;
                        }).then(() => {
                            newestPositions.push(tempPos[tempPos.length-1]);
                        })
                    }
                    return callback(null, newestPositions);
                }
                else{
                    return callback(new Error("404"));
                }
            })
        }
        else{
            return callback(new Error("404"));
        }
    })
    
}

function create(gamesessionContent, callback){  
    Gamesession.create(gamesessionContent, (err, gamesession) => {
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
}