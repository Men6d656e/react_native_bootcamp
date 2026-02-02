import { Feather } from "@expo/vector-icons";
import { View, TextInput, ScrollView, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSearch } from "@/hook/useSearch";
import PostCard from "@/components/PostCard";
import { usePosts } from "@/hook/usePosts";
import { useFollow } from "@/hook/useFollow";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { useState } from "react";
import CommentsModal from "@/components/CommentsModal";

const TRENDING_TOPICS = [
  { topic: "#ReactNative", tweets: "125K" },
  { topic: "#TypeScript", tweets: "89K" },
  { topic: "#WebDevelopment", tweets: "234K" },
  { topic: "#AI", tweets: "567K" },
  { topic: "#TechNews", tweets: "98K" },
];

const SearchScreen = () => {
  const { searchQuery, setSearchQuery, searchResults, isLoading } = useSearch();
  const { toggleLike, deletePost, checkIsLiked } = usePosts();
  const { toggleFollow } = useFollow();
  const { currentUser } = useCurrentUser();
  const [selectedPost, setSelectedPost] = useState<any>(null);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color="#657786" />
          <TextInput
            placeholder="Search Twitter"
            className="flex-1 ml-3 text-base"
            placeholderTextColor="#657786"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        {isLoading ? (
          <View className="p-10 items-center">
            <ActivityIndicator size="large" color="#1DA1F2" />
          </View>
        ) : searchResults.length > 0 ? (
          <View>
            {searchResults.map((post: any) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={currentUser}
                onLike={toggleLike}
                onDelete={deletePost}
                onComment={setSelectedPost}
                onFollow={toggleFollow}
                isLiked={checkIsLiked(post.likes, currentUser)}
              />
            ))}
          </View>
        ) : searchQuery.length > 0 ? (
          <View className="p-10 items-center">
            <Text className="text-gray-500">No results found for "{searchQuery}"</Text>
          </View>
        ) : (
          <View className="p-4">
            <Text className="text-xl font-bold text-gray-900 mb-4">Trending for you</Text>
            {TRENDING_TOPICS.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="py-3 border-b border-gray-100"
                onPress={() => setSearchQuery(item.topic.replace("#", ""))}
              >
                <Text className="text-gray-500 text-sm">Trending in Technology</Text>
                <Text className="font-bold text-gray-900 text-lg">{item.topic}</Text>
                <Text className="text-gray-500 text-sm">{item.tweets} Tweets</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {selectedPost && (
        <CommentsModal
          selectedPost={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;