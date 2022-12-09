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
            UserPosition.find({gamesessionId: gamesessionId}, (err, attendees) => {
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
    })
}

module.exports = {
    createAttendee,
}