const {mongoose} = require("mongoose")
const express = require("express")
const request = require("supertest")

const {DB} = require("../DB")

const LobbyRoutes = require("../../endpoints/lobby/LobbyRoutes")
const {createLobby}  = require("../../endpoints/lobby/LobbyService")
const Lobby  = require("../../endpoints/lobby/LobbyModel")

const userRoutes = require("../../endpoints/user/userRoutes")
const User = require("../../endpoints/user/userModel")

const app = new express()
app.use(express.json()) // for parsing application/json
app.use("/user", userRoutes)
app.use("/lobby", LobbyRoutes)

beforeAll(async () => {
  await DB.connect()
  await User.syncIndexes()
})

let testUser
let lobby

beforeEach(async () => {
  //Create a test user for further tests
  const res = await request(app)
    .post("/user/")
    .set("Content-type", "application/json")
    .send({name:"LobbyUser"})
  expect(res.statusCode).toBe(200)
  expect(res.body).toMatchObject({name:"LobbyUser"})
  expect(res.header.authorization).toContain("Bearer")
  testUser = res.body
  testUser.auth_token = res.header.authorization.split(" ")[1]
})

// afterEach(async () => DB.clear())
afterAll(async () => {
  DB.clear()
  DB.close()
})

describe("Express Lobby Routes", function () {

  test("Get /lobby/ with empty database", async() => {
    const res = await request(app)
      .get("/lobby/")
      .set("Content-type", "application/json")
    expect(res.statusCode).toBe(200)
    expect(res.body.lobbies).toMatchObject([])
  })

  test("CREATE /lobby", async () => {
    const res = await request(app)
      .post("/lobby/")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty("_id")
    expect(res.body).toHaveProperty("creator")
    expect(res.body).toHaveProperty("gamemode")
    expect(res.body).toHaveProperty("users")
    expect(res.body.users).toContain(testUser.id)
    lobby = res.body
  })

  test("POST Create lobby without authentication /lobby", async() => {
    const res = await request(app)
      .post("/lobby/")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer ")
    expect(res.statusCode).toBe(401)
  })

  test("GET /lobby/:lobbyid", async() => {
    const res = await request(app)
      .get("/lobby/" + lobby._id)
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
    expect(res.statusCode).toBe(200)
    expect(res.body._id).toBe(lobby._id)
    expect(res.body.gamemode._id).toBe(lobby.gamemode)
    expect(res.body.creator).toBe(lobby.creator)
  })

  test("GET no matching id /lobby/:lobbyid", async() => {
    const res = await request(app)
      .get("/lobby/472349t03409g02323")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
    expect(res.statusCode).toBe(500)
  })
  
  test("PUT Update Gamemode /lobby/:lobbyid", async() => {
    var res = await request(app)
      .post("/lobby/")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
    expect(res.statusCode).toBe(201)

    var lobby = res.body

    res = await request(app)
      .put("/lobby/" + lobby._id)
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
      .send({gamemode: { huntedUser: testUser.id, gametime: "2000" }})
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("gamemode")
    expect(res.body.gamemode.huntedUser).toBe(testUser.id)
    expect(res.body.gamemode.gametime).toBe(2000)
  })

  test("PUT Update Lobby with wrong lobbyID", async() => {
    var res = await request(app)
      .post("/lobby/")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
    expect(res.statusCode).toBe(201)

    var lobby = res.body

    res = await request(app)
      .put("/lobby/" + lobby._id+2)
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
      .send({gameUser: testUser._id})
    expect(res.statusCode).toBe(500)
  })

  test("DELETE Lobby", async() => {
    var res = await request(app)
      .post("/lobby/")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
    expect(res.statusCode).toBe(201)

    lobby = res.body

    res = await request(app)
      .delete("/lobby/"+ lobby._id)
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
    expect(res.statusCode).toBe(204)
    
    res = await request(app)
      .get("/lobby/" + lobby._id)
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
    expect(res.statusCode).toBe(404)
  })

  test("GET Leave lobby", async() => {
    // Create lobby
    var res = await request(app)
      .post("/lobby/")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
    expect(res.statusCode).toBe(201)

    lobby = res.body

    // Create second user
    res = await request(app)
      .post("/user/")
      .set("Content-type", "application/json")
      .send({name:"SecondUser"})
    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({name:"SecondUser"})
    expect(res.header.authorization).toContain("Bearer")
    secondUser = res.body
    secondUser.auth_token = res.header.authorization.split(" ")[1]

    // Second user into lobby
    res = await request(app)
      .get("/lobby/" + lobby._id)
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + secondUser.auth_token)
    expect(res.statusCode).toBe(200)
    expect(res.body._id).toBe(lobby._id)
    expect(res.body.users).toContain(secondUser.id)

    // second user leave lobby
    res = await request(app)
      .get("/lobby/" + lobby._id+ "/leave")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + secondUser.auth_token)
    expect(res.statusCode).toBe(200)

  })

  test("GET Leave lobby with lobby not existing", async() => {
    const res = await request(app)
      .get("/lobby/fhio4238234l230010103f/leave")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
    expect(res.statusCode).toBe(500)
  })

  test("GET Leave lobby while not being registered in lobby", async() => {
    // create lobby
    var res = await request(app)
      .post("/lobby/")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
    expect(res.statusCode).toBe(201)

    lobby = res.body

    // create second user
    res = await request(app)
      .post("/user/")
      .set("Content-type", "application/json")
      .send({name:"SecondUser"})
    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({name:"SecondUser"})
    expect(res.header.authorization).toContain("Bearer")
    secondUser = res.body
    secondUser.auth_token = res.header.authorization.split(" ")[1]

    // leave lobby while not being registered
    res = await request(app)
      .get("/lobby/" + lobby._id + "/leave")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + secondUser.auth_token)
    expect(res.statusCode).toBe(400)

  })

})
