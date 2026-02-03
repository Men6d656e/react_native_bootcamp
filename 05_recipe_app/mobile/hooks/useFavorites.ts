import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-expo";
import { FavoritesService } from "../services/favorites.service";
import { TransformedMeal } from "../services/api.service";

/**
 * Custom hook to manage favorites state globally and sync with backend.
 */
export const useFavorites = () => {
    const { user } = useUser();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFavorites = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await FavoritesService.getFavorites(user.id);
            setFavorites(data);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const isFavorite = (recipeId: string) => {
        return favorites.some((fav) => String(fav.recipeId) === recipeId);
    };

    const toggleFavorite = async (recipe: TransformedMeal) => {
        if (!user) return;

        const recipeId = recipe.id;
        const currentlyFavorite = isFavorite(recipeId);

        // Optimistic UI update
        if (currentlyFavorite) {
            setFavorites((prev) => prev.filter((fav) => String(fav.recipeId) !== recipeId));
            const success = await FavoritesService.removeFavorite(user.id, recipeId);
            if (!success) {
                // Rollback if failed
                await fetchFavorites();
            }
        } else {
            const tempFavorite = {
                userId: user.id,
                recipeId: Number(recipeId),
                title: recipe.title,
                image: recipe.image,
                cookTime: recipe.cookTime,
                servings: String(recipe.servings)
            };
            setFavorites((prev) => [...prev, tempFavorite]);
            const success = await FavoritesService.addFavorite(user.id, recipe);
            if (success) {
                await fetchFavorites(); // Get official record with DB ID
            } else {
                // Rollback if failed
                setFavorites((prev) => prev.filter((fav) => String(fav.recipeId) !== recipeId));
            }
        }
    };

    return {
        favorites,
        loading,
        isFavorite,
        toggleFavorite,
        refreshFavorites: fetchFavorites,
    };
};
