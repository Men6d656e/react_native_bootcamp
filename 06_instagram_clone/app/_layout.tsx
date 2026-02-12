import InitialLayout from "@/components/InitialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { ClerkLoaded } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Prevent auto-hiding immediately
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  useEffect(() => {
    // Hide splash screen as soon as fonts are resolved
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("#000000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  // Return null while waiting for fonts so we don't render broken text
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <ClerkLoaded>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
            <InitialLayout />
            <StatusBar style="light" />
          </SafeAreaView>
        </ClerkLoaded>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
