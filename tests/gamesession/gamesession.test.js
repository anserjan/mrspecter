const {mongoose} = require("mongoose");
const express = require('express');
const request = require("supertest");


const {DB} = require("../DB")

const userRoutes = require("../../endpoints/user/userRoutes")
const gamesessionRoutes = require("../../endpoints/gamesession/GamessessionRoutes")
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
    console.log(res)
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
});

test('GET /gamesession', async () => {
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
    console.log(res)
    expect(res.statusCode).toBe(200);
    // expect(res.body).toHaveProperty("id");

    console.log(await Gamesession.find())
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
    console.log(res)
    expect(res.statusCode).toBe(200);
    expect(res2.body).toHaveProperty("id");

    console.log(await Gamesession.find())
});