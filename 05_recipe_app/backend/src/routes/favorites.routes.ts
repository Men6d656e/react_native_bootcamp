import { Router } from "express";
import { FavoritesController } from "../controllers/favorites.controller.js";

const router = Router();

/**
 * Routes for managing favorites.
 */
router.post("/", FavoritesController.addFavorite);
router.get("/:userId", FavoritesController.getFavorites);
router.delete("/:userId/:recipeId", FavoritesController.removeFavorite);

export default router;
