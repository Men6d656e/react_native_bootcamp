import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

describe("Book APi", () => {
  it("should create a new book", async () => {
    const fakeUserId = new mongoose.Types.ObjectId().toString();

    const newBook = {
      title: "The Great Gatsby",
      caption: "A story of wealth and love",
      image: "gatsby-cover.jpg",
      rating: 5,
      user: fakeUserId,
    };

    const response = await request(app).post("/api/v1/books").send(newBook);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newBook.title);
    expect(response.body.user).toBe(fakeUserId);
  });

  it("should return all books", async () => {
    const response = await request(app).get("/api/v1/books");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
