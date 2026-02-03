import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/Colors";
import { TransformedMeal } from "@/services/api.service";

interface RecipeCardProps {
    recipe: TransformedMeal;
}

/**
 * Component to display a recipe in a card format.
 */
export default function RecipeCard({ recipe }: RecipeCardProps) {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => router.push(`/recipe/${recipe.id}`)}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: recipe.image }}
                    style={styles.image}
                    contentFit="cover"
                    transition={300}
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {recipe.title}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                    {recipe.description}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.stat}>
                        <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
                        <Text style={styles.statText}>{recipe.cookTime}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Ionicons name="people-outline" size={14} color={COLORS.textLight} />
                        <Text style={styles.statText}>{recipe.servings}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: "hidden",
        width: "48%", // For 2-column grid
    },
    imageContainer: {
        height: 140,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 15,
        fontFamily: "SpaceMono",
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 4,
    },
    description: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 8,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    stat: {
        flexDirection: "row",
        alignItems: "center",
    },
    statText: {
        fontSize: 11,
        color: COLORS.textLight,
        marginLeft: 4,
    },
});
