import app from "../index";

// Import supertest
import request from "supertest";

const requset_app = request(app);

/////////////////// TEST CASES For USERS //////////////////////

describe("POST /users/register", () => {
    it("User is registered successfully", async () => {
        const res = await requset_app.post("/users/register").send({
            username: "test0016",
            email: "k18@gmail.com",
            password: "123456789"
        });
        expect(res.statusCode).toEqual(201);
    });
});

describe("POST /users/register", () => {
    it("Error due to exitsting username", async () => {
        const res = await requset_app.post("/users/register").send({
            username: "test001",
            email: "krtch2548@gmail.com",
            password: "123456789"
        });
        expect(res.statusCode).toEqual(400);
    });
});

describe("POST /users/login", () => {
    it("Error due to incorrect credentials", async () => {
        const res = await requset_app.post("/users/login").send({
            username: "test001",
            password: "12345678"
        });
        expect(res.statusCode).toEqual(400);
    });

    it("Login successful", async () => {
        const res = await requset_app.post("/users/login").send({
            username: "test001",
            password: "123456789"
        });
        expect(res.statusCode).toEqual(200);
    });
});