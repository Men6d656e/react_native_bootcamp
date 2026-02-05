import request from "supertest";
import app from "../src/app.js";
import { FavoritesService } from "../src/services/favorites.service.js";
import { jest } from "@jest/globals";

// We will use spyOn for better ESM support with object exports

describe("Favorites API", () => {
  const mockUserId = "user_123";
  const mockRecipe = {
    id: 1,
    userId: mockUserId,
    recipeId: 456,
    title: "Test Recipe",
    image: "test.jpg",
    cookTime: "10 min",
    servings: "2",
    createdAt: new Date().toISOString(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/favorites/:userId", () => {
    it("should return a list of favorites for a user", async () => {
      const mockFavorites = [mockRecipe] as any;
      jest
        .spyOn(FavoritesService, "getFavoritesByUser")
        .mockResolvedValue(mockFavorites);

      const response = await request(app).get(`/api/favorites/${mockUserId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFavorites);
      expect(FavoritesService.getFavoritesByUser).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it("should return 500 if service fails", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      jest
        .spyOn(FavoritesService, "getFavoritesByUser")
        .mockRejectedValue(new Error("DB Error"));

      const response = await request(app).get(`/api/favorites/${mockUserId}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal Server Error" });
      consoleSpy.mockRestore();
    });
  });

  describe("POST /api/favorites", () => {
    it("should add a new favorite", async () => {
      jest
        .spyOn(FavoritesService, "addFavorite")
        .mockResolvedValue([mockRecipe] as any);

      const response = await request(app)
        .post("/api/favorites")
        .send(mockRecipe);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockRecipe);
      expect(FavoritesService.addFavorite).toHaveBeenCalled();
    });

    it("should return 400 if required fields are missing", async () => {
      const incompleteRecipe = { userId: mockUserId };
      const response = await request(app)
        .post("/api/favorites")
        .send(incompleteRecipe);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Missing required fields");
    });
  });

  describe("DELETE /api/favorites/:userId/:recipeId", () => {
    it("should remove a favorite", async () => {
      jest
        .spyOn(FavoritesService, "removeFavorite")
        .mockResolvedValue({ rowCount: 1 } as any);

      const response = await request(app).delete(
        `/api/favorites/${mockUserId}/456`,
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Favorite removed successfully");
      expect(FavoritesService.removeFavorite).toHaveBeenCalledWith(
        mockUserId,
        456,
      );
    });
  });
});
