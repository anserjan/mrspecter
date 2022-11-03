import DB from "../DB"
import { User, IUser } from "../../src/model/UserModel"
import mongoose, { Types } from "mongoose";

let john: IUser & { _id: Types.ObjectId; }

beforeAll(async () => { await DB.connect(); await User.syncIndexes()})
beforeEach(async () => {
    await User.syncIndexes() 
    john = await User.create({
        email: "john@doe.de", name: "John",
        password: "1234", admin: false
    });
})
afterEach(async () => DB.clear())
afterAll(async () => DB.close())

test("DuplicateDB start", async () => {
    await expect(DB.connect()).rejects.toThrow(Error);
})

test("addUser", async () => {
    const user = { email: "john2@doe.de", name: "John2", password: "1234", admin: false }
    const res = await User.create(user)
    expect(res).toBeDefined()
    expect(res.name).toBe("John2")
})

test("addUser Error Unique Email", async () => {
    const user = { email: "john@doe.de", name: "John2", password: "1234", admin: false }
    await expect(User.create(user)).rejects.toThrow(mongoose.MongooseError)
    const res = await User.find({email: "john@doe.de"})
    expect(res).toHaveLength(1)
})

test("addUser Error Unique Name", async () => {
    const user = { email: "john2@doe.de", name: "John", password: "1234", admin: false }
    await expect(User.create(user)).rejects.toThrow(mongoose.MongooseError)
    const res = await User.find({name: "John"})
    expect(res).toHaveLength(1)
})

test("getUser", async () => {
    const res = await User.findOne({email: "john@doe.de", name: "John"})
    expect(res).toBeDefined()
    if (res) {
        expect(res.name).toBe("John")
        console.log(res)
    }else{
        throw new Error("User 'John' was not found in DB")
    }
})

test("getUser Error", async () => {
    const res = await User.findOne({email: "john2@doe.de", name: "John2"})
    expect(res).toBeNull()
})

test("updateUser", async () => {
    const res = await User.updateOne({email: "john@doe.de"}, {name:"newJohn"})
    const res2 = await User.findOne({name:"newJohn"})
    if(!res2){
        throw new Error("Updated User not found")
    }
})

test("updateUser Error", async () => {
    const res = await User.updateOne({email: "john2@doe.de"}, {name:"newJohn"})
    expect(res.matchedCount == 0 && res.modifiedCount == 0).toBe(true)
    const res2 = await User.findOne({name:"newJohn"})
    expect(res2).toBeNull()
})


test("deleteUser", async () => {
    const res = await User.deleteOne({email: "john@doe.de"})
    expect(res.deletedCount).toBe(1)
    const res2 = await User.findOne({email: "john@doe.de"})
    if(res2){
        throw new Error("User still existed after deletion")
    }
})

test("deleteUser Error", async () => {
    const res = await User.deleteOne({email: "john2@doe.de"})
    expect(res.deletedCount).toBe(0)
})