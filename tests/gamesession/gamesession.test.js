const {mongoose, set} = require("mongoose");
const express = require('express');
const request = require("supertest");


const {DB} = require("../DB")

const userRoutes = require("../../endpoints/user/userRoutes")
const gamesessionRoutes = require("../../endpoints/gamesession/GamesessionRoutes")
const {createUser}  = require("../../endpoints/user/userService");
const User  = require("../../endpoints/user/userModel");
const { isAuthenticated } = require("../../endpoints/user/AuthenticationService");
const Gamesession = require("../../endpoints/gamesession/GamesessionModel")

const app = new express();
app.use(express.json()) // for parsing application/json
app.use('/user', userRoutes);
app.use('/gamesession', gamesessionRoutes);

let testUser

beforeAll(async () => { await DB.connect(); await User.syncIndexes()})
beforeEach(async () => {
    //Create a test user for further tests
    const res = await request(app)
        .post('/user/')
        .set('Content-type', 'application/json')
        .send({name:"Testier"})
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({name:"Testier"});
    expect(res.body).toHaveProperty('name', 'id', 'auth_token');
    expect(res.header.authorization).toContain("Bearer")
    testUser = res.body
    testUser.auth_token = res.header.authorization.split(" ")[1];
})
afterEach(async () => DB.clear())
afterAll(async () => DB.close())

test("DuplicateDB start", async () => {
    await expect(DB.connect()).rejects.toThrow(Error);
})


test('CREATE /gamesession', async () => {
    const res = await request(app)
        .post('/gamesession/')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + testUser.auth_token)
        .send()
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
});

test('GET /gamesession', async () => {
    const session = await request(app)
        .post('/gamesession/')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + testUser.auth_token)
        .send()

    const res = await request(app)
        .get('/gamesession/'+ session.body.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + testUser.auth_token)
        .send()
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.users).toContain(testUser.id)
    expect(res.body).toHaveProperty("huntedUser")
});

test('leave /gamesession', async () => {
    const session = await request(app)
        .post('/gamesession/')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + testUser.auth_token)
        .send()
    // const res2 = await request(app)
    //     .get('/gamesession/'+ session.body.id)
    //     .set('Content-type', 'application/json')
    //     .set('Authorization', 'Bearer ' + testUser.auth_token)
    //     .send()
    const res = await request(app)
        .get('/gamesession/'+ session.body.id)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + testUser.auth_token)
        .send()

    const res2 = await request(app)
        .get('/gamesession/'+ session.body.id + '/leave')
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer ' + testUser.auth_token)
        .send()
    expect(res.statusCode).toBe(200);
    // expect(res2.body).toHaveProperty("_id");

});

test("put /gamesession/:gamesessionId", async() => {
  var res = await request(app)
    .post('/gamesession/')
    .set('Content-type', 'application/json')
    .set('Authorization', 'Bearer ' + testUser.auth_token)
    .send()
  gamesession = res.body

  res = await request(app)
    .put("/gamesession/" + gamesession.id)
    .set("Content-type", "application/json")
    .set("Authorization", "Bearer " + testUser.auth_token)
    .send({huntedUser: testUser.id, gametime: "300", borders: [{lat: "123444", lng: "98765"}, {lat: "5667ss", lng: "anser"}]})
  expect(res.statusCode).toBe(200)
  expect(res.body).toHaveProperty("id", "huntedUser", "gametime")
  expect(res.body.gametime).toBe(300)

  res = await request(app)
    .get("/gamesession/" + gamesession.id)
    .set("Content-type", "application/json")
    .set("Authorization", "Bearer " + testUser.auth_token)
    .send()
  expect(res.statusCode).toBe(200)
  expect(res.body).toHaveProperty("borders")
  expect(res.body.gametime).toBe(300)
  expect(res.body.creator).toContain(testUser.id)
})


test("POST positions multiple times with one user /gamesession/:gamesessionId/positions", async() => {
  var res = await request(app)
    .post('/gamesession/')
    .set('Content-type', 'application/json')
    .set('Authorization', 'Bearer ' + testUser.auth_token)
    .send()
  gamesession = res.body
  
  res = await request(app)
    .post("/gamesession/"+gamesession.id+"/positions")
    .set('Content-type', 'application/json')
    .set('Authorization', 'Bearer ' + testUser.auth_token)
    .send({lat: "12355", lng: "65444"})
  expect(res.statusCode).toBe(201)
  expect(res.body.gamestate).toBe("LOBBY")
  expect(res.body.positions.length).toBe(1)
  expect(res.body.positions[0]).toHaveProperty("userId", "lat", "lng")
  expect(res.body.positions[0].lat).toContain("12355")
  expect(res.body.positions[0].lng).toContain("65444")
  expect(res.body.positions[0].userId).toContain(testUser.id)

  res = await request(app)
    .post("/gamesession/"+gamesession.id+"/positions")
    .set('Content-type', 'application/json')
    .set('Authorization', 'Bearer ' + testUser.auth_token)
    .send({lat: "22222", lng: "33333"})
  expect(res.statusCode).toBe(201)
  expect(res.body.gamestate).toBe("LOBBY")
  expect(res.body.positions.length).toBe(1)
  expect(res.body.positions[0]).toHaveProperty("userId", "lat", "lng")
  expect(res.body.positions[0].lat).toContain("22222")
  expect(res.body.positions[0].lng).toContain("33333")
  expect(res.body.positions[0].userId).toContain(testUser.id)
})

test("POST multiple positions with multiple users /gamesession/:gamesessionId/positions", async() => {
  // create gamesession
  var res = await request(app)
    .post("/gamesession/")
    .set("Content-type", "application/json")
    .set("Authorization", "Bearer " + testUser.auth_token)
    .send()
  gamesession = res.body

  // create position from user 1
  res = await request(app)
    .post("/gamesession/"+gamesession.id+"/positions")
    .set("Content-type", "application/json")
    .set("Authorization", "Bearer " + testUser.auth_token)
    .send({lat: "12355", lng: "65444"})
  expect(res.statusCode).toBe(201)
  expect(res.body.positions.length).toBe(1)
  expect(res.body.positions[0]).toHaveProperty("lat", "lng" , "userId")
  expect(res.body.positions[0].lat).toContain("12355")
  expect(res.body.positions[0].lng).toContain("65444")
  expect(res.body.positions[0].userId).toContain(testUser.id)
  
  // update position from user 1
  res = await request(app)
    .post("/gamesession/"+gamesession.id+"/positions")
    .set('Content-type', 'application/json')
    .set('Authorization', 'Bearer ' + testUser.auth_token)
    .send({lat: "22222", lng: "33333"})
  expect(res.statusCode).toBe(201)
  expect(res.body.gamestate).toBe("LOBBY")
  expect(res.body.gamestate).toBe("LOBBY")
  expect(res.body.positions.length).toBe(1)
  expect(res.body.positions[0]).toHaveProperty("userId", "lat", "lng")
  expect(res.body.positions[0].lat).toContain("22222")
  expect(res.body.positions[0].lng).toContain("33333")
  expect(res.body.positions[0].userId).toContain(testUser.id)

  // create second user
  res = await request(app)
    .post('/user/')
    .set('Content-type', 'application/json')
    .send({name:"SecondUser"})
  expect(res.statusCode).toBe(200)
  expect(res.body).toMatchObject({name:"SecondUser"})
  expect(res.body).toHaveProperty('name', 'id', 'auth_token')
  expect(res.header.authorization).toContain("Bearer")
  secondUser = res.body
  secondUser.auth_token = res.header.authorization.split(" ")[1]  

  // create and get positions via second user
  res = await request(app)
    .post("/gamesession/"+gamesession.id+"/positions")
    .set("Content-type", "application/json")
    .set("Authorization", "Bearer " + secondUser.auth_token)
    .send({lat: "ghghg", lng: "adadadad"})

  expect(res.statusCode).toBe(201)
  expect(res.body.positions.length).toBe(2)
})