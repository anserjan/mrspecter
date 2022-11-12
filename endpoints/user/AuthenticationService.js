var userService = require('./userService')
var jwt = require("jsonwebtoken");
var config = require("config");
const User = require('./userModel');

function createSessionToken(user, callback) {
    // console.log("AuthenticationService: create Token");
    var privatekey = config.get('session.tokenKey');
    let token = jwt.sign({ "_id": user._id, "userName": user.userName}, privatekey, { algorithm: 'HS256' });
    // console.log("Token create: " + token);
    callback(null, token, user);
}

function isAuthenticated(req, res, next){
    console.log("Validieren des Authorization Key:");
    if (typeof req.headers.authorization!="undefined"){
        // console.log("Headers:" + Object.values(req.headers));
        // console.log("Authorization:" + req.headers.authorization.split(" "));

        let token = req.headers.authorization.split(" ")[1];
        var privateKey = config.get('session.tokenKey');
        // console.log("Token senden:" + token);

        jwt.verify(token, privateKey, {algorithm : "HS256"}, (err, user)=> {
            if (err) {
                return res.status(401).json({error: "Nicht authorisiert"})
            }
            // else if(user._id != req.params.userID){
            //     return res.status(401).json({error: "Cannot change data of another user"})
            // }
            User.findById(user._id, (err, result) => {
                if(!result){ return res.status(401).json({error: "User doesn't exist anymore"}) }
                req.authenticatedUser = {id:user._id, name: user.userName}
                return next();
            })
            
        });
    }else{
        return res.status(401).json({error: "Authorization header missing"})
    }
}


module.exports = {
    createSessionToken,
    isAuthenticated
}