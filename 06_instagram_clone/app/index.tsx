// app/index.tsx
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  // Keep the splash screen/loader visible while checking
  if (!isLoaded) return null;

  // This ensures that the "/" path ALWAYS points somewhere valid
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <Redirect href="/(auth)/login" />;
}