import { Redirect } from "expo-router";

export default function Index() {
  // This is a fail-safe redirect.
  // It ensures that even if InitialLayout isn't ready, the app shows SOMETHING.
  return <Redirect href="/(auth)/login" />;
}
