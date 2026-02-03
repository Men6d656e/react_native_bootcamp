import { STORIES } from "@/constants/mock-data";
import { styles } from "@/styles/feed.styles";
import { ScrollView } from "react-native";
import Story from "./Story";

/**
 * StoriesSection Component
 * 
 * Renders a horizontal scrollable list of user stories.
 * Currently uses mock data but designed for future API integration.
 * 
 * @returns {JSX.Element} The rendered Stories section.
 */
const StoriesSection = () => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.storiesContainer}
            contentContainerStyle={{ paddingHorizontal: 8 }}
        >
            {STORIES.map((story) => (
                <Story key={story.id} story={story} />
            ))}
        </ScrollView>
    );
};

export default StoriesSection;