/// <reference types="jest" />
import request from "supertest";
import app from "../server.js";
import { sql } from "../config/db.js";

describe("Expense Tracker End-to-End API Tests", () => {
  const testUser = "test_user_123";
  let createdTransactionId: number;

  // --- 1. HEALTH CHECK ---
  describe("GET /api/health", () => {
    it("should return 200 and status ok", async () => {
      const res = await request(app).get("/api/health");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("status", "ok");
    });
  });

  // --- 2. CREATE TRANSACTION ---
  describe("POST /api/transactions", () => {
    it("should create a new transaction", async () => {
      const payload = {
        title: "Freelance Income",
        amount: 500.0,
        category: "Work",
        user_id: testUser,
      };

      const res = await request(app).post("/api/transactions").send(payload);

      expect(res.statusCode).toEqual(200);
      expect(res.body.transaction[0]).toHaveProperty(
        "title",
        "Freelance Income",
      );

      // Store ID for later tests
      createdTransactionId = res.body.transaction[0].id;
    });

    it("should return 400 if validation fails", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .send({ title: "Broken" }); // Missing amount, category, user_id

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("All fields are required");
    });
  });

  // --- 3. GET TRANSACTIONS ---
  describe("GET /api/transactions/:userId", () => {
    it("should fetch all transactions for the test user", async () => {
      const res = await request(app).get(`/api/transactions/${testUser}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.transactions)).toBe(true);
      // Verify our created transaction is in the list
      const found = res.body.transactions.some(
        (t: any) => t.id === createdTransactionId,
      );
      expect(found).toBe(true);
    });
  });

  // --- 4. GET SUMMARY ---
  describe("GET /api/transactions/summary/:userId", () => {
    it("should return balance, income, and expenses", async () => {
      const res = await request(app).get(
        `/api/transactions/summary/${testUser}`,
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("balance");
      expect(res.body).toHaveProperty("income");
      expect(res.body).toHaveProperty("expenses");

      // Since we just added 500, balance and income should be at least 500
      expect(Number(res.body.income)).toBeGreaterThanOrEqual(500);
    });
  });

  // --- 5. DELETE TRANSACTION ---
  describe("DELETE /api/transactions/:id", () => {
    it("should delete the transaction we created", async () => {
      const res = await request(app).delete(
        `/api/transactions/${createdTransactionId}`,
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("Transaction deleted successfully");
    });

    it("should return 404 when deleting the same ID again", async () => {
      const res = await request(app).delete(
        `/api/transactions/${createdTransactionId}`,
      );
      expect(res.statusCode).toEqual(404);
    });

    it("should return 400 for invalid ID format (not a number)", async () => {
      const res = await request(app).delete("/api/transactions/abc");
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("Invalid transaction ID");
    });
  });

  afterAll(async () => {
    // This cleans up any leftover data from the test user after all tests finish
    await sql`DELETE FROM transactions WHERE user_id = ${testUser}`;
  });
});
