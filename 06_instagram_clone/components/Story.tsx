import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/feed.styles";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

/**
 * Interface representing the data structure for a single story.
 */
interface StoryData {
    /** Unique identifier for the story */
    id: string;
    /** Username of the story author */
    username: string;
    /** URL to the author's avatar image */
    avatar: string;
    /** Whether the user currently has an active story to view */
    hasStory: boolean;
}

/**
 * Story component that displays a user's avatar in a circular ring.
 * Used in the horizontal stories section of the feed.
 * 
 * @param {Object} props - Component props.
 * @param {StoryData} props.story - The story data to display.
 * @returns {JSX.Element} The rendered Story component.
 */
export default function Story({ story }: { story: StoryData }) {
    return (
        <TouchableOpacity
            style={styles.storyWrapper}
            activeOpacity={0.7}
            accessibilityLabel={`View ${story.username}'s story`}
        >
            <View style={[
                styles.storyRing,
                !story.hasStory && { borderColor: COLORS.grey }
            ]}>
                <Image
                    source={{ uri: story.avatar }}
                    style={styles.storyAvatar}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                />
            </View>
            <Text style={styles.storyUsername} numberOfLines={1} ellipsizeMode="tail">
                {story.username}
            </Text>
        </TouchableOpacity>
    );
}