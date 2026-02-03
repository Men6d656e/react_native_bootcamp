import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = width / 3;

/**
 * Bookmarks Screen
 * 
 * Displays a grid of posts that the user has bookmarked.
 * Each bookmark displays the post's image in a 3-column grid.
 * 
 * @returns {JSX.Element} The rendered Bookmarks screen.
 */
export default function Bookmarks() {
    // Fetch bookmarked posts from Convex
    const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);

    if (bookmarkedPosts === undefined) {
        return <Loader />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bookmarks</Text>
            </View>

            {bookmarkedPosts.length === 0 ? (
                <NoBookmarksFound />
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={bookmarkStyles.grid}
                >
                    {bookmarkedPosts.map((post) => {
                        if (!post) return null;
                        return (
                            <View key={post._id} style={bookmarkStyles.gridItem}>
                                <Image
                                    source={post.imageUrl}
                                    style={bookmarkStyles.image}
                                    contentFit="cover"
                                    transition={200}
                                    cachePolicy="memory-disk"
                                />
                            </View>
                        );
                    })}
                </ScrollView>
            )}
        </View>
    );
}

/**
 * Component to display when no bookmarks are found.
 */
function NoBookmarksFound() {
    return (
        <View style={bookmarkStyles.emptyContainer}>
            <Ionicons name="bookmark-outline" size={64} color={COLORS.grey} />
            <Text style={bookmarkStyles.emptyText}>No bookmarked posts yet</Text>
            <Text style={bookmarkStyles.emptySubtext}>
                Saved posts will appear here for you to view anytime.
            </Text>
        </View>
    );
}

const bookmarkStyles = StyleSheet.create({
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 1,
    },
    gridItem: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH,
        padding: 1,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
        paddingHorizontal: 40,
    },
    emptyText: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: "600",
        marginTop: 16,
        textAlign: "center",
    },
    emptySubtext: {
        color: COLORS.grey,
        fontSize: 14,
        marginTop: 8,
        textAlign: "center",
    },
});