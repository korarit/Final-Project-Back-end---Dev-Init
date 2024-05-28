import app from "../index";

// Import supertest
import request from "supertest";

let agent : any;

beforeAll(async () => {
    agent = request.agent(app);
    const res = await agent.post("/users/login").send({
        username: "test001",
        password: "123456789"
    });
});

///////////////// TEST CASES For Logs //////////////////////

describe("GET /logs", () => {

    it("Retrieve all logs for the users", async () => {
        const res = await agent.get("/logs");
        expect(res.statusCode).toEqual(200);
    });
});

describe("POST /logs", () => {

    it("New log entry added", async () => {
        const res = await agent.post("/logs").send({
            content: "test content for unit test"
        });
        expect(res.statusCode).toEqual(200);
    });
});

describe("PUT /logs/:id", () => {
    it("log entry updated successfully", async () => {
        const res = await agent.put("/logs/2").send({
            content: "test edit content for unit test"
        });
        expect(res.statusCode).toEqual(200);
    });
});

describe("DELETE /logs/:id", () => {
    it("log entry deleted successfully", async () => {
        const res = await agent.delete("/logs/19");
        expect(res.statusCode).toEqual(200);
    });
});

describe("GET /logs/:id", () => {
    it("Retrieve a log entry", async () => {
        const res = await agent.get("/logs/1");
        expect(res.statusCode).toEqual(200);
    });
});