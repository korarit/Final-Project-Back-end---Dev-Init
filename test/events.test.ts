import app from "../index";

// Import supertest
import request from "supertest";

let agent : any;

/////////////////// TEST CASES For Events //////////////////////
beforeAll(async () => {
        agent = request.agent(app);
        const res = await agent.post("/users/login").send({
            username: "test001",
            password: "123456789"
        });
});


describe("GET /events", () => {
    
    it("Retrieve all events for the users", async () => {
        const res = await agent.get("/events");
        expect(res.statusCode).toEqual(200);
    });
});

describe("POST /events", () => {
    it("New events entry added", async () => {
        const res = await agent.post("/events").send({
            title: "title test add todos for unit test",
            description: "content test add todos for unit test",
            start_date: "2024-05-28 18:00:00",
            end_date: "2024-05-29 22:00:00",
        });
        expect(res.statusCode).toEqual(200);
    });
});

describe("PUT /events/:id", () => {
    it("events entry updated successfully", async () => {
        const res = await agent.put("/events/2").send({
            title: "test edit title for unit test"
        });
        expect(res.statusCode).toEqual(200);
    });
});

describe("DELETE /events/:id", () => {
    it("events entry deleted successfully", async () => {
        const res = await agent.delete("/events/19");
        expect(res.statusCode).toEqual(200);
    });
});

describe("GET /events/:id", () => {
    it("Retrieve a events entry", async () => {
        const res = await agent.get("/events/1");
        expect(res.statusCode).toEqual(200);
    });
});