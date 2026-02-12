import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import StoriesSection from "@/components/Stories";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { styles } from "../../styles/feed.styles";

/**
 * Feed Screen (Index)
 *
 * Displays the main feed of posts from the community.
 * Features:
 * - Real-time post updates via Convex.
 * - Horizontal stories section.
 * - Pull-to-refresh stimulation.
 * - Quick logout access.
 *
 * @returns {JSX.Element} The rendered Feed screen.
 */
export default function Index() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Fetch feed posts from Convex
  const posts = useQuery(api.posts.getFeedPosts);

  /**
   * Handles pull-to-refresh action.
   * Note: Convex handles real-time updates, so this is mainly for UX.
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a brief delay for UX satisfaction
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  if (posts === undefined) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>spotlight</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => signOut()}
            accessibilityLabel="Log out"
            style={styles.iconButton}
          >
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<StoriesSection />}
        ListEmptyComponent={<NoPostsFound />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]} // Android
          />
        }
      />
    </View>
  );
}

/**
 * Component to display when no posts are found in the feed.
 */
const NoPostsFound = () => (
  <View style={emptyStyles.container}>
    <Ionicons name="images-outline" size={48} color={COLORS.grey} />
    <Text style={emptyStyles.text}>No posts found in your feed yet.</Text>
    <Text style={emptyStyles.subtext}>
      Join the community by sharing your first moment!
    </Text>
  </View>
);

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
    marginTop: 16,
    textAlign: "center",
  },
  subtext: {
    fontSize: 14,
    color: COLORS.grey,
    marginTop: 8,
    textAlign: "center",
  },
});
