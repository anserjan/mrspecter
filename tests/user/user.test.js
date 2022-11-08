const {mongoose} = require("mongoose");
const express = require('express');
const request = require("supertest");


const {DB} = require("../DB")

const userRoutes = require("../../endpoints/user/userRoutes")
const {createUser}  = require("../../endpoints/user/userService");
const User  = require("../../endpoints/user/userModel");


const app = new express();
app.use(express.json()) // for parsing application/json
app.use('/user', userRoutes);

let testUser
let testUserAuthToken

beforeAll(async () => { await DB.connect(); await User.syncIndexes()})
beforeEach(async () => {
    //Create a test user for further tests
    const res = await request(app)
        .post('/user/')
        .set('Content-type', 'application/json')
        .send({userName:"Testier"})
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({userName:"Testier"});
    expect(res.body).toHaveProperty('userName', 'id', 'auth_token');
    expect(res.header.authorization).toContain("Bearer")
    testUser = res.body
    testUser.auth_token = res.header.authorization.split(" ")[1];
})
afterEach(async () => DB.clear())
afterAll(async () => DB.close())

test("DuplicateDB start", async () => {
    await expect(DB.connect()).rejects.toThrow(Error);
})


describe('Express User Routes', function () {

    test('CREATE /user', async () => {
        const res = await request(app)
            .post('/user/')
            .set('Content-type', 'application/json')
            .send({userName:"Testier"})
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({userName:"Testier"});
    });

    test('GET /user', async () => {
        const res = await request(app).get('/user/'+testUser.id);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({userName:testUser.userName});
    });

    test('Change user name', async () => {
        let res = await request(app).get('/user/'+testUser.id);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({userName:testUser.userName});
        res = await request(app)
            .put('/user/' + testUser.id)
            .set('Authorization', 'Bearer ' + testUser.auth_token)
            .send({userName:"Neuer Name Juhuu"})
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({userName:"Neuer Name Juhuu"});
        console.log(res.text)
    });
  
    test('Delete user', async () => {
        let res = await request(app).get('/user/'+testUser.id);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({userName:testUser.userName});
        res = await request(app)
            .delete('/user/' + testUser.id)
            .set('Authorization', 'Bearer ' + testUser.auth_token)
        expect(res.statusCode).toBe(200);
        res = await request(app).get('/user/'+testUser.id);
        expect(res.statusCode).toBe(404);
        expect(res.text).toContain("UserID existiert nicht")
        console.log(res.text)
    });

});