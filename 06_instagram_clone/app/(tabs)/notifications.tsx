import { Loader } from "@/components/Loader";
import Notification from "@/components/Notification";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/notifications.styles";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { FlatList, Text, View } from "react-native";

/**
 * Notifications Screen
 * 
 * Displays a list of activity notifications for the current user.
 * Activities include likes, comments, and new followers.
 * 
 * @returns {JSX.Element} The rendered Notifications screen.
 */
export default function Notifications() {
    // Fetch notifications from Convex
    const notifications = useQuery(api.notifications.getNotifications);

    if (notifications === undefined) {
        return <Loader />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            <FlatList
                data={notifications}
                renderItem={({ item }) => <Notification notification={item} />}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<NoNotificationsFound />}
            />
        </View>
    );
}

/**
 * Component to display when no notifications are found.
 */
function NoNotificationsFound() {
    return (
        <View style={[styles.container, styles.centered]}>
            <Ionicons name="notifications-outline" size={64} color={COLORS.grey} />
            <Text style={{ fontSize: 18, fontWeight: "600", color: COLORS.white, marginTop: 16 }}>
                No notifications yet
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.grey, marginTop: 8, textAlign: "center", paddingHorizontal: 40 }}>
                When people follow you or interact with your posts, you'll see them here.
            </Text>
        </View>
    );
}