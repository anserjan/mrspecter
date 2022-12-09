const UserPosition = require("./UserPositionModel")
const GamesessionService = require("../gamesession/GamesessionService")

function updatePosition(data, callback) {
  // first check for any position of this user in this gamesession
  // if not create and get all other
  // if yes update current and get all other
  UserPosition.find({gamesessionId: data.gamesessionId}, (firstError, userPositions) => {
    if(firstError) return callback(firstError, null)
    if(userPositions.length  > 0) {
      // get the existing positions

      // userPositions.find({userId: data.userId}, (secondError, userPosition) => {
      //   if(secondError) return callback(secondError, null)
      //   if(userPosition) {
      //     userPosition.let = data.lag
      //     userPosition.lng = data.lag
      //     userPosition.save().then(() => {
      //       console.log("userPosition is " +userPosition)
      //       return callback(null,null)
      //     })
      //   }
      // })
      return callback(null,[])
    } else {
      // when no userPositions for gameSession present just create one and send it as an array.length = 1
      UserPosition.create({gamesessionId: data.gamesessionId, userId: data.userId, lat: data.lat, lng: data.lng}, (thirdError, newPosition) => {
        if(thirdError) return callback(thirdError, null)
        return callback(null, [{lat: newPosition.lat, lng: newPosition.lng, userId: newPosition.userId}])
      })
    }
  })
}

function getAllPositions(gamesessionId, callback) {
  UserPosition.find({gamesessionId: gamesessionId}, (error, positions) => {
    console.log(positions)
    if(error) return callback(error, null)
    returnPositionList = []
    for(const position of positions) {
      returnPositionList.push({lat: position.lat, lng: position.lng, userId: position.userId})
    }
    return callback(null, returnPositionList)
  })
}

module.exports = {
    updatePosition,
}