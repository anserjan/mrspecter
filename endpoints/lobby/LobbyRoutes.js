const express = require("express");
const router = express.Router();
const LobbyService = require("./LobbyService")
const {isAuthenticated} = require("./AuthenticationService")

router.get('/', (req, res) => {
	LobbyService.getLobbies((err,erg) => {
		if(err){
			return res.sendStatus(500)
		}
		else{
			return res.json(erg)
		}
	})
});

router.get('/:lobbyid', isAuthenticated, (req, res) => {
	let userID = req.authenticatedUser.id
	LobbyService.getLobby(userID, req.params.lobbyid,(err,lobby) => {
		if(err){
			if(err.message == "no lobby found"){
				return res.status(404).json(err.message)
			}
			else{
				return res.status(500).json(err.message)
			}
		}
		else{
			return res.status(200).json(lobby)
		}
	})
});

router.post('/', isAuthenticated, (req, res) => {
	//{id:user._id, name: user.userName}
	let userID = req.authenticatedUser.id
	console.log("authenticated user: " + userID)
	LobbyService.createLobby(userID, req.body, (err, lobby) => {
		if(err){
			return res.sendStatus(500)
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
				return res.sendStatus(500)
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
			return res.sendStatus(500)
		}
		else{
			return res.sendStatus(204)
		}
	})
})



module.exports = router;