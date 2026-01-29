import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

export const useSocialAuth = () => {
  // Change boolean to string | null
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setLoadingProvider(strategy); 
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      const err = error instanceof Error ? error.message : error;
      console.log("Error in social auth", err);
      const providerName = strategy === "oauth_google" ? "Google" : "Apple";
      Alert.alert("Error", `Failed to sign in with ${providerName}.`);
    } finally {
      setLoadingProvider(null);
    }
  };

  return {
    loadingProvider,
    handleSocialAuth,
    isAnyLoading: loadingProvider !== null,
  };
};
