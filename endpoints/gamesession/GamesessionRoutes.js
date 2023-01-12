const express = require("express")
const router = express.Router()
const GamesessionService = require("./GamesessionService")
const { isAuthenticated } = require("./AuthenticationService")
const PositionService = require("../userPosition/UserPositionService")
const userModel = require("../user/userModel")

router.post('/', isAuthenticated, (req, res) => {

	GamesessionService.create(req, (error, gamesession) => {
		if (error) {
			return res.status(500).json({ error: error.message })
		}
		if (gamesession) {
			const { id, creator, users, gametime, gamestate, huntedUser, borders, huntedRefreshTime, starttime, ...partialobject } = gamesession;
			const subset = { id, creator, users, gametime, gamestate, huntedUser, huntedRefreshTime, borders, starttime };
			subset.id = gamesession.sessionId
			return res.status(201).json(subset)
		}
		else {
			return res.status(400).json({ error: "Gamesession couldn't be created" });
		}

	})
})

router.get('/:gamesessionId', isAuthenticated, (req, res) => {

	position = req.body;

	GamesessionService.getGamesession(req, (error, gamesession) => {
		if (gamesession) {
			let { creator, users, gametime, gamestate, huntedUser, borders, sessionId, huntedRefreshTime, starttime, reason, ...partialobject } = gamesession;
			let newBorders = []
			for (const element of borders) {
				newBorders.push({ lat: element.lat, lng: element.lng })
			}
			if (starttime) {
				starttime = starttime.getTime()
			}

			const subset = { id: sessionId, creator, users, gametime, gamestate, huntedUser, huntedRefreshTime, borders: newBorders, starttime, reason };
			return res.status(200).json(subset);
		}
		else {
			return res.status(404).json({ error: "Gamesession not found" });
		}
	})
})

router.put('/:gamesessionId', isAuthenticated, (req, res) => {
	GamesessionService.updateGamesession(req.params.gamesessionId, req.body, (error, gamesession) => {
		if (gamesession) {
			const { sessionId, creator, users, gametime, gamestate, huntedUser, borders, huntedRefreshTime, starttime, ...partialobject } = gamesession;
			let newBorders = []
			for (const element of borders) {
				newBorders.push({ lat: element.lat, lng: element.lng })
			}
			const subset = { id: sessionId, creator, users, gametime, gamestate, huntedUser, huntedRefreshTime, borders: newBorders, starttime };
			return res.status(200).json(subset);
		}
		else {
			console.log(error)
			return res.status(400).json({ error: "Update failed" });
		}
	})
})

router.delete('/:gamesessionId', isAuthenticated, (req, res) => {
	GamesessionService.deleteGamesession(req.params.gamesessionId, (err, result) => {
		if (err) {
			return res.status(400).json({ error: "Delete failed" });
		}
		else {
			return res.sendStatus(204);
		}
	})
})

router.get('/:gamesessionId/finish', isAuthenticated, (req, res) => {
	userID = req.authenticatedUser.id;
	userModel.findById(userID, (err, user) => {
		if (user) {
			GamesessionService.changeState(req.params.gamesessionId, "FINISHED", `Game was finished by: ${user.name}`, (err, gamesession) => {
				if (gamesession) {
					return res.sendStatus(200);
				}
				else {
					return res.status(400).json({ error: "Changing state failed" });
				}
			})
		}
		else {
			return res.status(400).json({ error: "Changing state failed" });
		}
	})

})

router.get('/:gamesessionId/start', isAuthenticated, (req, res) => {
	userID = req.authenticatedUser.id;
	GamesessionService.changeState(req.params.gamesessionId, "RUNNING", null, (err, result) => {
		if (result) {
			return res.sendStatus(200);
		}
		else {
			return res.status(400).json({ error: "Changing state failed" });
		}
	})
})

router.get('/:gamesessionId/leave', isAuthenticated, (req, res) => {
	userID = req.authenticatedUser.id;
	GamesessionService.removeUserFromSession(userID, req.params.gamesessionId, (err, result) => {
		if (err) {
			return res.status(500).json({ error: err });
		}
		else {
			return res.sendStatus(200);
		}
	})
})

router.post('/:gamesessionId/positions', isAuthenticated, (req, res) => {
	if (!("lat" in req.body && "lng" in req.body)) {
		return res.status(400).json({ error: "lat & lng are required in body" })
	}
	posData = {
		gamesessionId: req.params.gamesessionId,
		userId: req.authenticatedUser.id,
		lat: req.body.lat,
		lng: req.body.lng,
	}
	PositionService.updatePosition(posData, (err, pos) => {
		if (pos) {
			PositionService.getGamestate(req, (gamestate) => {
				if (!gamestate) {
					return res.status(400).json({ error: "Could'n get gamestate" })
				} else {
					return res.status(201).json({ positions: pos, gamestate: gamestate })
				}
			})
			// return res.status(201).json(pos)
		}
		else {
			return res.status(400).json({ error: err })
		}
	})
})

router.get('/', (req, res) => {
	GamesessionService.getGamesessions((error, gamesessions) => {
		if (error) return res.status(500).set({ error: error })
		return res.status(200).json({ gamesessions: gamesessions })
	})
})

module.exports = router;
