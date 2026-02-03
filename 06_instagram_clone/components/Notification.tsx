import { COLORS } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/notifications.styles";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

/**
 * Interface representing the notification structure.
 */
export interface INotification {
    _id: Id<"notifications">;
    _creationTime: number;
    type: "like" | "comment" | "follow";
    sender: {
        _id: Id<"users">;
        username: string;
        image: string;
    };
    post?: {
        _id: Id<"posts">;
        imageUrl: string;
    } | null;
    comment?: string;
}

/**
 * Component to render an individual notification item.
 * 
 * @param {Object} props - Component props.
 * @param {INotification} props.notification - The notification data.
 * @returns {JSX.Element} The rendered Notification item.
 */
export default function Notification({ notification }: { notification: INotification }) {
    return (
        <View style={styles.notificationItem}>
            <View style={styles.notificationContent}>
                <Link href={`/user/${notification.sender._id}`} asChild>
                    <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.7}>
                        <Image
                            source={notification.sender.image}
                            style={styles.avatar}
                            contentFit="cover"
                            transition={200}
                            cachePolicy="memory-disk"
                        />
                        <View style={styles.iconBadge}>
                            {notification.type === "like" ? (
                                <Ionicons name="heart" size={14} color={COLORS.primary} />
                            ) : notification.type === "follow" ? (
                                <Ionicons name="person-add" size={14} color="#8B5CF6" />
                            ) : (
                                <Ionicons name="chatbubble" size={14} color="#3B82F6" />
                            )}
                        </View>
                    </TouchableOpacity>
                </Link>

                <View style={styles.notificationInfo}>
                    <Link href={`/user/${notification.sender._id}`} asChild>
                        <TouchableOpacity activeOpacity={0.7}>
                            <Text style={styles.username}>{notification.sender.username}</Text>
                        </TouchableOpacity>
                    </Link>

                    <Text style={styles.action}>
                        {notification.type === "follow"
                            ? "started following you"
                            : notification.type === "like"
                                ? "liked your post"
                                : `commented: "${notification.comment}"`}
                    </Text>
                    <Text style={styles.timeAgo}>
                        {formatDistanceToNow(notification._creationTime, { addSuffix: true })}
                    </Text>
                </View>
            </View>

            {notification.post && (
                <Image
                    source={notification.post.imageUrl}
                    style={styles.postImage}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                />
            )}
        </View>
    );
}