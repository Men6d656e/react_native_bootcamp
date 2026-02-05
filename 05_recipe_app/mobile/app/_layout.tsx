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
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) console.error("Font Load Error:", error);

    if (loaded || error) {
      // Small delay ensures the UI is ready to paint
      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 100);
    }
  }, [loaded, error]);

  const publishableKey = Config.CLERK_PUBLISHABLE_KEY;

  // If fonts aren't ready, we MUST return something or wait.
  // Returning null while the splash screen is locked is correct,
  // but we must ensure hideAsync() is eventually called.
  if (!loaded && !error) {
    return null;
  }
  console.log("Clerk Key:", publishableKey ? "FOUND" : "MISSING");
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey!}>
      {/* <ClerkLoaded> */}
      <SafeScreen>
        <Slot />
      </SafeScreen>
      {/* </ClerkLoaded> */}
    </ClerkProvider>
  );
}
