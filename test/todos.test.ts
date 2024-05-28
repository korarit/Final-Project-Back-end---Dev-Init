import app from "../app";

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

/////////////////// TEST CASES For Todos //////////////////////

describe("GET /todos", () => {
    it("Retrieve all todos for the users", async () => {
        const res = await agent.get("/todos");
        expect(res.statusCode).toEqual(200);
    });
});

describe("POST /todos", () => {
    it("New todos entry added", async () => {
        const res = await agent.post("/todos").send({
            title: "title 35",
            description: "content test add todos for unit test",
            due_date: "2024-05-28",
            priority: 1,
            status: true,
        });
        console.log(res.body);

        expect(res.statusCode).toEqual(200);
        
    });
});

describe("PUT /todos/:id", () => {
    it("todos entry updated successfully", async () => {
        const res = await agent.put("/todos/2").send({
            title: "unit test edit title for todos"
        });
        expect(res.statusCode).toEqual(200);
    });
});

describe("DELETE /todos/:id", () => {
    it("todos entry deleted successfully", async () => {
        const res = await agent.delete("/todos/20");
        expect(res.statusCode).toEqual(200);
    });
});

describe("GET /todos/:id", () => {
    it("Retrieve a todos entry", async () => {
        const res = await agent.get("/todos/2");
        expect(res.statusCode).toEqual(200);
    });
});