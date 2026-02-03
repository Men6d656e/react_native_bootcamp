import { useAuthSync } from "@/hooks/useAuthSync";
import { useAuth } from "@clerk/clerk-expo";
import { useConvexAuth } from "convex/react";
import {
    Stack,
    useRootNavigationState,
    useRouter,
    useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoading: isConvexLoading, isAuthenticated } = useConvexAuth();
  const { isHydrated } = useAuthSync();
  const navigationState = useRootNavigationState();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Wait for EVERYTHING: Clerk, Convex, Storage (Hydration), and the Navigation Tree
    const isReady =
      isLoaded && !isConvexLoading && isHydrated && navigationState?.key;

    if (!isReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    // 2. Navigation Logic
    if (!isSignedIn && !inAuthGroup) {
      // Force user to login
      router.replace("/(auth)/login");
    } else if (isSignedIn && inAuthGroup) {
      // User is signed in, move them to the tabs
      router.replace("/(tabs)");
    } else {
      // We are where we need to be, hide splash
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [
    isLoaded,
    isConvexLoading,
    isHydrated,
    isSignedIn,
    segments,
    navigationState?.key,
  ]);

  // While waiting for auth/navigation, show a basic background that matches splash
  // This prevents the "flash of white" or "blue screen"
  if (!isLoaded || isConvexLoading || !navigationState?.key) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
