/// <reference types="jest" />
import request from "supertest";
import app from "../server.js";

describe("Health Check", () => {
  it("should return 200 for health endpoint", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "ok");
  });
  describe("Transactions API", () => {
    // 1. Health check (already there)
    it("should return 200 for health endpoint", async () => {
      const res = await request(app).get("/api/health");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("status", "ok");
    });

    // 2. Test for Create Transaction
    describe("POST /api/transactions", () => {
      it("should create a new transaction successfully", async () => {
        const payload = {
          title: "Test Rent",
          amount: 1200,
          category: "Housing",
          user_id: "1", // Ensure this user_id exists in your database!
        };

        const res = await request(app).post("/api/transactions").send(payload);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("transaction");
        // Check if the title matches what we sent
        expect(res.body.transaction[0]).toHaveProperty("title", "Test Rent");
      });

      it("should return 400 if title is missing", async () => {
        const invalidPayload = {
          amount: 100,
          category: "Food",
          user_id: "1",
        };

        const res = await request(app)
          .post("/api/transactions")
          .send(invalidPayload);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("message", "All fields are required");
      });
    });
  });
});
