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
    User.create(req.body, function(err, user){
        if(err || !user){
            console.log("Fehler beim erstellen " + err)
            return callback(err, null)
        }else{
            console.log("Alles super")
            createSessionToken(user, function (err, token, user) {
                if (token) {
                    res.header("Authorization", "Bearer " + token);
                    const { id, userName, ...partialobject } = user;
                    const subset = { id, userName, auth_token:token};
                    console.log(JSON.stringify(subset))
                    res.status(200).json(subset)
                    
                }
                else {
                    console.log("Token has not been created, Error: " + err);
                    return callback('Username or password wrong' + userID, null)
                }
            })
            return callback(null, user)
        }
    })
}

function updateUser(req, callback) {
    console.log(req);
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