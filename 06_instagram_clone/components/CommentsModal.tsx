import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Comment from "./Comment";
import { Loader } from "./Loader";

/**
 * Interface for the CommentsModal props.
 */
interface CommentsModalProps {
  /** The unique identifier of the post for which comments are being displayed */
  postId: Id<"posts">;
  /** Whether the modal is currently visible */
  visible: boolean;
  /** Callback function to handle closing the modal */
  onClose: () => void;
}

/**
 * CommentsModal Component
 *
 * Renders a full-screen modal showing comments for a specific post.
 * Allows users to view existing comments and add new ones.
 *
 * @param {CommentsModalProps} props - The component props.
 * @returns {JSX.Element} The rendered Comments modal.
 */
export default function CommentsModal({
  onClose,
  postId,
  visible,
}: CommentsModalProps) {
  const [newComment, setNewComment] = useState("");

  // Fetch comments for the post
  const comments = useQuery(api.comments.getComments, { postId });
  const addComment = useMutation(api.comments.addComment);

  /**
   * Handles adding a new comment to the post.
   */
  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return;

    try {
      await addComment({
        content: newComment.trim(),
        postId,
      });
      setNewComment("");
    } catch (error) {
      console.error("[CommentsModal] Error adding comment:", error);
      Alert.alert("Error", "Could not post your comment. Please try again.");
    }
  }, [newComment, postId, addComment]);

  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
      >
        <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity
            onPress={onClose}
            accessibilityLabel="Close comments"
          >
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <View style={{ width: 24 }} />
        </View>

        {comments === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Comment comment={item} />}
            contentContainerStyle={[
              styles.commentsList,
              { paddingBottom: insets.bottom + 20 },
            ]}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={{ color: COLORS.grey, marginTop: 40 }}>
                  No comments yet. Be the first!
                </Text>
              </View>
            }
          />
        )}

        <View
          style={[
            styles.commentInput,
            { paddingBottom: Platform.OS === "ios" ? insets.bottom : 20 },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor={COLORS.grey}
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!newComment.trim()}
            accessibilityLabel="Post comment"
          >
            <Text
              style={[
                styles.postButton,
                !newComment.trim() && styles.postButtonDisabled,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
