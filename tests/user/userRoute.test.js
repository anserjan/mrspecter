const {mongoose} = require("mongoose");
const express = require('express');
const request = require("supertest");


const {DB} = require("../DB")

const userRoutes = require("../../endpoints/user/userRoutes")
const {createUser}  = require("../../endpoints/user/userService");
const User  = require("../../endpoints/user/userModel");
const { isAuthenticated } = require("../../endpoints/user/AuthenticationService");


const app = new express();
app.use(express.json()) // for parsing application/json
app.use('/user', userRoutes);

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


describe('Express User Routes', function () {

    test('CREATE /user', async () => {
        const res = await request(app)
            .post('/user/')
            .set('Content-type', 'application/json')
            .send({name:"Testier"})
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({name:"Testier"});
    });

    test('CREATE /user missing body', async () => {
        const res = await request(app)
            .post('/user/')
            .set('Content-type', 'application/json')
        expect(res.statusCode).toBe(400);
        // expect(res.body.text).;
    });

    test('GET /user', async () => {
        const res = await request(app).get('/user/'+testUser.id);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({name:testUser.name});
    });

    test('GET /user not found', async () => {
        const res = await request(app).get('/user/'+"imaginaryUserID");
        expect(res.statusCode).toBe(404);
        expect(res.text).toContain("UserID existiert nicht");
    });

    test('Change user name', async () => {
        let res = await request(app).get('/user/'+testUser.id);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({name:testUser.name});
        res = await request(app)
            .put('/user/' + testUser.id)
            .set('Authorization', 'Bearer ' + testUser.auth_token)
            .send({name:"Neuer Name Juhuu"})
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({name:"Neuer Name Juhuu"});
        // console.log(res.text)
    });

    test('Change user name not found', async () => {
        let res = await request(app).get('/user/'+"imaginaryUserID");
        expect(res.statusCode).toBe(404);
    });

    test('Try to Change user name with auth token of different user', async () => {
        let res = await request(app)
            .post('/user/')
            .set('Content-type', 'application/json')
            .send({name:"User1336"})
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'id', 'auth_token');
        expect(res.header.authorization).toContain("Bearer")
        newUser = res.body
        newUser.auth_token = res.header.authorization.split(" ")[1];
        res = await request(app).get('/user/'+testUser.id);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({name:testUser.name});
        res = await request(app)
            .put('/user/' + testUser.id)
            .set('Authorization', 'Bearer ' + newUser.auth_token)
            .send({name:"Bobby123"})
        expect(res.statusCode).toBe(400);
        expect(res.text).toContain("Cannot change data of another user")
        // console.log(res.text)
    });
  
    test('Delete user', async () => {
        let res = await request(app).get('/user/'+testUser.id);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({name:testUser.name});
        res = await request(app)
            .delete('/user/' + testUser.id)
            .set('Authorization', 'Bearer ' + testUser.auth_token)
        expect(res.statusCode).toBe(200);
        res = await request(app).get('/user/'+testUser.id);
        expect(res.statusCode).toBe(404);
        expect(res.text).toContain("UserID existiert nicht")
        // console.log(res.text)
    });

    test('Authenticate after delete', async () => {
        let res = await request(app)
        .delete('/user/' + testUser.id)
        .set('Authorization', 'Bearer ' + testUser.auth_token)
        res = await request(app)
        .delete('/user/' + testUser.id)
        .set('Authorization', 'Bearer ' + testUser.auth_token)
        expect(res.statusCode).toBe(401);
        expect(res.text).toContain("User doesn't exist anymore")
    });

    test('Illegal name type post', async () => {
        const res = await request(app)
            .post('/user/')
            .set('Content-type', 'application/json')
            .send({name:{null:null}})
        expect(res.statusCode).toBe(400);
    });

    test('IsAuthenticated', done => {
        expect.assertions(6) //beforeEach has 4
        req = {headers : {authorization: "Bearer " + testUser.auth_token}}
        res = {}
        isAuthenticated(req, res, () => {
            // console.log(req)
            expect(req.authenticatedUser.id).toBe(testUser.id)
            expect(req.authenticatedUser.name).toBe(testUser.name)
            
            done()
        })
    });

});