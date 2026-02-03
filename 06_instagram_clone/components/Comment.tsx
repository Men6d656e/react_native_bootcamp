import { styles } from "@/styles/feed.styles";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Text, View } from "react-native";

/**
 * Interface representing the data structure for a single comment.
 */
interface IComment {
    /** The content text of the comment */
    content: string;
    /** The timestamp when the comment was created */
    _creationTime: number;
    /** The author of the comment */
    user: {
        /** Full name of the comment author */
        fullname: string;
        /** URL to the author's avatar image */
        image: string;
    };
}

/**
 * Comment Component
 * 
 * Renders an individual comment with author info, content, and timestamp.
 * 
 * @param {Object} props - Component props.
 * @param {IComment} props.comment - The comment data to display.
 * @returns {JSX.Element} The rendered Comment component.
 */
export default function Comment({ comment }: { comment: IComment }) {
    return (
        <View style={styles.commentContainer}>
            <Image
                source={{ uri: comment.user.image }}
                style={styles.commentAvatar}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
            />
            <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>{comment.user.fullname}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
                <Text style={styles.commentTime}>
                    {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
                </Text>
            </View>
        </View>
    );
}