const { json } = require("express")
const { createSessionToken } = require("./AuthenticationService")
const User = require("./userModel")


function getUser(userID, callback){
    User.findOne({'_id': userID}, function(err, user){
        if(!user){
            console.log("Fehler bei der Suche " + err)
            return callback('UserID existiert nicht: ' + userID, null)
        }else{
            console.log("Alles super")
            return callback(null, user)
        }
    })
}

function createUser(req, res, callback){
    createID(req.body.userName, (err, userID) => {
        if(err){
            callback(err, null)
        }
        else{
            req.body["userID"] = userID
        console.log("USERID: " + userID)
        User.create(req.body, function(err2, user){
            if(err2 || !user){
                console.log("Fehler beim erstellen " + err2)
                return callback(err2, null)
            }else{
                createSessionToken(user, function (err3, token, user) {
                    if (token) {
                        res.header("Authorization", "Bearer " + token);
                        const { id, userName, userID, ...partialobject } = user;
                        const subset = { id, userID, userName, auth_token:token};
                        return callback(null, subset)
                    }
                    else {
                        console.log("Token has not been created, Error: " + err3);
                        return callback('Username or password wrong' + userID, null)
                    }
                })
                
            }
        })
        }
    })
}

function createID(userName, callback) {
  userID = "#"
  for(let i = 0; i < 4; i++) {
    userID += Math.floor(Math.random() * 9)
  }
  User.findOne({userID: userName + userID}, (err, user) => {
    if(err){
        callback(err, null)
    }
    if(user){
        User.find({userName: userName}, (err2, users) => {
            if(err2){
                return callback(err2, null)
            }
            if(users.length > 999){
                return callback(new Error("no more tags with this name available"))
            }
            else{
                createID(userName)
            }
        })
    }
    else{
         callback(null, userName + userID)
    } 
  })

  
}

function updateUser(req, callback) {
    if(req.params.userID != req.authenticatedUser.id){ return callback("Cannot change data of another user", null) }
    User.findById(req.params.userID, function(err, user) {
        if(!user){
            console.log('Kein user gefunden mit: '+req.params.userID);
            return callback("Kein user gefunden mit der UserID: " + req.params.userID, null);

        }else{
            if(req.body._id){
                return callback("UserID cannot be changed", null)
            }
            Object.assign(user, req.body)
            console.log(req.body)
            user.save(function(err, user) {
                if(err){
                    console.log("Update User save failed")
                    return callback("Saving the object after updating failed", null)
                }else{
                    return callback(null, user);
                }
            });
            
        }
        
    })
}

function deleteUser(req, callback){
    User.findOneAndDelete({'_id': req.params.userID}, function(err, user){
        if(!user){
            console.log("Fehler beim löschen " + err)
            return callback("User kann nicht gelöscht werden da UserID nicht existiert: " + req.params.userID, null)
        }else{
            console.log("Alles super")
            return callback(null, user)
        }
    })
}

module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser
}