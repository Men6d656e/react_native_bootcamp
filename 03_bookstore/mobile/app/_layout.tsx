import Loader from "@/components/Loader";
import SafeScreen from "@/components/SafeScreen";
import { useAuthStore } from "@/store/authStore";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  // handle navigation based on the auth state
  useEffect(() => {
    if (isCheckingAuth) return;
    const inAuthGroup = segments[0] === "(auth)";
    const isSignedIn = !!(user && token);

    const timeout = setTimeout(() => {
      if (!isSignedIn && !inAuthGroup) {
        // Not signed in, not in auth -> Go to Login
        router.replace("/(auth)");
      } else if (isSignedIn && inAuthGroup) {
        // Signed in but in auth -> Go to App
        router.replace("/(tabs)");
      }
    }, 10);

    return () => clearTimeout(timeout);
  }, [user, token, segments, isCheckingAuth]);

  if (isCheckingAuth) {
    return <Loader />;
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
          <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
