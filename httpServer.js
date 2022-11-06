const express = require('express');
const testRoutes = require("./endpoints/test/testRoutes")
const userRoutes = require("./endpoints/user/userRoutes")
const database = require('./database/db')

const app = express();
const port = 8080
// var server = http.createServer(app);

app.use(express.json()) // for parsing application/json

// Add routes

app.use('/', testRoutes);
app.use('/user', userRoutes)


database.initDb(function(err, db){
    if(db){
        console.log("Datenbank laeuft")
    }
    else{
        console.log("ERROR: "+err)
    }
})


app.listen(port, () => console.log(`Example app listening on http://localhost:${port}!`))
// server.listen(443,() => console.log(`HttpServer listening on https://localhost!`));