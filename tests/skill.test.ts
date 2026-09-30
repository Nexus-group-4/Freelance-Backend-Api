import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("Skill Routes", () => {
it("should create a skill", async () => {
const response = await request(app)
.post("/api/skills")
.send({
"name": "writing",
});

console.log("STATUS:", response.status);
console.log("BODY:", response.body);

expect(response.status).toBe(201);
expect(response.body.success).toBe(true);

});
});