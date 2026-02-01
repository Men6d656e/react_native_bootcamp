import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SignOutButton from "@/components/SignOutButton";
import { usePosts } from "@/hook/usePosts";
import { useUserSync } from "@/hook/useUserSync";
import PostComposer from "@/components/PostComposer";
import PostsList from "@/components/PostsList";
import { useCurrentUser } from "@/hook/useCurrentUser";

const Index = () => {
  const [isRefetching, setIsRefetching] = useState(false);
  const { refetch: refetchPosts } = usePosts();
  const { isLoading: userLoading } = useCurrentUser();

  const handlePullToRefresh = async () => {
    setIsRefetching(true);

    await refetchPosts();
    setIsRefetching(false);
  };

  useUserSync();
  if (userLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
        <Text className="text-xl font-bold text-gray-900">Home</Text>
        <SignOutButton />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handlePullToRefresh}
            tintColor={"#1DA1F2"}
          />
        }
      >
        <PostComposer />
        <PostsList />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
