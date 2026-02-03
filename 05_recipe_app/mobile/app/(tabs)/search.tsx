import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { MealApiService, TransformedMeal } from "@/services/api.service";
import RecipeCard from "@/components/RecipeCard";
import LoadingSpinner from "@/components/LoadingSpinner";

/**
 * Screen for searching recipes by name.
 */
export default function SearchScreen() {
    const [query, setQuery] = useState("");
    const [recipes, setRecipes] = useState<TransformedMeal[]>([]);
    const [loading, setLoading] = useState(false);

    /**
     * Performs the search.
     */
    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const results = await MealApiService.searchMeals(query);
            setRecipes(results);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchHeader}>
                <Text style={styles.title}>Explore</Text>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={COLORS.textLight} />
                    <TextInput
                        placeholder="Search recipes..."
                        placeholderTextColor={COLORS.textLight}
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={handleSearch}
                        style={styles.input}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery("")}>
                            <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {loading ? (
                <LoadingSpinner message="Searching..." />
            ) : (
                <FlatList
                    data={recipes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <RecipeCard recipe={item} />}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="search-outline" size={64} color={COLORS.border} />
                            <Text style={styles.emptyText}>
                                {query ? "No recipes found for this search" : "Search for your favorite meals!"}
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    searchHeader: {
        padding: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: COLORS.text,
        marginBottom: 15,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.background,
        paddingHorizontal: 15,
        borderRadius: 12,
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        color: COLORS.text,
        fontSize: 16,
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
        textAlign: "center",
        fontSize: 16,
        paddingHorizontal: 40,
    },
});
