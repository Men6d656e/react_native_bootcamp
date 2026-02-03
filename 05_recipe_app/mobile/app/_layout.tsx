import { Slot } from "expo-router";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "@/cache/token-cache";
import SafeScreen from "@/components/SafeScreen";
import { Config } from "@/constants/Config";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

/**
 * Root layout component providing Clerk authentication and SafeScreen context.
 * Now handles font loading and global app initialization.
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    "SpaceMono": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const publishableKey = Config.CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.warn("Clerk Publishable Key is missing! Check Config.ts");
  }

  if (!loaded && !error) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <SafeScreen>
          <Slot />
        </SafeScreen>
      </ClerkLoaded>
    </ClerkProvider>
  );
}