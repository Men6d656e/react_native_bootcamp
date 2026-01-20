import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";
import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Alert, Text, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancle", style: "cancel" },
      { text: "Lohout", style: "destructive", onPress: () => signOut },
    ]);
  };
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  );
};

// import { styles } from "@/assets/styles/home.styles";
// import { COLORS } from "@/constants/colors";
// import { useClerk } from "@clerk/clerk-expo";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router"; // Use router instead of Linking
// import { useState } from "react"; // Added for loading state
// import { Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";

// export const SignOutButton = () => {
//   const { signOut } = useClerk();
//   const router = useRouter();
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   const handleSignOut = async () => {
//     // 1. Prevent double clicks
//     if (isLoggingOut) return;

//     setIsLoggingOut(true);
//     try {
//       await signOut();

//       // 2. Use router.replace to clear navigation history
//       // This prevents the user from clicking 'back' to go to the dashboard
//       router.replace("/(auth)/sign-in");
//     } catch (err) {
//       // 3. Exception Handling: Show a user-friendly Alert
//       console.error("Logout Error:", err);
//       Alert.alert(
//         "Logout Failed",
//         "We couldn't sign you out. Please check your internet connection."
//       );
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   return (
//     <TouchableOpacity
//       style={[styles.logoutButton, isLoggingOut && { opacity: 0.5 }]}
//       onPress={handleSignOut}
//       disabled={isLoggingOut} // Disable button while processing
//     >
//       {isLoggingOut ? (
//         <ActivityIndicator size="small" color={COLORS.text} />
//       ) : (
//         <>
//           <Text style={{ color: COLORS.text }}>Sign out</Text>
//           <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
//         </>
//       )}
//     </TouchableOpacity>
//   );
// };
