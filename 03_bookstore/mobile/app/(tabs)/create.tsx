import {
  View,
  Text,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import styles from "@/assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { API_URL } from "@/constants/api";

interface CreateBookData {
  title: string;
  caption: string;
  rating: number;
  image: string | null;
}

const Create: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [rating, setRating] = useState<number>(3);
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { token } = useAuthStore();

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need permissions to upload an image",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true, // Try to get base64 directly first
      });

      if (!result.canceled && result.assets?.[0]) {
        const selectedAsset = result.assets[0];
        setImage(selectedAsset.uri);

        // 1. Check if base64 is already there (Easiest)
        if (selectedAsset.base64) {
          setImageBase64(selectedAsset.base64);
          return;
        }

        // 2. Modern Fallback with a Promise to ensure it waits
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const res = reader.result as string;
            resolve(res.split(",")[1]); // Extract base64 part
          };
          reader.onerror = reject;
          // Use fetch to get the blob from the local URI
          fetch(selectedAsset.uri)
            .then((res) => res.blob())
            .then((blob) => reader.readAsDataURL(blob))
            .catch(reject);
        });

        setImageBase64(base64);
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      Alert.alert("Error", "Failed to process image.");
    }
  };

  const handleSubmit = async () => {
    // Better validation: imageBase64 check is critical
    if (!title.trim() || !caption.trim() || !imageBase64) {
      Alert.alert(
        "Missing Information",
        "Please fill all fields and select an image.",
      );
      return;
    }

    setLoading(true);
    try {
      // Professional URI construction
      const fileExtension = image?.split(".").pop()?.toLowerCase() || "jpeg";
      const imageDataUrl = `data:image/${fileExtension};base64,${imageBase64}`;

      const response = await fetch(`${API_URL}/api/v1/books`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          caption: caption.trim(),
          rating: rating, // Keep as number if your backend allows it
          image: imageDataUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to post");

      Alert.alert("Success 🎉", "Recommendation shared!");

      // Clear form
      setTitle("");
      setCaption("");
      setRating(3);
      setImage(null);
      setImageBase64(null);

      router.push("/(tabs)");
    } catch (error: any) {
      Alert.alert("Upload Failed", error.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>,
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recomendation</Text>
            <Text style={styles.subtitle}>
              Share your favorite reads with others
            </Text>
          </View>

          <View style={styles.form}>
            {/* Book Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter book title"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            {/* Rating */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              {renderRatingPicker()}
            </View>

            {/* Image */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name="image-outline"
                      size={40}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.placeholderText}>
                      Tap to select image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write you review or thoughts about this book..."
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Share</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Create;
