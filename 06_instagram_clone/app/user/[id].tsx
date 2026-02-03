import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * User Profile Screen
 * 
 * Displays the profile of another user, identified by their Convex ID.
 * Shows their stats, bio, and shared posts.
 * Allows the current user to follow/unfollow this user.
 * 
 * @returns {JSX.Element} The rendered User Profile screen.
 */
export default function UserProfileScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const userId = id as Id<"users">;

    // Fetch profile data from Convex
    const profile = useQuery(api.users.getUserProfile, { id: userId });
    // Fetch user's posts
    const posts = useQuery(api.posts.getPostsByUser, { userId });
    // Check if current user is following this user
    const isFollowing = useQuery(api.users.isFollowing, { followingId: userId });

    // Toggle follow mutation
    const toggleFollow = useMutation(api.users.toggleFollow);

    /**
     * Handles navigation back to the previous screen.
     */
    const handleBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(tabs)");
        }
    }, [router]);

    /**
     * Toggles the follow status for the user.
     */
    const handleToggleFollow = useCallback(async () => {
        try {
            await toggleFollow({ followingId: userId });
        } catch (error) {
            console.error("[UserProfileScreen] Error toggling follow:", error);
            Alert.alert("Error", "Could not update follow status. Please try again.");
        }
    }, [userId, toggleFollow]);

    if (profile === undefined || posts === undefined || isFollowing === undefined) {
        return <Loader />;
    }

    if (profile === null) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <Ionicons name="person-remove-outline" size={64} color={COLORS.grey} />
                <Text style={{ color: COLORS.white, fontSize: 18, marginTop: 16 }}>User not found</Text>
                <TouchableOpacity onPress={handleBack} style={{ marginTop: 12 }}>
                    <Text style={{ color: COLORS.primary }}>Go back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleBack}
                    accessibilityLabel="Go back"
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{profile.username}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileInfo}>
                    <View style={styles.avatarAndStats}>
                        {/* AVATAR */}
                        <View style={styles.avatarContainer}>
                            <Image
                                source={profile.image}
                                style={styles.avatar}
                                contentFit="cover"
                                transition={200}
                                cachePolicy="memory-disk"
                            />
                        </View>

                        {/* STATS */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.posts || 0}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.followers || 0}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.following || 0}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.name}>{profile.fullname}</Text>
                    {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

                    <Pressable
                        style={({ pressed }) => [
                            styles.followButton,
                            isFollowing && styles.followingButton,
                            { opacity: pressed ? 0.7 : 1 }
                        ]}
                        onPress={handleToggleFollow}
                        accessibilityLabel={isFollowing ? "Unfollow user" : "Follow user"}
                    >
                        <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                            {isFollowing ? "Following" : "Follow"}
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.postsGrid}>
                    {posts.length === 0 ? (
                        <NoPostsFound />
                    ) : (
                        <FlatList
                            data={posts}
                            numColumns={3}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.gridItem}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={item.imageUrl}
                                        style={styles.gridImage}
                                        contentFit="cover"
                                        transition={200}
                                        cachePolicy="memory-disk"
                                    />
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item._id}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

/**
 * Component to display when a user has no posts.
 */
function NoPostsFound() {
    return (
        <View style={noPostStyles.container}>
            <Ionicons name="images-outline" size={64} color={COLORS.grey} />
            <Text style={noPostStyles.text}>No posts yet</Text>
        </View>
    );
}

const noPostStyles = StyleSheet.create({
    container: {
        paddingVertical: 80,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        color: COLORS.grey,
        marginTop: 12,
    },
});