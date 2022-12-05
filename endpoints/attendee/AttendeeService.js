const UserPosition = require("./AttendeeModel")

function createAttendee(userId, gamesessionId){
    data= {
        userId: userId,
        gamesessionId: gamesessionId,
    }
    UserPosition.create(data, (err, position) => {
        if(err){
            return callback(err);
        }
        else{
            return callback(null, position);
        }
    })
}

module.exports = {
    createAttendee,
}