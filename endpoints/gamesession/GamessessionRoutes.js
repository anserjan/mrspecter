const express = require("express")
const router = express.Router()
const GamesessionService = require("./Gamesessionservice")
const { isAuthenticated } = require("./AuthenticationService")
const PositionService = require("../userPosition/UserPositionService")

router.post('/', isAuthenticated, (req, res) => {
	
	GamesessionService.create(req.body, (error, gamesession) => {
    if(error){
		return res.status(500).json({error: error})
	}
	if(gamesession){
		return res.status(201).json(gamesession)
	}
	else{
		return res.sendStatus(400);
	}
    
  })
})

router.get('/:gamesessionId', isAuthenticated, (req, res) => {
	
	position = req.body;
	
	GamesessionService.getGamesession(req.params.gamesessionId, req.authenticatedUser.id, position, (error, gamesession) => {
		if(error){
			if(error.message == "404"){
				return res.sendStatus(404);
			}
			else
			{
				return res.status(500).json({error: error});
			}
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
				return res.sendStatus(404) 
			}
			return res.status(500).json({error: err});
		}
		else{
			return res.sendStatus(204);
		}
	})
})

router.put('/gamefinished/:gamesessionId', isAuthenticated, (req, res) => {
	GamesessionService.endGame(req.params.gamesessionId, req.body.gamestate, (err, gamesession) => {
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
			return res.sendStatus(404);
		}
	})
})

router.get('/:gamesessionId/leave', isAuthenticated, (req, res) => {
	userID=req.authenticatedUser.id;
	GamesessionService.removeUserFromSession(userID, req.params.gamesessionId, (err, result) => {
		if(err){
			return res.status(500).json({error: err});
		}
		else{
			return res.sendStatus(200);
		}
	})
})

router.post('/gamesession/:gamesessionId/updatePosition', isAuthenticated, (req, res) => {
	userID=req.authenticatedUser.id;
	posData = {
		gamesessionId: req.params.gamesessionId,
		userId: req.authenticatedUser.id,
		lat: req.body.lat,
		lng: req.body.lng,
	}
	PositionService.updatePosition(posData, (err, pos) => {
		if(err){
			return res.status(500).json({error: err});
		}
		else{
			return res.status(201).json(pos);
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
