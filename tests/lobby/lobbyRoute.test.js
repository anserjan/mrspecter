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
    .send({userName:"LobbyUser"})
  expect(res.statusCode).toBe(200)
  expect(res.body).toMatchObject({userName:"LobbyUser"})
  expect(res.header.authorization).toContain("Bearer")
  testUser = res.body
  testUser.auth_token = res.header.authorization.split(" ")[1]
})

// afterEach(async () => DB.clear())
afterAll(async () => {
  DB.clear()
  DB.close()
})

test("DuplicateDB start", async () => {
  await expect(DB.connect()).rejects.toThrow(Error)
})

describe("Express Lobby Routes", function () {

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

  test("GET /lobby/:lobbyid", async() => {
    const res = await request(app)
      .get("/lobby/" + lobby._id)
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
    expect(res.statusCode).toBe(200)
    expect(res.body._id).toBe(lobby._id)
    expect(res.body.gamemode).toBe(lobby.gamemode)
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
    const res = await request(app)
      .put("/lobby/" + lobby._id)
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + testUser.auth_token)
      .send({gamemode: { huntedUser: testUser.id, gametime: "2000" }})
      // Todo updater fertigstellen
    expect(res.statusCode).toBe(200)
  })
})
