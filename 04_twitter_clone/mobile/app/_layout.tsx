import "../global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="dark" />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
