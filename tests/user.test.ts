import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app.js";

describe("User Routes", () => {
    it("should get all users", async () => {
        const response = await request(app)
            .get("/api/users");

        console.log("STATUS:", response.status);
        console.log("BODY:", response.body);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return 401 when getting current user without authentication", async () => {
        const response = await request(app)
            .get("/api/users/me");

        console.log("STATUS:", response.status);
        console.log("BODY:", response.body);

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });
});