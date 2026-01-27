import { jest } from "@jest/globals";

jest.unstable_mockModule("../lib/cloudinary.js", () => ({
  default: {
    uploader: {
      upload: jest.fn().mockResolvedValue({ secure_url: "https://example.com/mock-image.jpg" }),
      destroy: jest.fn().mockResolvedValue({ result: "ok" }),
    },
    config: jest.fn(),
  },
}));

const { default: app } = await import("../app.js");
const { default: User } = await import("../models/User.model.js");
const { default: Book } = await import("../models/Book.model.js");
import request from "supertest";

describe("Book API", () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    await User.deleteMany({});
    await Book.deleteMany({});

    const userRes = await request(app).post("/api/v1/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    token = userRes.body.token;
    userId = userRes.body.user.id;
  });

  it("should create a new book", async () => {
    const newBook = {
      title: "The Great Gatsby",
      caption: "A story of wealth and love",
      image: "https://example.com/gatsby.jpg",
      rating: 5,
    };

    const response = await request(app)
      .post("/api/v1/books")
      .set("Authorization", `Bearer ${token}`)
      .send(newBook);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newBook.title);
    expect(response.body.user).toBe(userId);
  });

  it("should return all books with pagination", async () => {
    // Create a book first
    await request(app)
      .post("/api/v1/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Book 1",
        caption: "Caption 1",
        image: "https://example.com/1.jpg",
        rating: 4,
      });

    const response = await request(app)
      .get("/api/v1/books")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("books");
    expect(response.body).toHaveProperty("totalBooks");
    expect(Array.isArray(response.body.books)).toBe(true);
  });
});
