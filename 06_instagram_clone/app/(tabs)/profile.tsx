import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

/**
 * Profile Screen
 * 
 * Displays the current user's profile information, including:
 * - Stats (posts, followers, following).
 * - Bio and full name.
 * - A grid of the user's posts.
 * - Ability to edit profile.
 * - Logout functionality.
 * 
 * @returns {JSX.Element} The rendered Profile screen.
 */
export default function Profile() {
    const { signOut, userId } = useAuth();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);

    // Fetch current user data from Convex
    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

    // Fetch user's posts
    const posts = useQuery(api.posts.getPostsByUser, {});

    // Profile update mutation
    const updateProfile = useMutation(api.users.updateProfile);

    // State for editing profile
    const [editedProfile, setEditedProfile] = useState({
        fullname: "",
        bio: "",
    });

    // Synchronize edit state when user data is loaded
    useEffect(() => {
        if (currentUser) {
            setEditedProfile({
                fullname: currentUser.fullname || "",
                bio: currentUser.bio || "",
            });
        }
    }, [currentUser]);

    /**
     * Handles saving profile changes to Convex.
     */
    const handleSaveProfile = useCallback(async () => {
        if (!editedProfile.fullname.trim()) {
            Alert.alert("Error", "Full name cannot be empty.");
            return;
        }

        try {
            await updateProfile({
                fullname: editedProfile.fullname.trim(),
                bio: editedProfile.bio.trim(),
            });
            setIsEditModalVisible(false);
            Alert.alert("Success", "Profile updated successfully.");
        } catch (error) {
            console.error("[Profile] Error updating profile:", error);
            Alert.alert("Error", "Could not update profile. Please try again.");
        }
    }, [editedProfile, updateProfile]);

    /**
     * Handles user logout.
     */
    const handleLogout = useCallback(() => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: () => signOut(), style: "destructive" },
            ]
        );
    }, [signOut]);

    if (!currentUser || posts === undefined) {
        return <Loader />;
    }

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.username}>{currentUser.username}</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.headerIcon}
                        onPress={handleLogout}
                        accessibilityLabel="Log out"
                    >
                        <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileInfo}>
                    {/* AVATAR & STATS */}
                    <View style={styles.avatarAndStats}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={currentUser.image}
                                style={styles.avatar}
                                contentFit="cover"
                                transition={200}
                                cachePolicy="memory-disk"
                            />
                        </View>

                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{currentUser.posts || 0}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{currentUser.followers || 0}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{currentUser.following || 0}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.name}>{currentUser.fullname}</Text>
                    {currentUser.bio && <Text style={styles.bio}>{currentUser.bio}</Text>}

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => setIsEditModalVisible(true)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.shareButton}
                            activeOpacity={0.7}
                            accessibilityLabel="Share profile"
                        >
                            <Ionicons name="share-outline" size={20} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </View>

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
                                onPress={() => setSelectedPost(item)}
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
            </ScrollView>

            {/* EDIT PROFILE MODAL */}
            <Modal
                visible={isEditModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.modalContainer}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Edit Profile</Text>
                                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                                    <Ionicons name="close" size={24} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editedProfile.fullname}
                                    onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, fullname: text }))}
                                    placeholder="Enter your full name"
                                    placeholderTextColor={COLORS.grey}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Bio</Text>
                                <TextInput
                                    style={[styles.input, styles.bioInput]}
                                    value={editedProfile.bio}
                                    onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, bio: text }))}
                                    multiline
                                    numberOfLines={4}
                                    placeholder="Tell us about yourself"
                                    placeholderTextColor={COLORS.grey}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSaveProfile}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Modal>

            {/* POST DETAIL MODAL */}
            <Modal
                visible={!!selectedPost}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setSelectedPost(null)}
            >
                <View style={styles.modalBackdrop}>
                    {selectedPost && (
                        <View style={styles.postDetailContainer}>
                            <View style={styles.postDetailHeader}>
                                <TouchableOpacity onPress={() => setSelectedPost(null)}>
                                    <Ionicons name="close" size={24} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>

                            <Image
                                source={selectedPost.imageUrl}
                                style={styles.postDetailImage}
                                contentFit="contain"
                                transition={200}
                                cachePolicy="memory-disk"
                            />
                        </View>
                    )}
                </View>
            </Modal>
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
            <Text style={noPostStyles.subtext}>Capture and share your first moment!</Text>
        </View>
    );
}

const noPostStyles = {
    container: {
        paddingVertical: 100,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 20,
        fontWeight: "600",
        color: COLORS.white,
        marginTop: 16,
    },
    subtext: {
        fontSize: 14,
        color: COLORS.grey,
        marginTop: 8,
    },
};