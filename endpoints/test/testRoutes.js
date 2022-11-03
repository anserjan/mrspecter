const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
	res.send("Hello World");
});

router.get('/json', (req, res) => {
	res.json({"name":'Hello World, from express'});
});

module.exports = router;