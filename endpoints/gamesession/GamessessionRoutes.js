const express = require("express")
const router = express.Router()
const GamesessionService = require("./Gamesessionservice")
const { isAuthenticated } = require("./AuthenticationService")

router.get('/', (req, res) => {
	GamesessionService.getGamesessions((error, gamesessions) => {
    if(error) return res.status(500).set({error: error})
    return res.status(200).set({gamesessions: gamesessions})
  })
})

router.post('/', isAuthenticated, (req, res) => {
	GamesessionService.create(req.body, (error, gamesession) => {
    if(error) return res.status(500).set({error: error})
    return res.status(201).json(gamesession)
  })
})

router.get('/:gamesessionId', (req, res) => {
	res.json("TODO")
})

router.delete('/:gamesessionId', (req, res) => {
	res.json("TODO")
})

router.get('/gamefinished/:gamesessionId', (req, res) => {
	res.json("TODO")
})
