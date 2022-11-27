const Gamesession = require("./GamesessionModel")
const Users = require("../user/userModel");
const PositionData = require("../userPosition/UserPositionModel")

function getGamesessions(callback){  //check
    Gamesession.find((err, gamesessions) => {
        if(err){
            return callback(err, null);
        }
        else{
            return callback(null, gamesessions);
        }
    })
}

function getGamesession(gamesessionId, callback){  //check
    Gamesession.findById(gamesessionId, (err, gamesession) => {
        if(err){
            return callback(err, null);
        }
        if(gamesession){
            return callback(null, gamesession);
        }
        else{
            return callback(new Error("Couldn't find gamesession"));
        }
    })
}

function create(gamesessionContent, callback){  //check
    Gamesession.create(gamesessionContent, (err, gamesession) => {
        if(err){
            console.log("undefined error")
            return callback(err, null);
        }
        if(gamesession){
            console.log("gamesession")
            return callback(null, gamesession);
        }
        else{
            console.log("404")
            return callback(new Error("Couldn't create"));
        }
    })
}

function deleteGamesession(gamesessionId, callback){  //check
    Gamesession.deleteOne({'_id': gamesessionId}, (err, res) => {
        if(err){
            console.log(err)
            return callback(err, null);
        }
        else if (res.deletedCount == 1){
            console.log(res)
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
            Users.findById(userId, (uerr, user) => {
                if(uerr){
                    return err;
                }
                if(user){
                    index = gamesession.users.indexOf(user);
                    gamesession.users.splice(index);
                    gamesession.save().then(() => {
                        console.log(gamesession); //kann nach debuggen raus
                        return callback(null, null);
                    })
                }
                else{
                    return callback(new Error("no user found"));
                }
            })
            
        }
        else{
            return callback(new Error("Couldn't find gamesession"));
        }
    })
}

function endGame(gamesessionId, reason, callback){  //check
    Gamesession.findById(gamesessionId, (err, gamesession) => {
        if(err){
            return callback(err, null);
        }
        if(gamesession){
            gamesession.reason = reason;
            gamesession.gameFinished = true;
            gamesession.save().then(() => {
                return callback(null, gamesession);
            })
        }
        else{
            console.log("huh")
            return callback(new Error("404"));
        }
    })
}

function updatePositionData(userId, positionData, callback){
    PositionData.find({'userId' : userId}, (err, pos) => {
        if(err){
            return err;
        }
        if(pos){
            pos.position.push(positionData);
            pos.save().then( () => {
                return callback(null, null);
            }  
            )
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
    updatePositionData,
    endGame,
}