const UserPosition = require("./UserPositionModel")

function updatePosition(data){
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
    updatePosition,
}