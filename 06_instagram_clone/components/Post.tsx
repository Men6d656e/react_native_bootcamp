import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import CommentsModal from "./CommentsModal";

/**
 * Interface for the Post component props.
 */
interface PostProps {
    /**
     * The post object containing all necessary data to render a post.
     */
    post: {
        _id: Id<"posts">;
        imageUrl: string;
        caption?: string;
        likes: number;
        comments: number;
        _creationTime: number;
        isLiked: boolean;
        isBookmarked: boolean;
        author: {
            _id: string;
            username: string;
            image: string;
        };
    };
}

/**
 * Post component renders an individual social media post.
 * Features include:
 * - Rendering post image and author info.
 * - Liking and bookmarking posts.
 * - Deleting posts (for authors).
 * - Navigation to author profile.
 * - Opening comments modal.
 * 
 * @param {PostProps} props - The component props.
 * @returns {JSX.Element} The rendered post component.
 */
export default function Post({ post }: PostProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
    const [showComments, setShowComments] = useState(false);

    const { user } = useUser();
    const currentUser = useQuery(api.users.getUserByClerkId, user ? { clerkId: user.id } : "skip");

    const toggleLike = useMutation(api.posts.toggleLike);
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
    const deletePost = useMutation(api.posts.deletePost);

    /**
     * Handles toggling the like status of the post.
     */
    const handleLike = useCallback(async () => {
        try {
            const newIsLiked = await toggleLike({ postId: post._id });
            setIsLiked(newIsLiked);
        } catch (error) {
            console.error("[Post] Error toggling like:", error);
            Alert.alert("Error", "Could not update like status. Please try again.");
        }
    }, [post._id, toggleLike]);

    /**
     * Handles toggling the bookmark status of the post.
     */
    const handleBookmark = useCallback(async () => {
        try {
            const newIsBookmarked = await toggleBookmark({ postId: post._id });
            setIsBookmarked(newIsBookmarked);
        } catch (error) {
            console.error("[Post] Error toggling bookmark:", error);
            Alert.alert("Error", "Could not update bookmark status.");
        }
    }, [post._id, toggleBookmark]);

    /**
     * Handles deleting the post after user confirmation.
     */
    const handleDelete = useCallback(async () => {
        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deletePost({ postId: post._id });
                        } catch (error) {
                            console.error("[Post] Error deleting post:", error);
                            Alert.alert("Error", "Could not delete post. Please try again.");
                        }
                    }
                }
            ]
        );
    }, [post._id, deletePost]);

    const isAuthor = currentUser?._id === post.author._id;

    return (
        <View style={styles.post}>
            {/* POST HEADER */}
            <View style={styles.postHeader}>
                <Link
                    href={isAuthor ? "/(tabs)/profile" : `/user/${post.author._id}`}
                    asChild
                >
                    <TouchableOpacity style={styles.postHeaderLeft}>
                        <Image
                            source={post.author.image}
                            style={styles.postAvatar}
                            contentFit="cover"
                            transition={200}
                            cachePolicy="memory-disk"
                        />
                        <Text style={styles.postUsername}>{post.author.username}</Text>
                    </TouchableOpacity>
                </Link>

                {isAuthor ? (
                    <TouchableOpacity onPress={handleDelete} accessibilityLabel="Delete post">
                        <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity accessibilityLabel="More options">
                        <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                )}
            </View>

            {/* IMAGE */}
            <Image
                source={post.imageUrl}
                style={styles.postImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
            />

            {/* POST ACTIONS */}
            <View style={styles.postActions}>
                <View style={styles.postActionsLeft}>
                    <TouchableOpacity onPress={handleLike} accessibilityLabel={isLiked ? "Unlike post" : "Like post"}>
                        <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={24}
                            color={isLiked ? COLORS.primary : COLORS.white}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowComments(true)} accessibilityLabel="View comments">
                        <Ionicons name="chatbubble-outline" size={22} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleBookmark} accessibilityLabel={isBookmarked ? "Remove bookmark" : "Bookmark post"}>
                    <Ionicons
                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={22}
                        color={COLORS.white}
                    />
                </TouchableOpacity>
            </View>

            {/* POST INFO */}
            <View style={styles.postInfo}>
                <Text style={styles.likesText}>
                    {post.likes > 0 ? `${post.likes.toLocaleString()} likes` : "Be the first to like"}
                </Text>

                {post.caption && (
                    <View style={styles.captionContainer}>
                        <Text style={styles.captionUsername}>{post.author.username}</Text>
                        <Text style={styles.captionText}>{post.caption}</Text>
                    </View>
                )}

                {post.comments > 0 && (
                    <TouchableOpacity onPress={() => setShowComments(true)}>
                        <Text style={styles.commentsText}>View all {post.comments} comments</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.timeAgo}>
                    {formatDistanceToNow(post._creationTime, { addSuffix: true })}
                </Text>
            </View>

            <CommentsModal
                postId={post._id}
                visible={showComments}
                onClose={() => setShowComments(false)}
            />
        </View>
    );
}