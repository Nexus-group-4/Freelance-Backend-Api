import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";

describe("Category Routes", () => {
  it("should create a category", async () => {
    const response = await request(app)
      .post("/api/categories")
      .send({
        name: "writing scripts",
      });

    console.log("STATUS:", response.status);
    console.log("BODY:", response.body);
    console.log("TEXT:", response.text);

    expect(response.status).toBe(201);
  });
});