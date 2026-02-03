import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  formData: {
    firstName: string;
    lastName: string;
    bio: string;
    location: string;
  };
  profilePicture: string | null;
  bannerImage: string | null;
  currentProfilePicture?: string;
  currentBannerImage?: string;
  saveProfile: () => void;
  updateFormField: (field: string, value: string) => void;
  pickImage: (type: "profile" | "banner") => void;
  isUpdating: boolean;
}

const EditProfileModal = ({
  formData,
  isUpdating,
  isVisible,
  onClose,
  saveProfile,
  updateFormField,
  profilePicture,
  bannerImage,
  currentProfilePicture,
  currentBannerImage,
  pickImage,
}: EditProfileModalProps) => {
  const handleSave = () => {
    saveProfile();
  };

  const inset = useSafeAreaInsets();
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={{ paddingTop: inset.top > 0 ? inset.top : 20 }}
        className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100"
      >
        <TouchableOpacity onPress={onClose}>
          <Text className="text-blue-500 text-lg">Cancel</Text>
        </TouchableOpacity>

        <Text className="text-lg font-semibold">Edit Profile</Text>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isUpdating}
          className={`${isUpdating ? "opacity-50" : ""}`}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#1DA1F2" />
          ) : (
            <Text className="text-blue-500 text-lg font-semibold">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Images Selection */}
        <View className="relative">
          <Image
            source={{
              uri:
                bannerImage ||
                currentBannerImage ||
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
            }}
            className="w-full h-40"
          />
          <TouchableOpacity
            className="absolute top-1/2 left-1/2 -ml-6 -mt-6 bg-black/40 p-3 rounded-full"
            onPress={() => pickImage("banner")}
          >
            <Feather name="camera" size={24} color="white" />
          </TouchableOpacity>

          <View className="absolute -bottom-12 left-4">
            <View className="relative">
              <Image
                source={{ uri: profilePicture || currentProfilePicture }}
                className="w-24 h-24 rounded-full border-4 border-white bg-gray-200"
              />
              <TouchableOpacity
                className="absolute top-1/2 left-1/2 -ml-5 -mt-5 bg-black/40 p-2.5 rounded-full"
                onPress={() => pickImage("profile")}
              >
                <Feather name="edit-2" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mt-16 px-4 space-y-4">
          <View>
            <Text className="text-gray-500 text-sm mb-1">First Name</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-base"
              value={formData.firstName}
              onChangeText={(text) => updateFormField("firstName", text)}
              placeholder="Your first name"
            />
          </View>

          <View>
            <Text className="text-gray-500 text-sm mb-1">Last Name</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-base"
              value={formData.lastName}
              onChangeText={(text) => updateFormField("lastName", text)}
              placeholder="Your last name"
            />
          </View>

          <View>
            <Text className="text-gray-500 text-sm mb-1">Bio</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-base"
              value={formData.bio}
              onChangeText={(text) => updateFormField("bio", text)}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View>
            <Text className="text-gray-500 text-sm mb-1">Location</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-base"
              value={formData.location}
              onChangeText={(text) => updateFormField("location", text)}
              placeholder="Where are you located?"
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default EditProfileModal;
