import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";
import { COLORS } from "@/constants/Colors";
import { MealApiService, TransformedMeal } from "@/services/api.service";
import { useFavorites } from "@/hooks/useFavorites";
import LoadingSpinner from "@/components/LoadingSpinner";

/**
 * Detailed screen for a single recipe.
 */
export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { isFavorite, toggleFavorite } = useFavorites();

    const [recipe, setRecipe] = useState<TransformedMeal | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            if (typeof id !== "string") return;
            setLoading(true);
            try {
                const data = await MealApiService.getMealById(id);
                setRecipe(data);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleToggleFavorite = async () => {
        if (!recipe) return;
        // Immediate feedback via optimistic update in hook
        await toggleFavorite(recipe);
    };

    const openYouTube = () => {
        if (recipe?.youtubeUrl) {
            Linking.openURL(recipe.youtubeUrl);
        }
    };

    const getYouTubeId = (url: string | null) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) return <LoadingSpinner message="Preparing recipe details..." />;
    if (!recipe) return <View style={styles.error}><Text>Recipe not found</Text></View>;

    const youtubeId = getYouTubeId(recipe.youtubeUrl);
    const favorite = isFavorite(recipe.id);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: recipe.image }} style={styles.mainImage} contentFit="cover" />
                    <LinearGradient colors={["transparent", "rgba(0,0,0,0.6)"]} style={styles.gradient} />

                    <View style={styles.headerButtons}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.roundButton}>
                            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleToggleFavorite}
                            style={[styles.roundButton, favorite && styles.activeHeart]}
                        >
                            <Ionicons name={favorite ? "heart" : "heart-outline"} size={24} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.titleOverlay}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{recipe.category}</Text>
                        </View>
                        <Text style={styles.title}>{recipe.title}</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Stats Bar */}
                    <View style={styles.statsBar}>
                        <View style={styles.statItem}>
                            <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.statValue}>{recipe.cookTime}</Text>
                            <Text style={styles.statLabel}>Cook Time</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Ionicons name="people-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.statValue}>{recipe.servings}</Text>
                            <Text style={styles.statLabel}>Servings</Text>
                        </View>
                    </View>

                    {/* YouTube Video if available */}
                    {youtubeId && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Video Tutorial</Text>
                                <TouchableOpacity onPress={openYouTube} style={styles.watchBadge}>
                                    <Ionicons name="logo-youtube" size={16} color="#FF0000" />
                                    <Text style={styles.watchText}>Watch App</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.videoCard}>
                                <WebView
                                    originWhitelist={["*"]}
                                    allowsFullscreenVideo
                                    allowsInlineMediaPlayback
                                    mediaPlaybackRequiresUserAction={false}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    source={{
                                        uri: `https://www.youtube.com/embed/${youtubeId}?rel=0&autoplay=0&showinfo=0&controls=1`,
                                        headers: { 'Referer': 'https://www.youtube.com' }
                                    }}
                                    style={styles.webView}
                                />
                            </View>
                            <Text style={styles.videoHint}>
                                If the video doesn't play, tap "Watch App" to open in YouTube.
                            </Text>
                        </View>
                    )}

                    {/* Ingredients */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        {recipe.ingredients.map((item, index) => (
                            <View key={index} style={styles.ingredientRow}>
                                <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                                <Text style={styles.ingredientText}>{item}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Instructions */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Instructions</Text>
                        {recipe.instructions.map((step, index) => (
                            <View key={index} style={styles.stepRow}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
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
    error: { flex: 1, justifyContent: "center", alignItems: "center" },
    imageContainer: {
        height: 350,
        width: "100%",
        position: "relative",
    },
    mainImage: {
        width: "100%",
        height: "100%",
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    headerButtons: {
        position: "absolute",
        top: 20,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    roundButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    activeHeart: {
        backgroundColor: COLORS.primary,
    },
    titleOverlay: {
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
    },
    categoryBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: "flex-start",
        marginBottom: 10,
    },
    categoryText: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: 12,
    },
    title: {
        fontSize: 28,
        fontFamily: "SpaceMono",
        fontWeight: "800",
        color: COLORS.white,
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    content: {
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: COLORS.background,
        marginTop: -30,
    },
    statsBar: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        elevation: 4,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.text,
        marginTop: 5,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    divider: {
        width: 1,
        height: "70%",
        backgroundColor: COLORS.border,
        alignSelf: "center",
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: "SpaceMono",
        fontWeight: "800",
        color: COLORS.text,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    watchBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    watchText: {
        fontSize: 12,
        fontWeight: "bold",
        color: COLORS.text,
    },
    videoCard: {
        height: 200,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#000",
    },
    videoHint: {
        fontSize: 12,
        color: COLORS.textLight,
        textAlign: "center",
        marginTop: 8,
        fontStyle: "italic",
    },
    webView: {
        flex: 1,
    },
    ingredientRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        gap: 10,
    },
    ingredientText: {
        fontSize: 15,
        color: COLORS.text,
    },
    stepRow: {
        flexDirection: "row",
        marginBottom: 20,
        gap: 15,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 2,
    },
    stepNumberText: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: 14,
    },
    stepText: {
        flex: 1,
        fontSize: 15,
        color: COLORS.text,
        lineHeight: 22,
    },
});
