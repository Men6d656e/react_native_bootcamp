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
  // const { isLoaded, isSignedIn } = useAuth();
  // const { isLoading: isConvexLoading, isAuthenticated } = useConvexAuth();
  // const { isHydrated } = useAuthSync();
  // const navigationState = useRootNavigationState();

  const { isLoaded, isSignedIn } = useAuth();
  const navigationState = useRootNavigationState();
  const segments = useSegments();
  const router = useRouter();

  // useEffect(() => {
  //   // 1. Wait for EVERYTHING: Clerk, Convex, Storage (Hydration), and the Navigation Tree
  //   const isReady =
  //   isLoaded && !isConvexLoading && isHydrated && navigationState?.key;

  //   // const isReady = isLoaded && navigationState?.key;

  //   if (!isReady) return;

  //   const inAuthGroup = segments[0] === "(auth)";

  //   // 2. Navigation Logic
  //   if (!isSignedIn && !inAuthGroup) {
  //     // Force user to login
  //     router.replace("/(auth)");
  //   } else if (isSignedIn && inAuthGroup) {
  //     // User is signed in, move them to the tabs
  //     router.replace("/(tabs)");
  //   } else {
  //     // We are where we need to be, hide splash
  //     SplashScreen.hideAsync().catch(() => {});
  //   }
  // }, [
  //   isLoaded,
  //   isConvexLoading,
  //   isHydrated,
  //   isSignedIn,
  //   segments,
  //   navigationState?.key,
  // ]);

useEffect(() => {
    // Wait for Clerk to load AND the navigation tree to be ready
    if (!isLoaded || !navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && inAuthGroup) {
      // Direct replace to the index of tabs
      router.replace("/(tabs)");
    } else if (!isSignedIn && !inAuthGroup) {
      // Force back to login if session expires
      router.replace("/(auth)/login");
    } else {
      // Once we are confirmed to be in the right place, hide splash
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoaded, isSignedIn, segments, navigationState?.key]);



if (!isLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center" }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
