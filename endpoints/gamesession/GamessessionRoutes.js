const express = require("express");
const router = express.Router();
const GamesessionService = require("./Gamesessionservice")

router.get('/', (req, res) => {
	res.json("TODO")
});

router.post('/', (req, res) => {
	res.json("TODO")
});

router.get('/:gamesessionId', (req, res) => {
	res.json("TODO")
});

router.delete('/:gamesessionId', (req, res) => {
	res.json("TODO")
});

router.delete('/gamefinished/:gamesessionId', (req, res) => {
	res.json("TODO")
});
