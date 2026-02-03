import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/create.styles";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import * as FileSystem from "expo-file-system/legacy";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

/**
 * CreateScreen Component
 *
 * Handles the creation of new posts.
 * Provides functionality to:
 * - Pick an image from the device library.
 * - Add a caption to the post.
 * - Upload the image to Convex storage.
 * - Create a post entry in the database.
 *
 * @returns {JSX.Element} The rendered Create post screen.
 */
export default function CreateScreen() {
  const router = useRouter();
  const { user } = useUser();

  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // Convex mutations
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  /**
   * Opens the image library to pick a photo for the post.
   */
  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("[CreateScreen] Error picking image:", error);
      Alert.alert(
        "Error",
        "Could not pick image. Please check your permissions.",
      );
    }
  }, []);

  /**
   * Handles the sharing (uploading) of the post.
   */
  const handleShare = useCallback(async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first.");
      return;
    }

    try {
      setIsSharing(true);
      console.log(
        "[CreateScreen] Starting handleShare with image:",
        selectedImage,
      );

      // 1. Generate an upload URL from Convex
      console.log("[CreateScreen] Generating upload URL...");
      const uploadUrl = await generateUploadUrl();
      console.log("[CreateScreen] Upload URL generated:", uploadUrl);

      // 2. Upload the file to the provided URL
      console.log("[CreateScreen] Uploading file to storage...");
      const uploadResult = await FileSystem.uploadAsync(
        uploadUrl,
        selectedImage,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          mimeType: "image/jpeg",
        },
      );

      console.log(
        "[CreateScreen] Upload complete. Status:",
        uploadResult.status,
      );
      if (uploadResult.status !== 200) {
        throw new Error(`Upload failed with status ${uploadResult.status}`);
      }

      // 3. Extract the storage ID and create the post in DB
      const { storageId } = JSON.parse(uploadResult.body);
      console.log(
        "[CreateScreen] Creating post in DB with storageId:",
        storageId,
      );

      await createPost({
        storageId,
        caption: caption.trim(),
      });

      console.log("[CreateScreen] Post created successfully in DB.");

      // 4. Reset state and navigate back
      setSelectedImage(null);
      setCaption("");
      Alert.alert("Success", "Post shared successfully!");
      router.push("/(tabs)");
    } catch (error: any) {
      console.error("[CreateScreen] Error sharing post:", error);
      Alert.alert(
        "Error",
        `Could not share post: ${error.message || "Unknown error"}`,
      );
    } finally {
      setIsSharing(false);
    }
  }, [selectedImage, caption, generateUploadUrl, createPost, router]);

  /**
   * Resets the creation state.
   */
  const handleDiscard = useCallback(() => {
    if (selectedImage || caption) {
      Alert.alert(
        "Discard Post",
        "Are you sure you want to discard this post?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            onPress: () => {
              setSelectedImage(null);
              setCaption("");
            },
            style: "destructive",
          },
        ],
      );
    } else {
      router.back();
    }
  }, [selectedImage, caption, router]);

  if (!selectedImage) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <View style={{ width: 28 }} />
        </View>

        <TouchableOpacity
          style={styles.emptyImageContainer}
          onPress={pickImage}
          activeOpacity={0.7}
        >
          <Ionicons name="image-outline" size={48} color={COLORS.grey} />
          <Text style={styles.emptyImageText}>Tap to select an image</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styles.contentContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleDiscard}
            disabled={isSharing}
            accessibilityLabel="Discard post"
          >
            <Ionicons
              name="close-outline"
              size={28}
              color={isSharing ? COLORS.grey : COLORS.white}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity
            style={[
              styles.shareButton,
              isSharing && styles.shareButtonDisabled,
            ]}
            disabled={isSharing || !selectedImage}
            onPress={handleShare}
            accessibilityLabel="Share post"
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styles.shareText}>Share</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.content, isSharing && styles.contentDisabled]}>
            {/* IMAGE SECTION */}
            <View style={styles.imageSection}>
              <Image
                source={selectedImage}
                style={styles.previewImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={pickImage}
                disabled={isSharing}
                activeOpacity={0.7}
              >
                <Ionicons name="image-outline" size={20} color={COLORS.white} />
                <Text style={styles.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* INPUT SECTION */}
            <View style={styles.inputSection}>
              <View style={styles.captionContainer}>
                <Image
                  source={user?.imageUrl}
                  style={styles.userAvatar}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
                <TextInput
                  style={styles.captionInput}
                  placeholder="Write a caption..."
                  placeholderTextColor={COLORS.grey}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isSharing}
                  maxLength={1000}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
