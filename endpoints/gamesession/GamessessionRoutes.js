const express = require("express")
const router = express.Router()
const GamesessionService = require("./Gamesessionservice")
const { isAuthenticated } = require("./AuthenticationService")


router.post('/', isAuthenticated, (req, res) => {
	console.log(req.body)
	console.log("hi")
	GamesessionService.create(req.body, (error, gamesession) => {
    if(error){
		return res.status(500).json({error: error})
	}
	if(gamesession){
		console.log(gamesession)
		return res.status(201).json(gamesession)
	}
	else{
		return res.sendStatus(400);
	}
    
  })
})

router.get('/:gamesessionId', isAuthenticated, (req, res) => {
	GamesessionService.getGamesession(req.params.gamesessionId, (error, gamesession) => {
		if(error){
			if(error.message == "404"){
				return res.sendStatus(404);
			}
			else
			{return res.status(500).json({error: error});}
		}
		if(gamesession){
			return res.status(200).json({gamesession: gamesession});
		}
		else{
			return res.sendStatus(404);
		}
	  })
})

router.delete('/:gamesessionId', isAuthenticated, (req, res) => {
	GamesessionService.deleteGamesession(req.params.gamesessionId, (err, result) => {
		if(err){
			if(err.message == "404"){
				return res.sendStatus(404) //hier wird auch 404 gesendet. Wenn die Tests 500 werfen ist im Test was falsch!
			}
			return res.status(500).json({error: err});
		}
		else{
			return res.sendStatus(204); //bitte so bei allen deleterouten 204, NICHT 200 zurzueckgeben
		}
	})
})

router.put('/gamefinished/:gamesessionId', isAuthenticated, (req, res) => {
	GamesessionService.endGame(req.params.gamesessionId, req.body.reason, (err, gamesession) => {
		if(err){
			if(err.message == "404"){
				return res.sendStatus(404);
			}
			else{
				return res.status(500).json({error: err});
			}
		}
		if(gamesession){
			return res.status(200).json({gamesession: gamesession});
		}
		else{
			console.log("idk")
			return res.sendStatus(404);
		}
	})
})

router.get('/:gamesessionId/leave', isAuthenticated, (req, res) => {
	userID=req.authenticatedUser.id;
	GamesessionService.removeUserFromSession(userID, req.params.gamesessionId, (err, res) => {
		if(err){
			return res.status(500).json({error: error});
		}
		else{
			return res.sendStaus(200);
		}
	})
})

router.put('/gamesession/positions', isAuthenticated, (req, res) => {
	userID=req.authenticatedUser.id;
	GamesessionService.updatePositionData(userID, req.body, (err, res) => {
		if(err){
			return res.status(500).json({error: error});
		}
		else{
			return res.sendStaus(200);
		}
	})
})

router.get('/', (req, res) => {
	GamesessionService.getGamesessions((error, gamesessions) => {
    if(error) return res.status(500).set({error: error})
    return res.status(200).json({gamesessions: gamesessions})
  })
})

module.exports = router;
