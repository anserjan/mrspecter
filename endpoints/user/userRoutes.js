const express = require("express");
const router = express.Router();

const userService = require("./userService")
const {isAuthenticated} = require("./AuthenticationService")


router.get('/:userID', (req, res, next) => {
	userService.getUser(req.params.userID, function(err, result){
        // console.log("Result: " + result)
        if(result){
            const {name, ...partialobject } = result;
            const subset = {name};
            res.status(200).json(subset)
        }else{
            res.status(404).json({"Error": err})
        }
    })
});

router.post('/', (req, res, next) => {
    if(!req.body.name){
        res.status(400).json({"Error": "name field missing in body"})
    } 
    else{
        userService.createUser(req, res, function(err, result){
            // console.log("Result: " + result)
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
        // console.log("Result: " + result)
        if(result){
            const {id, name, ...partialobject } = result;
            const subset = {id, name};
            res.status(200).json(subset)
        }else{
            res.status(400).json({"Error": err})
        }
    })
});

router.delete('/:userID', isAuthenticated, (req, res, next) => {
    userService.deleteUser(req, function(err, result){
        // console.log("Result: " + result)
        if(result){
            res.status(200).json()
        }else{
            //Should never happen
            res.status(400).json({"Error": err})
        }
    })
});

module.exports = router;