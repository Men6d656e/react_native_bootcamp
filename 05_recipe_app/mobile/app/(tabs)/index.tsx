import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, FlatList } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { MealApiService, TransformedMeal } from "@/services/api.service";
import CategoryFilter from "@/components/CategoryFilter";
import RecipeCard from "@/components/RecipeCard";
import LoadingSpinner from "@/components/LoadingSpinner";

/**
 * Main Home screen for browsing recipes.
 */
export default function HomeScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [recipes, setRecipes] = useState<TransformedMeal[]>([]);
    const [featuredRecipe, setFeaturedRecipe] = useState<TransformedMeal | null>(null);

    /**
     * Loads the initial data for the home screen.
     */
    const loadData = async () => {
        try {
            setLoading(true);
            const [cats, meals] = await Promise.all([
                MealApiService.getCategories(),
                MealApiService.searchMeals(""), // Loads some random/default meals
            ]);

            const transformedCats = cats.map((cat: any) => ({
                id: cat.idCategory,
                name: cat.strCategory,
                image: cat.strCategoryThumb,
            }));

            setCategories(transformedCats);
            setRecipes(meals.slice(0, 10));
            setFeaturedRecipe(meals[0] || null);

            if (!selectedCategory && transformedCats.length > 0) {
                setSelectedCategory(transformedCats[0].name);
                await loadCategoryRecipes(transformedCats[0].name);
            }
        } catch (error) {
            console.error("HomeScreen.loadData error:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Loads recipes for a specific category.
     */
    const loadCategoryRecipes = async (category: string) => {
        try {
            const meals = await MealApiService.filterByCategory(category);
            setRecipes(meals);
        } catch (error) {
            console.error("HomeScreen.loadCategoryRecipes error:", error);
        }
    };

    /**
     * Handles category selection.
     */
    const handleCategorySelect = async (category: string) => {
        setSelectedCategory(category);
        await loadCategoryRecipes(category);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, [selectedCategory]);

    useEffect(() => {
        loadData();
    }, []);

    if (loading && !refreshing) {
        return <LoadingSpinner message="Cooking up some recipes..." />;
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>Hello!</Text>
                    <Text style={styles.welcomeSubtitle}>What would you like to cook today?</Text>
                </View>

                {/* Featured Section */}
                {featuredRecipe && (
                    <View style={styles.featuredContainer}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
                            style={styles.featuredCard}
                        >
                            <Image source={{ uri: featuredRecipe.image }} style={styles.featuredImage} transition={400} />
                            <View style={styles.featuredOverlay}>
                                <View style={styles.featuredBadge}>
                                    <Text style={styles.featuredBadgeText}>Featured</Text>
                                </View>
                                <Text style={styles.featuredTitle} numberOfLines={1}>{featuredRecipe.title}</Text>
                                <View style={styles.featuredStats}>
                                    <View style={styles.stat}>
                                        <Ionicons name="time" size={16} color={COLORS.white} />
                                        <Text style={styles.statTextInverse}>{featuredRecipe.cookTime}</Text>
                                    </View>
                                    <View style={styles.stat}>
                                        <Ionicons name="people" size={16} color={COLORS.white} />
                                        <Text style={styles.statTextInverse}>{featuredRecipe.servings} Servings</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Categories Section */}
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleCategorySelect}
                />

                {/* Recipes Grid */}
                <View style={styles.recipesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{selectedCategory} Recipes</Text>
                    </View>

                    <View style={styles.recipesGrid}>
                        {recipes.map((item) => (
                            <RecipeCard key={item.id} recipe={item} />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    welcomeSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 20,
    },
    welcomeTitle: {
        fontSize: 32,
        fontFamily: "SpaceMono",
        fontWeight: "800",
        color: COLORS.text,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: COLORS.textLight,
    },
    featuredContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    featuredCard: {
        height: 200,
        borderRadius: 24,
        overflow: "hidden",
        backgroundColor: COLORS.card,
        elevation: 8,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    featuredImage: {
        width: "100%",
        height: "100%",
    },
    featuredOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.35)",
        padding: 20,
        justifyContent: "flex-end",
    },
    featuredBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: "flex-start",
        marginBottom: 8,
    },
    featuredBadgeText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "bold",
    },
    featuredTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.white,
        marginBottom: 8,
    },
    featuredStats: {
        flexDirection: "row",
        gap: 15,
    },
    stat: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    statTextInverse: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: "500",
    },
    recipesSection: {
        paddingHorizontal: 20,
    },
    sectionHeader: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: "SpaceMono",
        fontWeight: "bold",
        color: COLORS.text,
    },
    recipesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
});
