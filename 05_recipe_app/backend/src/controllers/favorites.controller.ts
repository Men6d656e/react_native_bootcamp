import type { Request, Response } from "express";
import { FavoritesService } from "../services/favorites.service.js";

/**
 * Controller for handling favorite-related HTTP requests.
 */
export const FavoritesController = {
    /**
     * POST /api/favorites
     * Adds a recipe to the user's favorites.
     */
    addFavorite: async (req: Request, res: Response) => {
        try {
            const { userId, recipeId, title, image, cookTime, servings } = req.body;

            if (!userId || !recipeId || !title) {
                res.status(400).json({ error: "Missing required fields: userId, recipeId, and title are required." });
                return;
            }

            const newFavorite = await FavoritesService.addFavorite({
                userId,
                recipeId: Number(recipeId),
                title,
                image,
                cookTime,
                servings,
            });

            res.status(201).json(newFavorite[0]);
        } catch (error) {
            console.error("Error adding favorite:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    /**
     * GET /api/favorites/:userId
     * Fetches all favorites for a given user.
     */
    getFavorites: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                res.status(400).json({ error: "User ID is required." });
                return;
            }

            const userFavorites = await FavoritesService.getFavoritesByUser(userId as string);
            res.status(200).json(userFavorites);
        } catch (error) {
            console.error("Error fetching favorites:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    /**
     * DELETE /api/favorites/:userId/:recipeId
     * Removes a recipe from the user's favorites.
     */
    removeFavorite: async (req: Request, res: Response) => {
        try {
            const { userId, recipeId } = req.params;

            if (!userId || !recipeId) {
                res.status(400).json({ error: "User ID and Recipe ID are required." });
                return;
            }

            await FavoritesService.removeFavorite(userId as string, Number(recipeId));
            res.status(200).json({ message: "Favorite removed successfully" });
        } catch (error) {
            console.error("Error removing favorite:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
};
