import { db } from "../config/db.js";
import { favoritesTable } from "../db/schema.js";
import { and, eq } from "drizzle-orm";

/**
 * Service to handle business logic for favorite recipes.
 */
export const FavoritesService = {
    /**
     * Adds a new recipe to the user's favorites.
     * @param data - The favorite recipe data.
     * @returns The created favorite record.
     */
    addFavorite: async (data: {
        userId: string;
        recipeId: number;
        title: string;
        image?: string;
        cookTime?: string;
        servings?: string;
    }) => {
        return await db.insert(favoritesTable).values(data).returning();
    },

    /**
     * Retrieves all favorite recipes for a specific user.
     * @param userId - The ID of the user.
     * @returns A list of favorite recipes.
     */
    getFavoritesByUser: async (userId: string) => {
        return await db
            .select()
            .from(favoritesTable)
            .where(eq(favoritesTable.userId, userId));
    },

    /**
     * Removes a recipe from the user's favorites.
     * @param userId - The ID of the user.
     * @param recipeId - The ID of the recipe to remove.
     * @returns The deletion result.
     */
    removeFavorite: async (userId: string, recipeId: number) => {
        return await db
            .delete(favoritesTable)
            .where(and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, recipeId)));
    },
};
