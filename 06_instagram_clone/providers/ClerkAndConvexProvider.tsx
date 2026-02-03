import { tokenCache } from "@/cache";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!convexUrl || !publishableKey) {
  throw new Error(
    "Check your .env file: EXPO_PUBLIC_CONVEX_URL and EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY must be set.",
  );
}

const convex = new ConvexReactClient(convexUrl, {
  unsavedChangesWarning: false,
});

export default function ClerkAndConvexProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
