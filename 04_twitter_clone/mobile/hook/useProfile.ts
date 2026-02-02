import { useState } from "react";
import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useApiClient } from "../utils/api";
import { useCurrentUser } from "./useCurrentUser";

export const useProfile = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  const { currentUser } = useCurrentUser();

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const data = new FormData();
      data.append("firstName", profileData.firstName);
      data.append("lastName", profileData.lastName);
      data.append("bio", profileData.bio || "");
      data.append("location", profileData.location || "");

      if (profileData.profilePicture) {
        const uri = profileData.profilePicture;
        const fileType = uri.split(".").pop().toLowerCase();
        const mimeType = fileType === "jpg" ? "image/jpeg" : `image/${fileType}`;
        data.append("profilePicture", {
          uri,
          name: `profile.${fileType}`,
          type: mimeType,
        } as any);
      }

      if (profileData.bannerImage) {
        const uri = profileData.bannerImage;
        const fileType = uri.split(".").pop().toLowerCase();
        const mimeType = fileType === "jpg" ? "image/jpeg" : `image/${fileType}`;
        data.append("bannerImage", {
          uri,
          name: `banner.${fileType}`,
          type: mimeType,
        } as any);
      }

      return api.put("/users/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setIsEditModalVisible(false);
      setProfilePicture(null);
      setBannerImage(null);
      Alert.alert("Success", "Profile updated successfully!");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.error || "Failed to update profile");
    },
  });

  const pickImage = async (type: "profile" | "banner") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: type === "profile" ? [1, 1] : [3, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === "profile") {
        setProfilePicture(result.assets[0].uri);
      } else {
        setBannerImage(result.assets[0].uri);
      }
    }
  };

  const openEditModal = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
      });
    }
    setIsEditModalVisible(true);
  };

  const updateFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate({
      ...formData,
      profilePicture,
      bannerImage,
    });
  };

  return {
    isEditModalVisible,
    formData,
    profilePicture,
    bannerImage,
    openEditModal,
    closeEditModal: () => setIsEditModalVisible(false),
    saveProfile: handleUpdateProfile,
    updateFormField,
    pickImage,
    isUpdating: updateProfileMutation.isPending,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  };
};