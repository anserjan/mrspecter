const express = require("express");
const router = express.Router();

const userService = require("./userService")
const {isAuthenticated} = require("./AuthenticationService")


router.get('/:userID', (req, res, next) => {
	userService.getUser(req.params.userID, function(err, result){
        if(result){
            const {userName, ...partialobject } = result;
            const subset = {userName};
            res.status(200).json(subset)
        }else{
            res.status(404).json({"Error": err})
        }
    })
});

router.post('/', (req, res, next) => {
    if(!req.body.userName){
        res.status(400).json({"Error": "userName missing in body"})
    } 
    else{
        userService.createUser(req, res, function(err, result){
            if(result){
                res.status(200).json(result)
            }else{
                res.status(400).json({"Error": err})
            }
        })
    }
});

router.put('/:userID', isAuthenticated,(req, res, next) => {
    userService.updateUser(req, function(err, result){
        if(result){
            const {id, userName, ...partialobject } = result;
            const subset = {id, userName};
            res.status(200).json(subset)
        }else{
            res.status(400).json({"Error": err})
        }
    })
});

router.delete('/:userID', isAuthenticated, (req, res, next) => {
    userService.deleteUser(req, function(err, result){
        if(result){
            res.status(200).json()
        }else{
            //Should never happen
            res.status(400).json({"Error": err})
        }
    })
});

module.exports = router;