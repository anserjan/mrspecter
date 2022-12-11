const UserPosition = require("./UserPositionModel")

function updatePosition(data, callback) {
  // first check for any position of this user in this gamesession
  // if not create and get all other
  // if yes update current and get all other
  UserPosition.find({gamesessionId: data.gamesessionId}, (error, userPositions) => {
    if(error) return callback(error, null)
    if(userPositions.length  > 0) {
      // check if user has one position in this array if yes update
      const oldPositionOfCurrentUser = userHasPosition(data.userId, userPositions)
      if(oldPositionOfCurrentUser) {
        // update position and get a list of all positions again
        UserPosition.findOneAndUpdate({_id: oldPositionOfCurrentUser._id}, {lat: data.lat, lng: data.lng}, (error, userPosition) => {
          if(error) return callback(error, null)
          UserPosition.find({gamesessionId: data.gamesessionId}, (error, updatedUserPositions) => {
            if(error) return callback(error, null)
            updatedUserPositions = removeAttributesFromList(updatedUserPositions)
            return callback(null, updatedUserPositions)
          })
        })
      } else {
        // create new user position and push into user position list
        UserPosition.create({gamesessionId: data.gamesessionId, lat: data.lat, lng: data.lng, userId: data.userId}, (error, newUserPosition) => {
          if(error) return callback(error, null)
          userPositions.push(newUserPosition)
          userPositions = removeAttributesFromList(userPositions)
          return callback(null, userPositions)
        })
      }
    } else {
      // when no userPositions for gameSession present just create one and send it as an array.length = 1
      UserPosition.create({gamesessionId: data.gamesessionId, userId: data.userId, lat: data.lat, lng: data.lng}, (error, newPosition) => {
        if(error) return callback(error, null)
        userPositions = removeAttributesFromList([newPosition])
        return callback(null, userPositions)
      })
    }
  })
}

function userHasPosition(userId, positionList) {
  if(positionList.length == 0) return null
  for(const position of positionList) {
    if(userId === position.userId.toString()) return position
  }
  return null
}

function removeAttributesFromList(positionList) {
  const returnList = []
  for(let i = 0; i < positionList.length; i++) {
    returnList[i] = {
      lat: positionList[i].lat,
      lng: positionList[i].lng,
      userId: positionList[i].userId
    }
  }
  return returnList
}

module.exports = {
  updatePosition,
}