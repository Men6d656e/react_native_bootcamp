import request from "supertest";
import app from "../app.js";
import User from "../models/User.model.js";

describe("Auth API", () => {
    const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
    };

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it("should register a new user", async () => {
        const response = await request(app)
            .post("/api/v1/auth/register")
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("token");
        expect(response.body.user.username).toBe(userData.username);
    });

    it("should login an existing user", async () => {
        // Register first
        await request(app).post("/api/v1/auth/register").send(userData);

        const response = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: userData.email,
                password: userData.password,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });

    it("should logout a user", async () => {
        const response = await request(app).post("/api/v1/auth/logout");
        expect(response.status).toBe(200);
    });
});
