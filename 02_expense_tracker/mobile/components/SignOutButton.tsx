import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";
import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, ActivityIndicator, Alert } from "react-native";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    // 1. Prevent double clicks
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await signOut();

      // router.replace to clear navigation history
      router.replace("/(auth)/sign-in");
    } catch (err) {
      console.error("Logout Error:", err);
      Alert.alert(
        "Logout Failed",
        "We couldn't sign you out. Please check your internet connection.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.logoutButton, isLoggingOut && { opacity: 0.5 }]}
      onPress={handleSignOut}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <ActivityIndicator size="small" color={COLORS.text} />
      ) : (
        <>
          <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
        </>
      )}
    </TouchableOpacity>
  );
};
