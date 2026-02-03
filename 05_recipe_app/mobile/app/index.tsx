import { Redirect } from "expo-router";

/**
 * Root entry point that redirects to the main tabs.
 * The Tabs layout will handle authentication checks.
 */
export default function Index() {
    return <Redirect href="/(tabs)" />;
}
