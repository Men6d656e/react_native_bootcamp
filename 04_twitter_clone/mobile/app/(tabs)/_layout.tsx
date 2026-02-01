import { Redirect, Stack, Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";

export default function TabsLayout() {
  const inset = useSafeAreaInsets();
  const { isSignedIn } = useAuth();

  if (!isSignedIn) return <Redirect href="/(auth)" />;

  return (
    <Tabs
      screenOptions={{
         tabBarActiveTintColor: "#1DA1F2",
        tabBarInactiveTintColor: "#657786",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E1E8ED",
          height: 60 + inset.bottom,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Feather name="bell" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Feather name="mail" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
