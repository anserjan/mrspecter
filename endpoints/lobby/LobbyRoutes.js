const express = require("express");
const router = express.Router();
const LobbyService = require("./LobbyService")
const {isAuthenticated} = require("./AuthenticationService")

router.get('/', (req, res) => {
	LobbyService.getLobbies((err,erg) => {
		if(err){
			return res.status(500).set({error: err})
		}
		else{
			return res.json(erg)
		}
	})
});

router.get('/:lobbyId/leave', isAuthenticated, (req, res) => {
	LobbyService.leaveLobby(req.authenticatedUser.id, req.params.lobbyId, (err, result) => {
		if(err){
			if(err.message == "No Lobby Found"){
				return res.status(404).json({error: err})
			}
			if(err.message == "Cannot Leave Lobby/Not A Lobby Member"){
				return res.status(400).json({error: err})
			}
			else{
				return res.status(500).json({error: err})
			}
		}
		
		if(result){
			return res.sendStatus(200)
		}
		else{
			return res.status(500).json({error: err})
		}
	})
})

router.get('/:lobbyid', isAuthenticated, (req, res) => {
	let userID = req.authenticatedUser.id
	LobbyService.getLobby(userID, req.params.lobbyid,(err,lobby) => {
		if(err){
			if(err.message == "no lobby found"){
				return res.status(404).json({error: err})
			}
			else{
				return res.status(500).json({error: err})
			}
		}
		else{
			return res.status(200).json(lobby)
		}
	})
});

router.post('/', isAuthenticated, (req, res) => {
	let userID = req.authenticatedUser.id
	LobbyService.createLobby(userID, (err, lobby) => {
		if(err){
			return res.status(500).json({error: err})
		}
		else{
			return res.status(201).json(lobby)
		}
	})
});

router.put('/:lobbyid', (req, res) => {
	LobbyService.updateLobby(req.params.lobbyid, req.body, (err, erg) => {
		if(err){
			if(err.message=="no lobby found"){
				return res.status(404).json("No Lobby Found")
			}
			else{
				return res.status(500).json({error: err})
			}
		}
		else{
			return res.status(200).json(erg)
		}
	})
})

router.delete('/:lobbyid', (req, res) => {
	LobbyService.deleteLobby(req.params.lobbyid, (err, erg) => {
		if(err){
			return res.status(500).json({error: err})
		}
		else{
			return res.sendStatus(204)
		}
	})
})



module.exports = router;