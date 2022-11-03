const express = require('express');
const testRoutes = require("./endpoints/test/testRoutes")

const app = express();
const port = 8080
// var server = http.createServer(app);

app.use(express.json()) // for parsing application/json

// Add routes

app.use('/', testRoutes);



app.listen(port, () => console.log(`Example app listening on http://localhost:${port}!`))
// server.listen(443,() => console.log(`HttpServer listening on https://localhost!`));