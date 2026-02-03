import { View, Text, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { useFavorites } from "@/hooks/useFavorites";
import RecipeCard from "@/components/RecipeCard";
import LoadingSpinner from "@/components/LoadingSpinner";

/**
 * Screen displaying the user's favorite recipes.
 */
export default function FavoritesScreen() {
    const { favorites, loading } = useFavorites();

    if (loading && favorites.length === 0) {
        return <LoadingSpinner message="Loading your favorites..." />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Favorites</Text>
                <Text style={styles.subtitle}>{favorites.length} recipes saved</Text>
            </View>

            <FlatList
                data={favorites}
                keyExtractor={(item) => (item.recipeId ? String(item.recipeId) : String(item.id))}
                renderItem={({ item }) => (
                    <RecipeCard
                        recipe={{
                            id: String(item.recipeId || item.id),
                            title: item.title,
                            image: item.image,
                            cookTime: item.cookTime,
                            servings: Number(item.servings),
                            description: "", // Favorites in DB don't have full description
                            category: "",
                            ingredients: [],
                            instructions: [],
                            youtubeUrl: null,
                        }}
                    />
                )}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="heart-outline" size={64} color={COLORS.border} />
                        <Text style={styles.emptyText}>You haven't saved any recipes yet.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 4,
    },
    listContent: {
        padding: 10,
    },
    row: {
        justifyContent: "space-around",
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 100,
    },
    emptyText: {
        marginTop: 10,
        color: COLORS.textLight,
        fontSize: 16,
    },
});
