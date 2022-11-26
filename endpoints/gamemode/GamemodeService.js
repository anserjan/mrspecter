const Gamemode = require("./GamemodeModel")

function getGamemode(gamemodeID, callback) {
  Gamemode.findOne({_id: gamemodeID}, (error, gamemode) => {
    if(error) {
      callback(error, null)
    } else {
      if(gamemode) {
        callback(null, gamemode)
      } else {
        callback(new Error("no gamemode found"), null)
      }
    }
  })
}

function createGamemode(callback) {
  Gamemode.create({}, (error, gamemode) => {
    if(error) return callback(error, null)
    if(gamemode) {
      return callback(null, gamemode)
    } else {
      return callback(new Error("Could not create gamemode. ", null))
    }
  })
}

function updateGamemode(gamemodeID, gamemodeData, callback) {
  Gamemode.findById(gamemodeID, (error, gamemode) => {
    if(error) return callback(error, null)
    if(gamemode) {
      if(gamemodeData.huntedUser) gamemode.huntedUser = gamemodeData.huntedUser
      if(gamemodeData.gameBorders) gamemode.gameBorders = gamemodeData.gameBorders
      if(gamemodeData.gametime) gamemode.gametime = gamemodeData.gametime
      gamemode.save().then(() => {
        return callback(null, {
          _id: gamemode._id,
          huntedUser: gamemode.huntedUser,
          gameBorders: gamemode.gameBorders,
          gametime: gamemode.gametime
        })
      })
    } else {
      return callback(new Error("Could not find gamemode", null))
    }
  })
}

function deleteGamemode(gamemodeID, callback) {
  Gamemode.deleteOne({_id: gamemodeID}, (error, result) => {
    if(error) return callback(error, null)
    if(result) {
      return callback(null, result)
    } else {
      return callback(new Error("Could not delete gamemode"), null)
    }
  })
}

function validatePosition(gamemodeID, currentGPS, callback) {

}

// Return true if game can continiue, false if time is over
function validateTime(gamemodeID, callback) {
  Gamemode.findById(gamemodeID, (error, gamemode) => {
    if(error) return callback(error, null)
    if(gamemode) {
      if(gamemode.created_at.add(gamemode.gametime, "s") > new Date()) {
        return callback(null, false)
      } else {
        return callback(null, true)
      }
    } else {
      return callback(new Error("Could not find gamemode"), null)
    }
  })
}

module.exports = { getGamemode, createGamemode, updateGamemode }