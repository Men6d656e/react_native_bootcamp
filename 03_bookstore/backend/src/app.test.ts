import request from "supertest";
import app from "./app.js";

describe("GET /", () => {
  it("Should return the 200 Ok and a rocket emoji", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Server is running 🚀");
  });
});
