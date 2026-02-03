import { Config } from "../constants/Config";
import { TransformedMeal } from "./api.service";

/**
 * Service for managing favorites via the backend API.
 */
export class FavoritesService {
    private static BASE_URL = Config.BACKEND_API_URL;

    /**
     * Get all favorites for a user.
     */
    static async getFavorites(userId: string): Promise<any[]> {
        try {
            const response = await fetch(`${this.BASE_URL}/favorites/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch favorites");
            return await response.json();
        } catch (error) {
            console.error("FavoritesService.getFavorites error:", error);
            return [];
        }
    }

    /**
     * Add a recipe to favorites.
     */
    static async addFavorite(userId: string, recipe: TransformedMeal): Promise<boolean> {
        try {
            const response = await fetch(`${this.BASE_URL}/favorites`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    recipeId: parseInt(recipe.id),
                    title: recipe.title,
                    image: recipe.image,
                    cookTime: recipe.cookTime,
                    servings: String(recipe.servings),
                }),
            });
            return response.ok;
        } catch (error) {
            console.error("FavoritesService.addFavorite error:", error);
            return false;
        }
    }

    /**
     * Remove a recipe from favorites.
     */
    static async removeFavorite(userId: string, recipeId: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.BASE_URL}/favorites/${userId}/${recipeId}`, {
                method: "DELETE",
            });
            return response.ok;
        } catch (error) {
            console.error("FavoritesService.removeFavorite error:", error);
            return false;
        }
    }
}
