import { Config } from "../constants/Config";

/**
 * Types for TheMealDB API responses.
 */
export interface MealDBMeal {
    idMeal: string;
    strMeal: string;
    strInstructions: string;
    strMealThumb: string;
    strCategory?: string;
    strArea?: string;
    strYoutube?: string;
    [key: string]: string | undefined;
}

export interface TransformedMeal {
    id: string;
    title: string;
    description: string;
    image: string;
    cookTime: string;
    servings: number;
    category: string;
    area?: string;
    ingredients: string[];
    instructions: string[];
    youtubeUrl: string | null;
}

/**
 * Service for interacting with TheMealDB API.
 */
export class MealApiService {
    private static BASE_URL = Config.MEAL_DB_API_URL;

    /**
     * Search meals by name.
     */
    static async searchMeals(query: string): Promise<TransformedMeal[]> {
        try {
            const response = await fetch(`${this.BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
            const data = await response.json();
            const meals: MealDBMeal[] = data.meals || [];
            return meals.map(this.transformMeal).filter((m): m is TransformedMeal => m !== null);
        } catch (error) {
            console.error("MealApiService.searchMeals error:", error);
            return [];
        }
    }

    /**
     * Get meal by ID.
     */
    static async getMealById(id: string): Promise<TransformedMeal | null> {
        try {
            const response = await fetch(`${this.BASE_URL}/lookup.php?i=${id}`);
            const data = await response.json();
            return data.meals ? this.transformMeal(data.meals[0]) : null;
        } catch (error) {
            console.error("MealApiService.getMealById error:", error);
            return null;
        }
    }

    /**
     * Filter meals by category.
     */
    static async filterByCategory(category: string): Promise<TransformedMeal[]> {
        try {
            const response = await fetch(`${this.BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
            const data = await response.json();
            const meals: MealDBMeal[] = data.meals || [];
            return meals.map(this.transformMeal).filter((m): m is TransformedMeal => m !== null);
        } catch (error) {
            console.error("MealApiService.filterByCategory error:", error);
            return [];
        }
    }

    /**
     * List all categories.
     */
    static async getCategories(): Promise<any[]> {
        try {
            const response = await fetch(`${this.BASE_URL}/categories.php`);
            const data = await response.json();
            return data.categories || [];
        } catch (error) {
            console.error("MealApiService.getCategories error:", error);
            return [];
        }
    }

    /**
     * Transform raw API data into app format.
     */
    private static transformMeal(meal: MealDBMeal): TransformedMeal | null {
        if (!meal) return null;

        const ingredients: string[] = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push(`${measure ? measure.trim() + " " : ""}${ingredient.trim()}`);
            }
        }

        return {
            id: meal.idMeal,
            title: meal.strMeal,
            description: meal.strInstructions?.substring(0, 120) + "..." || "",
            image: meal.strMealThumb,
            cookTime: "30-45 mins",
            servings: 4,
            category: meal.strCategory || "Main Course",
            area: meal.strArea,
            ingredients,
            instructions: meal.strInstructions?.split(/\r?\n/).filter(line => line.trim()) || [],
            youtubeUrl: meal.strYoutube || null,
        };
    }
}
